(function(){
  "use strict";

  const STORAGE_KEY="rule-garden-last-promise-v1";
  const ACTIVE_SESSION_KEY="rule-garden-last-promise-active-v1";

  const $=selector=>document.querySelector(selector);

  function hasSavedChapter(){
    try{
      const raw=localStorage.getItem(STORAGE_KEY);
      const progress=raw?JSON.parse(raw):null;
      const completed=progress?.completed&&Object.keys(progress.completed).length>0;
      const unlocked=Number(progress?.unlocked)||1;
      return !!localStorage.getItem(ACTIVE_SESSION_KEY)||completed||unlocked>1;
    }catch(_error){
      return false;
    }
  }

  function syncStartCopy(){
    const button=$("#startButton");
    if(!button||hasSavedChapter())return;
    if(button.textContent!=="Teach Pip your first rule")button.textContent="Teach Pip your first rule";
  }

  function buildWelcome(){
    const welcome=$("#welcomeScreen");
    const hero=welcome?.querySelector(".heroGarden");
    const copy=welcome?.querySelector(".welcomeCopy");
    if(!welcome||!hero||!copy||welcome.dataset.introRewrite==="true")return;

    welcome.dataset.introRewrite="true";
    welcome.classList.add("introRewrite");
    hero.removeAttribute("aria-hidden");

    const shell=document.createElement("div");
    shell.className="introShell";
    welcome.insertBefore(shell,hero);
    shell.append(hero,copy);

    const kicker=copy.querySelector(".kicker");
    const heading=copy.querySelector("h1");
    const lead=copy.querySelector("p");
    const oldPromiseRow=copy.querySelector(".promiseRow");
    const startButton=$("#startButton");
    const continueButton=$("#continueButton");
    const resumeButton=$("#resumeLessonButton");

    const heroCopy=document.createElement("div");
    heroCopy.className="introHeroCopy";
    if(kicker){kicker.textContent="RULE GARDEN";heroCopy.appendChild(kicker);}
    if(heading){heading.textContent="Teach a creature a rule you never tell it.";heroCopy.appendChild(heading);}
    hero.appendChild(heroCopy);

    if(lead){
      lead.className="introLead";
      lead.textContent="Pip can't be told the rule. He can only watch what you do. Show him the right handful of examples and he'll work it out himself.";
    }

    const turn=document.createElement("div");
    turn.className="introTurn";
    turn.setAttribute("role","list");
    turn.innerHTML=`
      <div class="introTurnLabel">One turn, start to finish</div>
      <div class="introStep" role="listitem">
        <span class="introStepIcon"><img src="assets/cinematic/portraits/moth.webp" alt=""></span>
        <span><strong>A traveler arrives</strong><small>A moth with an ember waits at the bridge.</small></span>
      </div>
      <div class="introStep" role="listitem">
        <span class="introStepIcon introStepIcon--check" aria-hidden="true">✓</span>
        <span><strong>You choose what should happen</strong><small>You know the rule. Pip doesn't.</small></span>
      </div>
      <div class="introStep" role="listitem">
        <span class="introStepIcon"><img src="assets/cinematic/pip/thinking.webp" alt=""></span>
        <span><strong>Pip guesses — out loud</strong><small>“Maybe only the ones carrying fire?” Then you show him the example that proves him wrong.</small></span>
      </div>`;
    oldPromiseRow?.replaceWith(turn);

    const goal=document.createElement("div");
    goal.className="introGoal";
    goal.innerHTML=`<span class="introGoalPip" aria-hidden="true"><img src="assets/cinematic/pip/idle.webp" alt=""></span><span>Restore a Promise when Pip can use it alone, without you.</span>`;

    const actions=document.createElement("div");
    actions.className="introActions";
    [startButton,continueButton,resumeButton].forEach(button=>{if(button)actions.appendChild(button);});

    const meta=document.createElement("div");
    meta.className="introMeta";
    meta.innerHTML="<span>12 Promises</span><i>·</i><span>short lessons</span><i>·</i><span>progress saves on this device</span>";

    const lore=document.createElement("div");
    lore.className="introLore";
    lore.textContent="Mossgrove survives by twelve Promises that hold the Wilddark back. Someone is stealing them one by one.";

    copy.append(goal,actions,meta,lore);

    const description=document.querySelector('meta[name="description"]');
    if(description)description.content="Rule Garden — teach Pip a hidden rule through examples, then watch him try it alone.";

    syncStartCopy();
  }

  function rewriteOpeningStory(){
    const modal=$("#storyModal");
    if(!modal||modal.classList.contains("hidden"))return;
    const kicker=$("#storyKicker");
    const title=$("#storyTitle");
    const body=$("#storyBody");
    const button=$("#storyContinueButton");
    if(!title||!body||!button)return;

    if(title.textContent.trim()==="The night the Lantern Heart went dark."){
      kicker.textContent="THE FIRST STOLEN PROMISE";
      title.textContent="Tonight, one rule disappears.";
      body.textContent="Mossgrove survives by twelve Promises that hold the Wilddark back.\n\nBefore the festival begins, the first Flame is stolen. The Heart cracks—and Pip tumbles out with a blank notebook.\n\nHe cannot be told what the missing Promise means. He can only learn from what you show him.";
      button.textContent="Meet Pip";
      return;
    }

    if(title.textContent.trim()==="Pip cannot be told the rule."){
      kicker.textContent="YOUR FIRST LESSON";
      title.textContent="Show Pip. Then let him try.";
      body.textContent="Choose a traveler. Show what the bridge should do. Pip will keep the simplest Promise that fits every example.\n\nWhen you have shown every important part, seal the Promise and let Pip face new travelers alone.";
      button.textContent="Teach the first Promise";
    }
  }

  function init(){
    buildWelcome();
    rewriteOpeningStory();

    const welcome=$("#welcomeScreen");
    if(welcome){
      new MutationObserver(syncStartCopy).observe(welcome,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:["class"]});
    }

    const modal=$("#storyModal");
    if(modal){
      new MutationObserver(rewriteOpeningStory).observe(modal,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:["class"]});
    }
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();
