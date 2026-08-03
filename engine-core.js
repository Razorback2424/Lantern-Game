(function(){
  "use strict";

  const proofCache=new WeakMap();
  const foilCache=new WeakMap();

  function valueAt(obj,path){
    if(!path) return undefined;
    return String(path).split(".").reduce((acc,key)=>acc == null ? undefined : acc[key],obj);
  }

  function evaluateExpression(expr,caseData){
    if(!expr) return true;
    switch(expr.op){
      case "const": return !!expr.value;
      case "truthy": return !!valueAt(caseData,expr.field);
      case "falsy": return !valueAt(caseData,expr.field);
      case "eq": return valueAt(caseData,expr.field) === expr.value;
      case "neq": return valueAt(caseData,expr.field) !== expr.value;
      case "gt": return Number(valueAt(caseData,expr.field)) > Number(expr.value);
      case "gte": return Number(valueAt(caseData,expr.field)) >= Number(expr.value);
      case "lt": return Number(valueAt(caseData,expr.field)) < Number(expr.value);
      case "lte": return Number(valueAt(caseData,expr.field)) <= Number(expr.value);
      case "in": return Array.isArray(expr.values) && expr.values.includes(valueAt(caseData,expr.field));
      case "and": return (expr.args || []).every(part=>evaluateExpression(part,caseData));
      case "or": return (expr.args || []).some(part=>evaluateExpression(part,caseData));
      case "not": return !evaluateExpression(expr.arg,caseData);
      case "contains": {
        const list=valueAt(caseData,expr.field);
        return Array.isArray(list) && list.includes(expr.value);
      }
      case "before": {
        const list=valueAt(caseData,expr.field);
        if(!Array.isArray(list)) return false;
        const a=list.indexOf(expr.first),b=list.indexOf(expr.second);
        return a !== -1 && b !== -1 && a < b;
      }
      case "after": {
        const list=valueAt(caseData,expr.field);
        if(!Array.isArray(list)) return false;
        const a=list.indexOf(expr.first),b=list.indexOf(expr.second);
        return a !== -1 && b !== -1 && a > b;
      }
      case "sameFields": return valueAt(caseData,expr.left) === valueAt(caseData,expr.right);
      case "differentFields": return valueAt(caseData,expr.left) !== valueAt(caseData,expr.right);
      default: return false;
    }
  }

  function predict(rule,caseData){
    if(!rule) return null;
    if(rule.kind==="proofFoil"){
      if(evaluateExpression(rule.flipWhen,caseData)) return rule.flipAction;
      return predict(rule.baseRule,caseData);
    }
    for(const clause of (rule.clauses || [])){
      if(evaluateExpression(clause.when,caseData)) return clause.action;
    }
    return rule.fallback;
  }

  function proofFoilRules(level){
    if(foilCache.has(level)) return foilCache.get(level);
    const target=targetRule(level);
    if(!target || !(level.proofRequirements||[]).length){foilCache.set(level,[]);return [];}
    const actionIds=(level.actions||[]).map(action=>action.id);
    const foils=level.proofRequirements.map((requirement,index)=>{
      const flipAction=requirement.foilAction || actionIds.find(action=>action!==requirement.action);
      return {
        id:`__proof-foil-${requirement.id}`,
        kind:"proofFoil",
        name:`almost right: ${String(requirement.label).toLowerCase()}`,
        description:`Pip's guess matches the correct rule except for one missing part: “${requirement.label}.”`,
        complexity:Math.max(0,Number(target.complexity||1)-0.1),
        order:500+index,
        baseRule:target,
        flipWhen:requirement.when,
        flipAction
      };
    }).filter(rule=>rule.flipAction);
    foilCache.set(level,foils);
    return foils;
  }

  function orderedRules(level){
    return [...(level.rules || []),...proofFoilRules(level)].sort((a,b)=>
      Number(a.complexity||0)-Number(b.complexity||0) ||
      Number(a.order||0)-Number(b.order||0) ||
      String(a.name).localeCompare(String(b.name))
    );
  }

  function consistentRules(level,lessons){
    return orderedRules(level).filter(rule=>
      lessons.every(lesson=>predict(rule,lesson.caseData)===lesson.action)
    );
  }

  function chosenRule(level,lessons){
    return consistentRules(level,lessons)[0] || null;
  }

  function targetRule(level){
    return (level.rules || []).find(rule=>rule.id===level.targetRuleId) || null;
  }

  function casePool(level){
    const byId=new Map();
    for(const item of [...(level.teachCases||[]),...(level.challengeCases||[])]){
      if(item && item.id && !byId.has(item.id)) byId.set(item.id,item);
    }
    return [...byId.values()];
  }

  function actionDistribution(level,rules,caseData){
    const counts=Object.fromEntries((level.actions||[]).map(action=>[action.id,0]));
    for(const rule of rules){
      const action=predict(rule,caseData);
      counts[action]=(counts[action]||0)+1;
    }
    return counts;
  }

  function entropy(counts,total){
    if(!total) return 0;
    let value=0;
    for(const count of Object.values(counts)){
      if(!count) continue;
      const p=count/total;
      value-=p*Math.log2(p);
    }
    return value;
  }

  function averageCertainty(level,rules,cases){
    if(!rules.length || !cases.length) return 0;
    let sum=0;
    for(const caseData of cases){
      const counts=actionDistribution(level,rules,caseData);
      sum+=Math.max(...Object.values(counts))/rules.length;
    }
    return sum/cases.length;
  }

  function predictionSnapshot(level,lessons,caseData){
    const rules=consistentRules(level,lessons||[]);
    const chosen=rules[0]||null;
    const counts=actionDistribution(level,rules,caseData);
    const total=rules.length;
    const chosenAction=chosen?predict(chosen,caseData):null;
    const agreement=total&&chosenAction!=null?(counts[chosenAction]||0)/total:0;
    const alternatives=Object.entries(counts)
      .filter(([,count])=>count>0)
      .sort((a,b)=>b[1]-a[1]||String(a[0]).localeCompare(String(b[0])))
      .map(([action,count])=>({action,count,share:total?count/total:0}));
    return {
      chosenRule:chosen,
      chosenAction,
      agreement,
      alternatives,
      totalRules:total,
      unanimous:total>0&&agreement===1,
      ambiguous:alternatives.length>1,
      targetAction:targetRule(level)?predict(targetRule(level),caseData):null
    };
  }

  function teachingCaseInsights(level,lessons){
    const used=new Set((lessons||[]).map(item=>item.caseData.id));
    return (level.teachCases||[]).map(caseData=>({
      caseData,
      used:used.has(caseData.id),
      ...predictionSnapshot(level,lessons,caseData)
    }));
  }

  function lessonSatisfiesRequirement(level,lesson,requirement){
    if(!lesson || !requirement) return false;
    if(requirement.action && lesson.action!==requirement.action) return false;
    return evaluateExpression(requirement.when,lesson.caseData);
  }

  // A requirement and a lesson form a bipartite graph. Maximum matching ensures
  // one unusually rich demonstration cannot count as several distinct proof beats.
  function proofStatus(level,lessons){
    const requirements=level.proofRequirements || [];
    if(!requirements.length){
      return {complete:true,matchedCount:0,total:0,items:[],lessonAssignments:[]};
    }

    const lessonToRequirement=new Array(lessons.length).fill(-1);
    const requirementToLesson=new Array(requirements.length).fill(-1);

    function assign(requirementIndex,visitedLessons){
      for(let lessonIndex=0;lessonIndex<lessons.length;lessonIndex++){
        if(visitedLessons.has(lessonIndex)) continue;
        if(!lessonSatisfiesRequirement(level,lessons[lessonIndex],requirements[requirementIndex])) continue;
        visitedLessons.add(lessonIndex);
        const previousRequirement=lessonToRequirement[lessonIndex];
        if(previousRequirement===-1 || assign(previousRequirement,visitedLessons)){
          lessonToRequirement[lessonIndex]=requirementIndex;
          requirementToLesson[requirementIndex]=lessonIndex;
          return true;
        }
      }
      return false;
    }

    for(let requirementIndex=0;requirementIndex<requirements.length;requirementIndex++){
      assign(requirementIndex,new Set());
    }

    const items=requirements.map((requirement,index)=>({
      ...requirement,
      satisfied:requirementToLesson[index]!==-1,
      lessonIndex:requirementToLesson[index]
    }));
    const matchedCount=items.filter(item=>item.satisfied).length;
    return {
      complete:matchedCount===requirements.length,
      matchedCount,
      total:requirements.length,
      items,
      lessonAssignments:lessonToRequirement
    };
  }

  function nextProofRequirement(level,lessons){
    return proofStatus(level,lessons).items.find(item=>!item.satisfied) || null;
  }

  function proofWitnesses(level,requirement){
    const target=targetRule(level);
    if(!target || !requirement) return [];
    return (level.teachCases||[]).filter(caseData=>
      evaluateExpression(requirement.when,caseData) &&
      (!requirement.action || predict(target,caseData)===requirement.action)
    );
  }

  function mostInformativeTeachingCase(level,lessons){
    const used=new Set(lessons.map(item=>item.caseData.id));
    const rules=consistentRules(level,lessons);
    const target=targetRule(level);
    const chosen=rules[0] || null;
    const nextRequirement=nextProofRequirement(level,lessons);
    let best=null;
    for(const caseData of (level.teachCases||[])){
      if(used.has(caseData.id)) continue;
      const counts=actionDistribution(level,rules,caseData);
      const disagreement=entropy(counts,Math.max(1,rules.length));
      const separates=chosen && target && predict(chosen,caseData)!==predict(target,caseData) ? 4 : 0;
      const advancesProof=nextRequirement && evaluateExpression(nextRequirement.when,caseData) &&
        (!nextRequirement.action || predict(target,caseData)===nextRequirement.action) ? 5 : 0;
      const score=advancesProof+separates+disagreement+(caseData.informationWeight||0);
      if(!best || score>best.score){
        best={caseData,score,disagreement,separates:!!separates,advancesProof:!!advancesProof,requirement:nextRequirement};
      }
    }
    return best;
  }

  function selectChallengeCases(level,lessons,count){
    const rules=consistentRules(level,lessons);
    const chosen=rules[0] || null;
    const target=targetRule(level);
    const candidates=[...(level.challengeCases||[])];
    const desired=Math.min(count||level.challengeCount||4,candidates.length);
    const scored=candidates.map((caseData,index)=>{
      const counts=actionDistribution(level,rules,caseData);
      const disagreement=entropy(counts,Math.max(1,rules.length));
      const chosenMismatch=!!(chosen && target && predict(chosen,caseData)!==predict(target,caseData));
      const targetAction=target ? predict(target,caseData) : null;
      return {caseData,index,counts,disagreement,chosenMismatch,targetAction,
        score:(chosenMismatch?12:0)+disagreement*2+(caseData.challengeWeight||0)};
    });

    const selected=[];
    const selectedIds=new Set();
    const actionCoverage=new Set();

    function take(candidate){
      if(!candidate || selectedIds.has(candidate.caseData.id)) return;
      selected.push(candidate.caseData);
      selectedIds.add(candidate.caseData.id);
      actionCoverage.add(candidate.targetAction);
    }

    // A wrong learned policy must encounter at least one authored witness when one exists.
    const mismatchWitness=scored
      .filter(item=>item.chosenMismatch)
      .sort((a,b)=>b.score-a.score || a.index-b.index)[0];
    if(mismatchWitness && selected.length<desired) take(mismatchWitness);

    while(selected.length<desired){
      const remaining=scored.filter(item=>!selectedIds.has(item.caseData.id));
      if(!remaining.length) break;
      remaining.sort((a,b)=>{
        const aCoverage=actionCoverage.has(a.targetAction)?0:1.5;
        const bCoverage=actionCoverage.has(b.targetAction)?0:1.5;
        return (b.score+bCoverage)-(a.score+aCoverage) || a.index-b.index;
      });
      const pick=remaining[0];
      take(pick);
      for(const candidate of scored){
        if(selectedIds.has(candidate.caseData.id)) continue;
        const sameSignature=(level.features||[]).every(feature=>
          String(valueAt(candidate.caseData,feature.key))===String(valueAt(pick.caseData,feature.key))
        );
        if(sameSignature) candidate.score-=1.5;
      }
    }
    return selected;
  }

  function challengeCaseReason(level,lessons,caseData){
    const rules=consistentRules(level,lessons);
    const chosen=rules[0]||null;
    const target=targetRule(level);
    if(chosen && target && predict(chosen,caseData)!==predict(target,caseData)){
      return "This situation shows a clear difference between Pip's guess and the correct rule.";
    }
    const counts=actionDistribution(level,rules,caseData);
    const disagreement=entropy(counts,Math.max(1,rules.length));
    if(disagreement>.8)return "Pip's possible rules choose different actions here.";
    if(disagreement>.15)return "This situation helps choose between Pip's remaining guesses.";
    return "This situation checks whether Pip uses the rule in a new setting.";
  }

  function sentenceFragment(value){
    return String(value||"").trim().replace(/[.!?]+$/g,"");
  }

  function explainEvidence(level,rule,lesson){
    const action=(level.actions||[]).find(item=>item.id===lesson.action);
    const predicted=predict(rule,lesson.caseData);
    const agrees=predicted===lesson.action;
    return {
      agrees,
      title:lesson.caseData.name,
      text:`You showed “${action ? action.label : lesson.action}.” ${agrees ? "This matches Pip’s guess." : "This does not match Pip’s guess."} Details: ${sentenceFragment(lesson.caseData.summary)}.`
    };
  }

  function findSeparatingCase(level,lessons,learnedRule){
    const target=targetRule(level);
    if(!learnedRule || !target) return null;
    const used=new Set(lessons.map(item=>item.caseData.id));
    const rules=consistentRules(level,lessons);
    const nextRequirement=nextProofRequirement(level,lessons);
    const candidates=(level.teachCases||[]).filter(caseData=>
      !used.has(caseData.id) && predict(learnedRule,caseData)!==predict(target,caseData)
    );
    candidates.sort((a,b)=>{
      const score=caseData=>{
        const counts=actionDistribution(level,rules,caseData);
        const disagreement=entropy(counts,Math.max(1,rules.length));
        const advances=nextRequirement && lessonSatisfiesRequirement(level,{caseData,action:predict(target,caseData)},nextRequirement)?5:0;
        return advances+disagreement+(caseData.informationWeight||0);
      };
      return score(b)-score(a)||String(a.id).localeCompare(String(b.id));
    });
    return candidates[0]||null;
  }

  function ruleEquivalentOnPool(level,a,b){
    if(!a || !b) return false;
    return casePool(level).every(caseData=>predict(a,caseData)===predict(b,caseData));
  }

  function combinations(items,size){
    const result=[];
    function visit(start,chosen){
      if(chosen.length===size){ result.push([...chosen]); return; }
      for(let index=start;index<=items.length-(size-chosen.length);index++){
        chosen.push(items[index]);visit(index+1,chosen);chosen.pop();
      }
    }
    visit(0,[]);
    return result;
  }

  // Exposed for the optional validation harness. The game never calls this path.
  function minimumEquivalentTeachingSets(level){
    if(proofCache.has(level)) return proofCache.get(level);
    const target=targetRule(level);
    const teach=level.teachCases||[];
    const pool=casePool(level);
    const findings=[];
    for(let size=1;size<=Math.min(level.budget||teach.length,teach.length);size++){
      for(const subset of combinations(teach,size)){
        const lessons=subset.map(caseData=>({caseData,action:predict(target,caseData)}));
        const chosen=chosenRule(level,lessons);
        if(chosen && pool.every(caseData=>predict(chosen,caseData)===predict(target,caseData))){
          findings.push({size,caseIds:subset.map(item=>item.id),ruleId:chosen.id,proofComplete:proofStatus(level,lessons).complete});
        }
      }
      if(findings.length) break;
    }
    const result={minimum:findings[0]?.size||null,sets:findings};
    proofCache.set(level,result);
    return result;
  }

  function validateLevelDefinition(level){
    const errors=[];
    const actions=level.actions||[];
    const actionIds=new Set();
    for(const action of actions){
      if(!action?.id) errors.push("An action is missing an id.");
      else if(actionIds.has(action.id)) errors.push(`Duplicate action id: ${action.id}.`);
      else actionIds.add(action.id);
      if(!action?.label) errors.push(`Action ${action?.id||"(unknown)"} is missing a label.`);
    }
    if(actions.length<2) errors.push("A lesson requires at least two possible actions.");

    const par=Number(level.par);
    const budget=Number(level.budget);
    if(!Number.isInteger(par)||par<1) errors.push("Par must be a positive integer.");
    if(!Number.isInteger(budget)||budget<par) errors.push("Lesson budget must be an integer at least as large as par.");
    if(level.minLessons!=null && Number(level.minLessons)!==par) errors.push("Legacy minLessons must equal par.");

    const ruleIds=new Set();
    for(const rule of (level.rules||[])){
      if(!rule?.id) errors.push("A rule is missing an id.");
      else if(ruleIds.has(rule.id)) errors.push(`Duplicate rule id: ${rule.id}.`);
      else ruleIds.add(rule.id);
      if(!rule?.name) errors.push(`Rule ${rule?.id||"(unknown)"} is missing a name.`);
      if(!rule?.description) errors.push(`Rule ${rule?.id||"(unknown)"} is missing a description.`);
    }
    const featureKeys=new Set();
    for(const feature of (level.features||[])){
      if(!feature?.key)errors.push("A feature is missing a key.");
      else if(featureKeys.has(feature.key))errors.push(`Duplicate feature key: ${feature.key}.`);
      else featureKeys.add(feature.key);
    }
    const target=targetRule(level);
    if(!level.id) errors.push("Missing level id.");
    if(!target) errors.push(`Missing target rule: ${level.targetRuleId}.`);
    if(target && Number(target.complexity||0)<=0) errors.push("Target rule complexity must be above zero so unresolved proof foils can precede it.");

    const teachCases=level.teachCases||[];
    const challengeCases=level.challengeCases||[];
    const challengeCount=Number(level.challengeCount);
    if(!Number.isInteger(challengeCount)||challengeCount<1) errors.push("Challenge count must be a positive integer.");
    if(challengeCount>challengeCases.length) errors.push("Challenge count exceeds the number of authored challenge cases.");

    const caseIds=new Set();
    for(const [groupName,group] of [["teaching",teachCases],["challenge",challengeCases]]){
      if(!group.length) errors.push(`No ${groupName} cases are authored.`);
      for(const item of group){
        if(!item?.id) errors.push(`A ${groupName} case is missing an id.`);
        else if(caseIds.has(item.id)) errors.push(`Duplicate case id: ${item.id}.`);
        else caseIds.add(item.id);
        if(!item?.name) errors.push(`${groupName} case ${item?.id||"(unknown)"} is missing a name.`);
        if(!item?.summary) errors.push(`${groupName} case ${item?.id||"(unknown)"} is missing a summary.`);
      }
    }

    for(const rule of (level.rules||[])){
      if(!actionIds.has(rule.fallback)) errors.push(`Rule ${rule.id} has invalid fallback ${rule.fallback}.`);
      for(const clause of (rule.clauses||[])){
        if(!clause.when) errors.push(`Rule ${rule.id} contains a clause without a condition.`);
        if(!actionIds.has(clause.action)) errors.push(`Rule ${rule.id} has invalid action ${clause.action}.`);
      }
    }

    const requirements=level.proofRequirements||[];
    if(requirements.length!==par) errors.push("Proof requirement count must equal par.");
    const requirementIds=new Set();
    for(const requirement of requirements){
      if(!requirement.id) errors.push("A proof requirement is missing an id.");
      else if(requirementIds.has(requirement.id)) errors.push(`Duplicate proof requirement id: ${requirement.id}.`);
      else requirementIds.add(requirement.id);
      if(!requirement.label) errors.push(`Requirement ${requirement.id||"(unknown)"} is missing a label.`);
      if(!requirement.hint) errors.push(`Requirement ${requirement.id||"(unknown)"} is missing a hint.`);
      if(!requirement.when) errors.push(`Requirement ${requirement.id||"(unknown)"} is missing a condition.`);
      if(!requirement.action || !actionIds.has(requirement.action)) errors.push(`Requirement ${requirement.id} has invalid action ${requirement.action}.`);
      if(requirement.foilAction && !actionIds.has(requirement.foilAction)) errors.push(`Requirement ${requirement.id} has invalid foil action ${requirement.foilAction}.`);
      if(requirement.foilAction && requirement.foilAction===requirement.action) errors.push(`Requirement ${requirement.id} uses the same target and foil action.`);
      if(!proofWitnesses(level,requirement).length) errors.push(`Requirement ${requirement.id} has no teaching witness.`);
      if(target && !challengeCases.some(caseData=>
        evaluateExpression(requirement.when,caseData) &&
        (!requirement.action || predict(target,caseData)===requirement.action)
      )) errors.push(`Requirement ${requirement.id} has no hidden challenge witness.`);
    }

    if(target){
      const truthfulLessons=teachCases.map(caseData=>({caseData,action:predict(target,caseData)}));
      if(!proofStatus(level,truthfulLessons).complete){
        errors.push("The authored teaching cases cannot satisfy every proof requirement with distinct demonstrations.");
      }
    }

    const pool=casePool(level);
    for(const rule of orderedRules(level)){
      for(const caseData of pool){
        const action=predict(rule,caseData);
        if(!actionIds.has(action)){
          errors.push(`Rule ${rule.id} predicts invalid action ${action} for case ${caseData.id}.`);
          break;
        }
      }
    }

    if(target){
      for(const rule of orderedRules(level)){
        if(rule===target) continue;
        const differsOnPool=pool.some(caseData=>predict(rule,caseData)!==predict(target,caseData));
        const differsOnChallenge=challengeCases.some(caseData=>predict(rule,caseData)!==predict(target,caseData));
        if(differsOnPool && !differsOnChallenge){
          errors.push(`Policy ${rule.id} differs from the target but has no hidden challenge counterexample.`);
        }
      }
    }
    return errors;
  }

  function validateCampaign(levels){
    const errors=[];
    const ids=new Set();
    let previousAct=0;
    (levels||[]).forEach((level,index)=>{
      if(!level || typeof level!=="object"){errors.push(`Campaign entry ${index+1} is not a level object.`);return;}
      if(level.number!==index+1)errors.push(`${level.id||`Level ${index+1}`} is numbered ${level.number}; expected ${index+1}.`);
      if(ids.has(level.id))errors.push(`Duplicate level id: ${level.id}.`);
      ids.add(level.id);
      if(Number(level.act)<previousAct)errors.push(`Act order regresses at ${level.id}.`);
      previousAct=Math.max(previousAct,Number(level.act)||0);
      for(const error of validateLevelDefinition(level))errors.push(`${level.number}. ${level.title}: ${error}`);
    });
    if(!(levels||[]).length)errors.push("Campaign contains no levels.");
    return errors;
  }

  window.RuleGardenEngine={
    valueAt,
    evaluateExpression,
    predict,
    proofFoilRules,
    orderedRules,
    consistentRules,
    chosenRule,
    targetRule,
    casePool,
    actionDistribution,
    averageCertainty,
    predictionSnapshot,
    teachingCaseInsights,
    lessonSatisfiesRequirement,
    proofStatus,
    nextProofRequirement,
    proofWitnesses,
    mostInformativeTeachingCase,
    selectChallengeCases,
    challengeCaseReason,
    explainEvidence,
    findSeparatingCase,
    ruleEquivalentOnPool,
    minimumEquivalentTeachingSets,
    validateLevelDefinition,
    validateCampaign
  };
})();

/* Gameplay feedback layer: makes teaching choices, commitment, and progression legible
   without changing the campaign rules or the app's existing state machine. */
(function(){
  "use strict";

  const MECHANIC_LABELS=Object.freeze({
    1:"Single condition",
    2:"Either / or",
    3:"Two valid paths",
    4:"Threshold",
    5:"Sequence",
    6:"Memory",
    7:"Priority",
    8:"Context",
    9:"Matching",
    10:"Previous case",
    11:"Threshold + exception",
    12:"Ordered priorities"
  });

  const state={
    levelId:null,
    lessonCount:-1,
    rejected:new Set(),
    pendingRejected:new Set(),
    reflectionSignature:"",
    scheduled:false
  };

  const $=selector=>document.querySelector(selector);
  const $$=selector=>[...document.querySelectorAll(selector)];
  const escapeHtml=value=>String(value).replace(/[&<>'"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[char]);

  function currentLevel(){
    const levels=window.RG_LEVELS||[];
    const title=$("#levelTitle")?.textContent||"";
    const stage=$("#stageLabel")?.textContent||"";
    const match=title.match(/^\s*(\d+)\./)||stage.match(/Promise\s+(\d+)/i);
    return match?levels.find(level=>level.number===Number(match[1]))||null:null;
  }

  function parseLessonChip(chip,level){
    const match=(chip.textContent||"").trim().match(/^\d+\.\s*(.*?)\s*→\s*(.+)$/);
    if(!match)return null;
    const caseName=match[1].trim();
    const actionName=match[2].trim();
    const caseData=(level.teachCases||[]).find(item=>item.name===caseName);
    const action=(level.actions||[]).find(item=>
      item.shortLabel===actionName||item.label===actionName||item.id===actionName
    );
    return caseData&&action?{caseData,action:action.id}:null;
  }

  function currentLessons(level){
    if(!level)return [];
    return $$("#lessonTrail .lessonChip").map(chip=>parseLessonChip(chip,level)).filter(Boolean);
  }

  function visibleRules(level,lessons){
    const authored=new Set((level.rules||[]).map(rule=>rule.id));
    return window.RuleGardenEngine.consistentRules(level,lessons).filter(rule=>authored.has(rule.id));
  }

  function analyzeTeachingPath(level,lessons){
    const E=window.RuleGardenEngine;
    return lessons.map((lesson,index)=>{
      const before=lessons.slice(0,index);
      const after=lessons.slice(0,index+1);
      const beforeRules=visibleRules(level,before);
      const afterRules=visibleRules(level,after);
      const beforeProof=E.proofStatus(level,before);
      const afterProof=E.proofStatus(level,after);
      const beforeSatisfied=new Set(beforeProof.items.filter(item=>item.satisfied).map(item=>item.id));
      const gained=afterProof.items.filter(item=>item.satisfied&&!beforeSatisfied.has(item.id));
      return {
        lesson,
        beforeCount:beforeRules.length,
        afterCount:afterRules.length,
        eliminated:Math.max(0,beforeRules.length-afterRules.length),
        gained,
        contradiction:afterRules.length===0
      };
    });
  }

  function rejectedRules(level,lessons){
    const possible=new Set(visibleRules(level,lessons).map(rule=>rule.id));
    return new Set((level.rules||[]).filter(rule=>!possible.has(rule.id)).map(rule=>rule.id));
  }

  function updateInferenceState(level,lessons){
    const rejected=rejectedRules(level,lessons);
    if(state.levelId!==level.id){
      state.levelId=level.id;
      state.lessonCount=lessons.length;
      state.rejected=rejected;
      state.pendingRejected.clear();
      state.reflectionSignature="";
      return;
    }
    if(lessons.length>state.lessonCount){
      state.pendingRejected=new Set([...rejected].filter(id=>!state.rejected.has(id)));
    }else if(lessons.length<state.lessonCount){
      state.pendingRejected.clear();
    }
    state.lessonCount=lessons.length;
    state.rejected=rejected;
  }

  function updateBeliefLine(level,lessons,path){
    const copy=$("#beliefCopy");
    if(!copy)return;
    const current=visibleRules(level,lessons);
    let text;
    if(!lessons.length){
      text=`Pip is weighing ${level.rules.length} possible Promises. Each example should remove the ones that no longer fit.`;
    }else if(!current.length){
      text="These examples conflict. Pip cannot form one Promise until an example is changed or removed.";
    }else{
      const latest=path[path.length-1];
      if(current.length===1){
        text=latest.eliminated
          ?`${latest.eliminated} ${latest.eliminated===1?"Promise":"Promises"} crossed out. One clear Promise remains.`
          :"One clear Promise remains. This example confirmed it without narrowing the field further.";
      }else if(latest.eliminated){
        text=`${latest.eliminated} ${latest.eliminated===1?"Promise":"Promises"} crossed out. ${current.length} are still possible.`;
      }else if(latest.gained.length){
        text=`This example opened a new part of the Promise. ${current.length} possible Promises still fit.`;
      }else{
        text=`This example confirmed Pip's current thinking but eliminated no alternatives. ${current.length} Promises still fit.`;
      }
    }
    if(copy.textContent!==text)copy.textContent=text;
  }

  function updateNotebookActions(level,lessons){
    $$("#notebookEvidence .notebookEvidenceRow").forEach((row,index)=>{
      const lesson=lessons[index];
      const action=lesson&&(level.actions||[]).find(item=>item.id===lesson.action);
      const label=action?.shortLabel||action?.label;
      const verdict=row.querySelector("em");
      if(verdict&&label&&verdict.textContent!==label){
        verdict.textContent=label;
        verdict.title=action.label;
        verdict.setAttribute("aria-label",`Action: ${action.label}`);
      }
    });
  }

  function soundEnabled(){
    try{
      const raw=localStorage.getItem("rule-garden-last-promise-v1");
      return !raw||JSON.parse(raw)?.settings?.sound!==false;
    }catch(_error){return true;}
  }

  function audioContext(){
    const Context=window.AudioContext||window.webkitAudioContext;
    if(!Context)return null;
    window.__ruleGardenFeedbackAudio=window.__ruleGardenFeedbackAudio||new Context();
    return window.__ruleGardenFeedbackAudio;
  }

  function playTone(frequency,duration=.08,type="sine",volume=.035,delay=0){
    if(!soundEnabled())return;
    const context=audioContext();
    if(!context)return;
    const start=context.currentTime+delay;
    const oscillator=context.createOscillator();
    const gain=context.createGain();
    oscillator.type=type;
    oscillator.frequency.value=frequency;
    gain.gain.setValueAtTime(.0001,start);
    gain.gain.exponentialRampToValueAtTime(volume,start+.012);
    gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
    oscillator.connect(gain);gain.connect(context.destination);
    oscillator.start(start);oscillator.stop(start+duration+.03);
  }

  function playCue(type){
    if(type==="paper"){
      playTone(260,.055,"triangle",.018);
      playTone(390,.07,"sine",.014,.035);
    }else if(type==="seal"){
      playTone(330,.11,"triangle",.035);
      playTone(495,.13,"sine",.032,.07);
      playTone(660,.16,"sine",.025,.14);
    }else if(type==="scratch"){
      playTone(190,.045,"sawtooth",.018);
      playTone(145,.055,"triangle",.014,.045);
    }
  }

  function applyRejectedRuleFeedback(level){
    const byName=new Map((level.rules||[]).map(rule=>[rule.name,rule.id]));
    let played=false;
    $$(".rejectedRule").forEach(item=>{
      const name=item.querySelector("span")?.textContent?.trim();
      const id=byName.get(name);
      if(!id)return;
      const isNew=state.pendingRejected.has(id);
      if(isNew){
        item.classList.add("newlyRejected");
        item.classList.remove("alreadyRejected");
        setTimeout(()=>{
          if(!item.isConnected)return;
          item.classList.remove("newlyRejected");
          item.classList.add("alreadyRejected");
        },650);
        played=true;
      }else if(!item.classList.contains("newlyRejected")){
        item.classList.add("alreadyRejected");
      }
    });
    if(played){
      playCue("scratch");
      state.pendingRejected.clear();
    }
  }

  function progressFor(level){
    try{
      const raw=localStorage.getItem("rule-garden-last-promise-v1");
      const parsed=raw?JSON.parse(raw):{};
      return Number(parsed?.attempts?.[level.id])||0;
    }catch(_error){return 0;}
  }

  function updateCommitmentUI(level){
    const button=$("#beginChallengeButton");
    if(!button)return;
    const phase=document.body.dataset.gamePhase||"teaching";
    if(phase==="teaching"&&!button.disabled&&button.textContent!=="Seal the Promise"){
      button.textContent="Seal the Promise";
      button.setAttribute("aria-label","Seal Pip's learned Promise and begin the solo try");
    }
    const prompt=$("#teachingStepPrompt strong");
    if(prompt&&/Let Pip try/i.test(prompt.textContent))prompt.textContent="Step 4 · Seal the Promise";

    const mount=$("#challengeButtonMount")||button.parentElement;
    if(!mount)return;
    let status=$("#soloTryStatus");
    if(!status){
      status=document.createElement("span");
      status.id="soloTryStatus";
      status.className="soloTryStatus";
      mount.insertBefore(status,button);
    }
    const attempts=progressFor(level);
    const display=phase==="teaching"?attempts+1:Math.max(1,attempts);
    const statusText=`Solo try ${display}`;
    const statusTitle=attempts?`${attempts} solo ${attempts===1?"try":"tries"} recorded for this Promise.`:"No solo tries recorded yet.";
    if(status.textContent!==statusText)status.textContent=statusText;
    if(status.title!==statusTitle)status.title=statusTitle;
  }

  function decorateMap(){
    $$("#levelMap .levelNode").forEach((node,index)=>{
      const level=(window.RG_LEVELS||[])[index];
      if(!level)return;
      let badge=node.querySelector(".nodeMechanic");
      if(!badge){
        badge=document.createElement("span");
        badge.className="nodeMechanic";
        const meta=node.querySelector(".nodeMeta");
        meta?.after(badge);
      }
      const label=MECHANIC_LABELS[level.number]||"New rule shape";
      if(badge.textContent!==label)badge.textContent=label;
      if(node.dataset.mechanic!==label)node.dataset.mechanic=label;
    });
  }

  function teachingPathMarkup(level,lessons,path){
    const rows=path.map((step,index)=>{
      const action=(level.actions||[]).find(item=>item.id===step.lesson.action);
      const explanation=window.RuleGardenEngine.explainEvidence(level,window.RuleGardenEngine.chosenRule(level,lessons),step.lesson);
      const gain=step.gained[0]?.label||"";
      let effect;
      if(step.contradiction)effect="Created a contradiction";
      else if(step.eliminated)effect=`Crossed out ${step.eliminated} ${step.eliminated===1?"Promise":"Promises"}`;
      else if(gain)effect=`Opened: ${gain}`;
      else effect="Confirmed the current possibilities";
      return `<div class="evidenceRow teachingPathRow">
        <div class="evidenceIndex">${index+1}</div>
        <div class="teachingPathBody">
          <strong>${escapeHtml(step.lesson.caseData.name)} → ${escapeHtml(action?.shortLabel||action?.label||step.lesson.action)}</strong>
          <div class="pathMetrics"><span>${step.beforeCount} → ${step.afterCount} possible</span><span>${escapeHtml(effect)}</span></div>
          <small>${escapeHtml(explanation.text)}</small>
        </div>
      </div>`;
    }).join("");
    return `<div class="teachingPathHeading"><span>YOUR TEACHING PATH</span><strong>How each example changed Pip's thinking</strong></div>${rows}`;
  }

  function updateReflection(level,lessons,path){
    const card=$("#reflectionCard");
    if(!card||card.classList.contains("hidden")||!lessons.length)return;
    const explanation=$("#evidenceExplanation");
    const signature=`${level.id}:${lessons.map(item=>`${item.caseData.id}:${item.action}`).join("|")}:${document.body.dataset.gamePhase}`;
    if(explanation&&state.reflectionSignature!==signature){
      explanation.innerHTML=teachingPathMarkup(level,lessons,path);
      state.reflectionSignature=signature;
    }
    let badge=$("#firstLightBadge");
    if(!badge){
      badge=document.createElement("div");
      badge.id="firstLightBadge";
      badge.className="firstLightBadge";
      $("#reflectionSummary")?.after(badge);
    }
    const success=/Promise works/i.test($("#reflectionTitle")?.textContent||"");
    const attempts=Math.max(1,progressFor(level));
    badge.classList.toggle("firstLightBadge--earned",success&&attempts===1);
    badge.classList.toggle("firstLightBadge--retry",!success||attempts>1);
    const badgeText=success&&attempts===1
      ?"✦ First Light · understood on the first solo try"
      :`Solo try ${attempts} · ${success?"Promise restored":"revise and seal again"}`;
    if(badge.textContent!==badgeText)badge.textContent=badgeText;
  }

  function refresh(){
    state.scheduled=false;
    const level=currentLevel();
    decorateMap();
    if(!level)return;
    const lessons=currentLessons(level);
    updateInferenceState(level,lessons);
    const path=analyzeTeachingPath(level,lessons);
    updateBeliefLine(level,lessons,path);
    updateNotebookActions(level,lessons);
    applyRejectedRuleFeedback(level);
    updateCommitmentUI(level);
    updateReflection(level,lessons,path);
  }

  function scheduleRefresh(){
    if(state.scheduled)return;
    state.scheduled=true;
    requestAnimationFrame(refresh);
  }

  function onClick(event){
    const button=event.target.closest?.("button");
    if(!button)return;
    if(button.id==="openNotebookButton"||button.id==="closeNotebookButton")playCue("paper");
    if(button.id==="beginChallengeButton"&&!button.disabled){
      button.classList.add("isSealing");
      document.body.classList.add("promiseSealing");
      playCue("seal");
      setTimeout(()=>{
        button.classList.remove("isSealing");
        document.body.classList.remove("promiseSealing");
      },700);
    }
  }

  function init(){
    document.addEventListener("click",onClick,true);
    new MutationObserver(scheduleRefresh).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:["class","disabled","data-game-phase"]});
    scheduleRefresh();
  }

  window.RuleGardenFeedback={currentLevel,currentLessons,visibleRules,analyzeTeachingPath,rejectedRules,refresh};
  if(document.readyState==="loading")window.addEventListener("DOMContentLoaded",init,{once:true});
  else setTimeout(init,0);
})();
