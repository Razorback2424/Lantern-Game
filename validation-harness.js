(function(){
  "use strict";
  const E=window.RuleGardenEngine;
  const LEVELS=window.RG_LEVELS;
  const $=selector=>document.querySelector(selector);

  function combinations(items,size){
    const result=[];
    function visit(start,chosen){
      if(chosen.length===size){result.push([...chosen]);return;}
      for(let index=start;index<=items.length-(size-chosen.length);index++){
        chosen.push(items[index]);visit(index+1,chosen);chosen.pop();
      }
    }
    visit(0,[]);return result;
  }

  function targetLessons(level,cases){
    const target=E.targetRule(level);
    return cases.map(caseData=>({caseData,action:E.predict(target,caseData)}));
  }

  function proofAnalysis(level){
    const teach=level.teachCases||[];
    const successful=[];
    for(let size=1;size<=Math.min(level.budget,teach.length);size++){
      for(const subset of combinations(teach,size)){
        const lessons=targetLessons(level,subset);
        if(E.proofStatus(level,lessons).complete) successful.push({size,ids:subset.map(item=>item.id)});
      }
      if(successful.length) break;
    }
    return {
      minimum:successful[0]?.size||null,
      minimumSets:successful,
      matchesPar:successful[0]?.size===level.par
    };
  }

  function adaptiveExamAnalysis(level){
    const target=E.targetRule(level);
    const teach=level.teachCases||[];
    let eligibleSets=0;
    const failures=[];
    const expectedCount=Math.min(level.challengeCount,(level.challengeCases||[]).length);
    for(let size=1;size<=Math.min(level.budget,teach.length);size++){
      for(const subset of combinations(teach,size)){
        const lessons=targetLessons(level,subset);
        if(!E.proofStatus(level,lessons).complete) continue;
        const learned=E.chosenRule(level,lessons);
        if(!learned) continue;
        eligibleSets++;
        const mismatchPool=(level.challengeCases||[]).filter(caseData=>E.predict(learned,caseData)!==E.predict(target,caseData));
        const selected=E.selectChallengeCases(level,lessons,level.challengeCount);
        const missingWitness=mismatchPool.length && !selected.some(caseData=>E.predict(learned,caseData)!==E.predict(target,caseData));
        const badCount=selected.length!==expectedCount;
        const missingReason=selected.some(caseData=>!String(E.challengeCaseReason?.(level,lessons,caseData)||"").trim());
        if(missingWitness||badCount||missingReason){
          failures.push({ids:subset.map(item=>item.id),learned:learned.id,mismatchIds:mismatchPool.map(item=>item.id),selected:selected.map(item=>item.id),missingWitness,badCount,missingReason});
        }
      }
    }
    return {eligibleSets,failures,witnessGuaranteed:failures.length===0,expectedCount};
  }

  function punctuationAnalysis(level){
    const target=E.targetRule(level);
    const caseData=level.teachCases[0];
    const lesson={caseData,action:E.predict(target,caseData)};
    const text=E.explainEvidence(level,target,lesson).text;
    return {text,clean:!/[.!?]{2,}$/.test(text)};
  }

  function predictionAnalysis(level){
    const target=E.targetRule(level);
    const actions=new Set((level.actions||[]).map(action=>action.id));
    const pool=E.casePool(level);
    const failures=[];
    let checked=0;
    for(let size=1;size<=Math.min(level.budget,level.teachCases.length);size++){
      for(const subset of combinations(level.teachCases,size)){
        const lessons=targetLessons(level,subset);
        const rules=E.consistentRules(level,lessons);
        if(!rules.length)continue;
        for(const caseData of pool){
          checked++;
          const snapshot=E.predictionSnapshot(level,lessons,caseData);
          const invalidAction=snapshot.chosenAction!=null&&!actions.has(snapshot.chosenAction);
          const invalidAgreement=!Number.isFinite(snapshot.agreement)||snapshot.agreement<0||snapshot.agreement>1;
          const countMismatch=snapshot.totalRules!==rules.length;
          const targetMismatch=snapshot.targetAction!==E.predict(target,caseData);
          if(invalidAction||invalidAgreement||countMismatch||targetMismatch){
            failures.push({caseId:caseData.id,lessonIds:subset.map(item=>item.id),invalidAction,invalidAgreement,countMismatch,targetMismatch,snapshot});
          }
        }
      }
    }
    return {checked,failures,clean:failures.length===0};
  }

  function run(){
    const campaignErrors=typeof E.validateCampaign==="function"?E.validateCampaign(LEVELS):[];
    const globalErrors=[];
    const ids=new Set();
    LEVELS.forEach((level,index)=>{
      if(level.number!==index+1)globalErrors.push(`Level ${level.id} has number ${level.number}; expected ${index+1}.`);
      if(ids.has(level.id))globalErrors.push(`Duplicate level id: ${level.id}.`);ids.add(level.id);
      if(index>0 && level.act<LEVELS[index-1].act)globalErrors.push(`Act order regresses at ${level.id}.`);
    });

    const rows=LEVELS.map(level=>{
      const definitionErrors=E.validateLevelDefinition(level);
      const proof=proofAnalysis(level);
      const inference=E.minimumEquivalentTeachingSets(level);
      const adaptive=adaptiveExamAnalysis(level);
      const punctuation=punctuationAnalysis(level);
      const prediction=predictionAnalysis(level);
      const pass=!definitionErrors.length && proof.matchesPar && inference.minimum===level.par && adaptive.witnessGuaranteed && punctuation.clean && prediction.clean;
      return {level:level.number,title:level.title,par:level.par,budget:level.budget,definitionErrors,proof,inference,adaptive,punctuation,prediction,pass};
    });

    const passed=rows.filter(row=>row.pass).length;
    const overall=passed===rows.length && !globalErrors.length && !campaignErrors.length;
    $("#output").innerHTML=`
      <h2 class="${overall?"pass":"fail"}">${overall?"PASS":"FAIL"} · ${passed} / ${rows.length} levels satisfy the integrity contract</h2>
      <div class="summary">
        <span class="pill">Campaign errors: ${campaignErrors.length}</span>
        <span class="pill">Global errors: ${globalErrors.length}</span>
        <span class="pill">Proof/par matches: ${rows.filter(row=>row.proof.matchesPar).length}/${rows.length}</span>
        <span class="pill">Inference/par matches: ${rows.filter(row=>row.inference.minimum===row.par).length}/${rows.length}</span>
        <span class="pill">Adaptive witnesses: ${rows.filter(row=>row.adaptive.witnessGuaranteed).length}/${rows.length}</span>
        <span class="pill">Clean evidence punctuation: ${rows.filter(row=>row.punctuation.clean).length}/${rows.length}</span>
        <span class="pill">Prediction snapshots: ${rows.filter(row=>row.prediction.clean).length}/${rows.length}</span>
      </div>
      ${campaignErrors.length?`<div class="details fail"><h3>Campaign definition errors</h3><code>${escapeHtml(campaignErrors.join("\n"))}</code></div>`:""}
      ${globalErrors.length?`<div class="details fail"><h3>Global errors</h3><code>${escapeHtml(globalErrors.join("\n"))}</code></div>`:""}
      <div style="overflow:auto;margin-top:16px"><table>
        <thead><tr><th>#</th><th>Level</th><th>Status</th><th>Proof minimum / par</th><th>Raw inference minimum</th><th>Par sets</th><th>Exam sets checked</th><th>Prediction states</th><th>Definition errors</th></tr></thead>
        <tbody>${rows.map(row=>`<tr>
          <td>${row.level}</td><td>${escapeHtml(row.title)}</td><td class="${row.pass?"pass":"fail"}">${row.pass?"PASS":"FAIL"}</td>
          <td class="${row.proof.matchesPar?"pass":"fail"}">${row.proof.minimum} / ${row.par}</td>
          <td class="${row.inference.minimum===row.par?"pass":"fail"}">${row.inference.minimum??"—"}</td>
          <td>${row.proof.minimumSets.length}</td><td>${row.adaptive.eligibleSets}</td><td class="${row.prediction.clean?"pass":"fail"}">${row.prediction.checked}</td>
          <td>${row.definitionErrors.length?`<code>${escapeHtml(row.definitionErrors.join("\n"))}</code>`:"—"}</td>
        </tr>`).join("")}</tbody>
      </table></div>
      <details class="details"><summary>Machine-readable report</summary><pre><code>${escapeHtml(JSON.stringify({overall,campaignErrors,globalErrors,rows},null,2))}</code></pre></details>`;
  }

  function escapeHtml(value){return String(value).replace(/[&<>'"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[char]);}
  $("#run").addEventListener("click",run);
})();
