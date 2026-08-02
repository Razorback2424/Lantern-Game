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
