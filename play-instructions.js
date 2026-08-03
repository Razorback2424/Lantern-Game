(function(){
  "use strict";

  const QUESTION_ENDINGS=Object.freeze({
    "bell-basics":"What should the bridge do?",
    "thirsty-beds":"What should Pip do with the wardroot?",
    "seed-gate":"What should Rootgate do?",
    "berry-basket":"What should Pip do with the ash-reader?",
    "knock-first":"What should the living glass do?",
    "rain-memory":"What should Pip do with the trail?",
    "care-first":"What should Pip do first?",
    "moon-voices":"What should the Moonhouse ask of this voice?",
    "matching-tools":"Where should Pip place the Flame?",
    "garden-rhythm":"What should Pip signal?",
    "weather-wisdom":"What should Pip do with the arch?",
    "festival-gate":"What should Pip do first?"
  });

  const state={
    scheduled:false,
    levelId:null,
    selectedId:null,
    lessonCount:0,
    outcomeText:""
  };

  const $=selector=>document.querySelector(selector);
  const $$=selector=>[...document.querySelectorAll(selector)];

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
    const caseData=(level.teachCases||[]).find(item=>item.name===match[1].trim());
    const actionName=match[2].trim();
    const action=(level.actions||[]).find(item=>
      item.shortLabel===actionName||item.label===actionName||item.id===actionName
    );
    return caseData&&action?{caseData,action:action.id}:null;
  }

  function currentLessons(level){
    return $$("#lessonTrail .lessonChip").map(chip=>parseLessonChip(chip,level)).filter(Boolean);
  }

  function selectedCase(level){
    const selected=$("#lessonGrid .travelerNode.selected");
    const name=selected?.querySelector("strong")?.textContent?.trim();
    return name?(level.teachCases||[]).find(item=>item.name===name)||null:null;
  }

  function trimSentence(value){
    return String(value||"").trim().replace(/[.!?]+$/g,"");
  }

  function caseQuestion(level,caseData){
    const ending=QUESTION_ENDINGS[level.id]||"What should Pip do?";
    return `${caseData.name}: ${trimSentence(caseData.summary)}. ${ending}`;
  }

  function sceneOutcome(){
    if(document.body.dataset.gamePhase!=="teaching")return "";
    const visitor=$("#visitor");
    const caption=$("#sceneCaption")?.textContent?.trim();
    if(!visitor?.classList.contains("react")||!caption)return "";
    return caption;
  }

  function teachingPrompt(level,lessons){
    const engine=window.RuleGardenEngine;
    const selected=selectedCase(level);

    if(state.levelId!==level.id){
      state.levelId=level.id;
      state.selectedId=null;
      state.lessonCount=lessons.length;
      state.outcomeText="";
    }

    if(selected){
      if(state.selectedId!==selected.id){
        state.selectedId=selected.id;
        state.outcomeText="";
      }
      return {text:caseQuestion(level,selected),kind:"act"};
    }

    state.selectedId=null;

    if(state.outcomeText&&lessons.length>=state.lessonCount){
      state.lessonCount=lessons.length;
      return {text:state.outcomeText,kind:"outcome"};
    }

    if(lessons.length<state.lessonCount)state.outcomeText="";
    state.lessonCount=lessons.length;

    const rules=engine?.consistentRules?engine.consistentRules(level,lessons):[];
    const proof=engine?.proofStatus?engine.proofStatus(level,lessons):{complete:false};

    if(lessons.length&&rules.length===0){
      return {text:"These examples conflict. Which lesson should you undo or change?",kind:"conflict"};
    }
    if(lessons.length>=Number(level.budget||0)&&!proof.complete){
      return {text:"You used every example slot. Which lesson should you undo or change?",kind:"full"};
    }
    if(proof.complete&&rules.length){
      return {text:"Pip has seen every important part. Ready to let him try alone?",kind:"test"};
    }
    if(lessons.length){
      return {text:"Which traveler would teach Pip something different?",kind:"repeat"};
    }
    return {text:"Which traveler should Pip study first?",kind:"pick"};
  }

  function setPrompt(prompt,text,kind){
    const desiredClass=`teachingStepPrompt playInstructionPrompt state-${kind}`;
    const strong=prompt.querySelector(":scope > strong");
    if(!strong||prompt.childElementCount!==1){
      const replacement=document.createElement("strong");
      replacement.textContent=text;
      prompt.replaceChildren(replacement);
    }else if(strong.textContent!==text){
      strong.textContent=text;
    }
    if(prompt.className!==desiredClass)prompt.className=desiredClass;
    if(prompt.dataset.instructionState!==kind)prompt.dataset.instructionState=kind;
    if(prompt.getAttribute("aria-live")!=="polite")prompt.setAttribute("aria-live","polite");
    if(prompt.getAttribute("aria-atomic")!=="true")prompt.setAttribute("aria-atomic","true");
  }

  function rewriteKeyboardGuide(){
    $$(".keyboardGuide span").forEach(item=>{
      const text=item.textContent||"";
      if(/fold notebook/i.test(text)){
        const key=item.querySelector("kbd")?.outerHTML||"<kbd>N</kbd>";
        item.innerHTML=`${key} notebook`;
      }else if(/let Pip try when ready/i.test(text)){
        const key=item.querySelector("kbd")?.outerHTML||"<kbd>Enter</kbd>";
        item.innerHTML=`${key} seal the Promise`;
      }
    });
  }

  function refresh(){
    state.scheduled=false;
    rewriteKeyboardGuide();

    if(document.body.dataset.screen!=="play"){
      document.body.classList.remove("playInstructionOutcome");
      return;
    }

    const prompt=$("#teachingStepPrompt");
    const level=currentLevel();
    if(!prompt||!level)return;

    const phase=document.body.dataset.gamePhase||"teaching";
    let instruction;

    if(phase==="exam"){
      state.outcomeText="";
      instruction={text:"Pip is using the Promise alone.",kind:"exam"};
    }else if(phase==="reflection"||phase==="committed"){
      state.outcomeText="";
      instruction={text:"What did your examples teach Pip?",kind:"reflection"};
    }else{
      const outcome=sceneOutcome();
      if(outcome){
        state.outcomeText=outcome;
        state.lessonCount=currentLessons(level).length+1;
      }
      instruction=teachingPrompt(level,currentLessons(level));
    }

    document.body.classList.toggle("playInstructionOutcome",instruction.kind==="outcome");
    const decision=$("#decisionColumn");
    if(decision&&decision.getAttribute("aria-label")!==instruction.text)decision.setAttribute("aria-label",instruction.text);
    setPrompt(prompt,instruction.text,instruction.kind);
  }

  function scheduleRefresh(){
    if(state.scheduled)return;
    state.scheduled=true;
    requestAnimationFrame(refresh);
  }

  function init(){
    document.body.classList.add("playInstructionsRewrite");
    new MutationObserver(scheduleRefresh).observe(document.body,{
      subtree:true,
      childList:true,
      characterData:true,
      attributes:true,
      attributeFilter:["class","disabled","data-game-phase","data-screen"]
    });
    scheduleRefresh();
  }

  window.RuleGardenPlayInstructions={currentLevel,currentLessons,selectedCase,caseQuestion,refresh};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();
