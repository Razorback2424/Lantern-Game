(function(){
  "use strict";

  const E=window.RuleGardenEngine;
  const LEVELS=window.RG_LEVELS;
  const CONTENT_REVISION="2.0";
  const STORAGE_KEY="rule-garden-last-promise-v1";
  const ACTIVE_SESSION_KEY="rule-garden-last-promise-active-v1";
  const LEGACY_STORAGE_KEYS=[];
  const LEGACY_ACTIVE_SESSION_KEYS=[];
  const REVIEW_TOOLS=new URLSearchParams(window.location.search).has("review");
  const PHASES=Object.freeze({TEACHING:"teaching",EXAM:"exam",REFLECTION:"reflection",COMMITTED:"committed"});
  const STORY_BEATS=Object.freeze({
    "bell-basics":{
      character:"Rowan",role:"Senior Keeper",icon:"🔥",
      job:"Hold the fading Bridge of Embers.",
      problem:"The Welcome Promise has vanished. The bridge can still carry travelers who bring a living ember home, but every unnecessary crossing tears away more light.",
      stakes:"Fear and shouting are dramatic, but they do not make the bridge safe. A wrong lesson could strand a true ember-bearer or collapse the crossing for everyone.",
      solo:"The next travelers are already emerging from the Wilddark. Pip must choose who receives the bridge while Rowan braces the Heart.",
      success:"The ember-bearers cross and the bridge keeps enough light to survive. Pip finds silver ash pressed into the fracture—evidence that the Flame was removed by hand.",
      failure:"The bridge spends light on the wrong traveler or fails a true ember-bearer. Pip needs an example that isolates the living ember from fear and noise.",
      completionTitle:"The first Promise returns."
    },
    "thirsty-beds":{
      character:"Juniper",role:"Ward-gardener and medic",icon:"🌿",
      job:"Heal the wardroots before the Wilddark enters through them.",
      problem:"Some roots are failing because their inner light is dim. Others are splitting even while their light stays bright.",
      stakes:"Both wounds open the same danger. Teaching only one sign would leave half the living wall unprotected.",
      solo:"Juniper must hold the outer roots together. Pip will inspect the next wardroots alone.",
      success:"The two kinds of wounds close and the valley wall steadies. Silver ash appears beneath both, proving the failures belong to the same theft.",
      failure:"Pip misses one kind of wound or binds a healthy root. Juniper asks for examples that show each valid reason separately.",
      completionTitle:"Two wounds. One need."
    },
    "seed-gate":{
      character:"Juniper",role:"Ward-gardener and medic",icon:"⛩️",
      job:"Open Rootgate for the helpers who can pursue the thief.",
      problem:"Keepers carry seals. Medics carry medicine. Either may enter, and Pip must learn that one title is not the only kind of help.",
      stakes:"A narrow rule locks out needed help. Rootgate needs a Promise that recognizes both ways someone can serve the valley.",
      solo:"Rowan and Juniper are splitting the search. Pip must judge the next arrivals without asking which title matters more.",
      success:"Both kinds of helpers pass and the rootlings remain asleep. Rootgate records that the thief used a service route known only to senior apprentices.",
      failure:"A needed helper waits outside Rootgate. Pip needs examples that show both valid paths into the protected route.",
      completionTitle:"The thief knew the old way in."
    },
    "berry-basket":{
      character:"Lumi",role:"Lanternwright",icon:"⚡",
      job:"Give the forge enough power to identify the silver ash.",
      problem:"The ash-reader reveals its maker only when at least two stable sparks enter together. One spark looks bright but cannot hold the pattern.",
      stakes:"Too little power destroys the evidence. Waiting too long lets the trail cool and disappear.",
      solo:"Lumi is inside the forge aligning the glass. Pip must decide when the charge is truly ready.",
      success:"The reader burns an apprentice seal into the glass: Sable Vey. Lumi recognizes the mark before she hides her reaction.",
      failure:"The reader fires below a stable charge or lets a ready pattern fade. Pip needs the exact boundary between almost enough and enough.",
      completionTitle:"A name appears in the glass."
    },
    "knock-first":{
      character:"Lumi",role:"Lanternwright",icon:"◇",
      job:"Cross the living Glassworks without shattering the path.",
      problem:"The glass must be warned before weight touches it. Knocking and entering are both correct actions, but the reverse order is dangerous.",
      stakes:"One broken pane will seal the pursuit route and release cutting glass echoes into the district.",
      solo:"Lumi is reading Sable's marks on the far wall. Pip must guide the next travelers across in the safe order.",
      success:"The panes soften into a path. Sable has written across the last one: “A rule that cannot hear why is only a lock.”",
      failure:"The glass is surprised by the wrong sequence or closes on an incomplete one. Pip needs examples where order—not politeness or volume—decides.",
      completionTitle:"Sable leaves a question behind."
    },
    "rain-memory":{
      character:"Juniper",role:"Ward-gardener and medic",icon:"◫",
      job:"Prove which silver trail belongs to Sable.",
      problem:"Forge soot can survive one morning. An Unbinder trail remains after the night wind clears ordinary dust.",
      stakes:"Follow too early and the group loses hours in a false path. Wait after two mornings and Black Rain will erase the real route.",
      solo:"Juniper is comparing the old storm maps. Pip must use what happened yesterday to judge what the ash means today.",
      success:"The second morning confirms the route. Sable steps from the mist and asks Pip whether perfect obedience would have saved her brother.",
      failure:"Pip turns one morning into certainty or ignores a confirmed pattern. The trail needs an example that makes history matter.",
      completionTitle:"The Unbinder steps from the mist."
    },
    "care-first":{
      character:"Juniper",role:"Ward-gardener and medic",icon:"💚",
      job:"Choose what matters first when the ward collapses.",
      problem:"Juniper is injured beneath a living arch while a stolen Promise Flame slides toward the Wilddark.",
      stakes:"The Flame matters to the whole valley. Juniper matters now. The lesson is not only what to do—it is what the Promise exists to protect.",
      solo:"The next collapse will happen too quickly for instructions. Pip must choose the first duty from the rule you teach.",
      success:"Pip reaches Juniper before the Flame. Sable stops because the new Promise has done what the old Gate could not: choose a person first.",
      failure:"Pip performs a useful task before urgent care. The examples need to show that priority is part of the Promise, not an afterthought.",
      completionTitle:"Pip chooses a person first."
    },
    "moon-voices":{
      character:"Tovin's Echo",role:"An unfinished intention",icon:"🌙",
      job:"Hear the truth inside the Moonhouse without waking its lantern moths.",
      problem:"Strong voices wake old echoes during the day. After sunset, the same volume wakes the moths and scatters every memory in the room.",
      stakes:"The wrong context either silences Tovin or destroys the only remaining witness to the Black Rain.",
      solo:"Lumi is tuning the echo lanterns. Pip must guide each voice according to the hour, not the speaker's identity.",
      success:"The moths remain asleep. Tovin's echo completes its sentence: “I gave it away.” Rowan can no longer hide what the Gate failed to understand.",
      failure:"The echo is too faint or the moths wake and scatter it. Pip needs examples where the same voice changes with the setting.",
      completionTitle:"The missing context returns."
    },
    "matching-tools":{
      character:"Lumi",role:"Lanternwright",icon:"✦",
      job:"Return the scattered Promise Flames to the Heart.",
      problem:"Sable's Unbinding has thrown similar Flames beside the wrong channels. A Flame belongs only where its rune matches the channel's rune.",
      stakes:"A mismatched Flame sends the wrong Promise through the valley. Urgency cannot turn a false match into a true one.",
      solo:"Lumi is holding the channels open. Pip must compare both runes and place each Flame without guessing from color or panic.",
      success:"The matched Flames remember their places. Across Mossgrove, broken systems begin waking—but the final Flame is still with Sable.",
      failure:"Two different Promises collide or a true match waits outside. Pip needs examples that compare the relationship directly.",
      completionTitle:"The Heart remembers most of itself."
    },
    "garden-rhythm":{
      character:"Lumi",role:"Lanternwright",icon:"≠",
      job:"Find the real path through Sable's Echo Procession.",
      problem:"The road repeats perfect copies of the group. A real turn appears only when the current sigil differs from the previous one.",
      stakes:"Judge a sigil by itself and the group will walk the same road forever while the Unbinding continues.",
      solo:"Lumi is decoding the procession rhythm. Pip must signal only genuine changes in the sequence.",
      success:"The repeats fold away and the true path opens. Lumi uses everything Sable taught her to lead the pursuit against Sable's choice.",
      failure:"Pip follows a repeat or misses a change. The examples need to compare each echo with what came immediately before.",
      completionTitle:"Lumi stops following and starts choosing."
    },
    "weather-wisdom":{
      character:"Juniper",role:"Ward-gardener and medic",icon:"☂",
      job:"Keep the living arches open before the Black Rain arrives.",
      problem:"Clear heat at 28 degrees or higher will curl the arches shut. Black Rain will cool them safely—but added water before it arrives will split the stone.",
      stakes:"This is no longer one flower bed. One wrong general rule can close the only route to the Heart.",
      solo:"Juniper is holding the rear ward. Pip must read the exact heat boundary and the storm exception for the entire path.",
      success:"The overheated arches cool and the rain-bound arches stay dry. The route holds as the first black drops reach Mossgrove.",
      failure:"An arch scorches or splits beneath unnecessary water. Pip needs the exact threshold and the exception that changes it.",
      completionTitle:"The path survives the first Black Rain."
    },
    "festival-gate":{
      character:"Pip",role:"The living draft",icon:"✦",
      job:"Write the Last Promise inside the breaking Heart.",
      problem:"Sable is injured beside the final Flame. Rowan arrives with the Keeper seal. Lumi's warning destabilizes the chamber. Every choice matters at once.",
      stakes:"The old order would secure authority and the Flame first. The new Promise must prove what all the other rules were for.",
      solo:"No one commands Pip now. Your examples are the only preparation Pip carries into the fracture.",
      success:"Pip crosses the fracture and saves Sable before touching the Flame. The Promise chooses urgent care, then stable help, then restraint.",
      failure:"Pip protects authority, order, or the Flame while a person remains in danger. The final examples must make the purpose of the Promise unmistakable.",
      completionTitle:"The Last Promise chooses care."
    }
  });

  const INTERLUDES=Object.freeze({
    "bell-basics":{
      kicker:"THE FIRST CLUE",title:"This was not an accident.",icon:"✧",
      body:`The Welcome Flame did not burn out. It was lifted cleanly from the Heart.

Silver ash clings to the fracture—the signature of an Unbinder, a craft Rowan insists has been gone for years.`
    },
    "berry-basket":{
      kicker:"THE NAME IN THE GLASS",title:"Sable Vey is alive.",icon:"⚡",
      body:`Rowan calls Sable dangerous and orders the seal covered. He will not say why his former apprentice would steal the Promises.

Lumi says nothing. Pip notices silver ash already hidden beneath her glove.`
    },
    "rain-memory":{
      kicker:"THE UNBINDER",title:"The rule chose a mark over a person.",icon:"◐",
      body:`Sable says her brother Tovin returned during the Black Rain without his Keeper mark. The Lantern Gate refused him, and the Wilddark took him.

“Teach Pip every rule you like,” she tells Rowan. “Will perfect obedience make that choice kind?”`
    },
    "care-first":{
      kicker:"THE CHILD AT THE GATE",title:"Juniper was the one Tovin saved.",icon:"💚",
      body:`Juniper opens her medical satchel and reveals a worn Keeper mark.

Tovin found her outside the walls during the Black Rain. He gave her the mark so the Gate would admit her. The Gate then rejected him.

Sable has spent years believing the mark was simply lost.`
    },
    "moon-voices":{
      kicker:"THE WHOLE TRUTH",title:"“I knew. I delayed. Then I lied.”",icon:"🌙",
      body:`Tovin's echo repeats the missing intention: “I gave it away.”

Rowan admits he knew the Gate had no emergency exception before the storm. He postponed the repair, then protected the Heart's reputation instead of telling the truth.

Lumi confesses that she helped Sable enter. Sable takes the remaining Flames and heads for the Heart. “Then magic did not fail us alone,” she says. “People made it unquestionable.”`
    },
    "garden-rhythm":{
      kicker:"THE UNBINDING",title:"Mossgrove begins to forget itself.",icon:"✺",
      body:`Sable scatters Heart-magic into hundreds of private lanterns. For one beautiful moment, every home shines with its own power.

Then fear gives the Wilddark a hundred conflicting shapes.

Rowan removes the Keeper seal from his coat. “I do not get to command what comes next,” he says. “Pip does.”`
    },
    "weather-wisdom":{
      kicker:"AT THE HEART",title:"No one commands Pip now.",icon:"☂",
      body:`The final path opens into the fractured Lantern Heart.

Sable holds the last Flame inside the Unbinding Crown. Rowan has authority. Lumi has the warning. Juniper has the truth.

Only Pip can decide what the new Promise values first.`
    },
    "festival-gate":{
      kicker:"A PROMISE CHOSEN TOGETHER",title:"Teach it better.",icon:"✦",
      body:`Pip saves Sable before touching the Flame. Outside, ordinary residents form a lantern line and hold the Wilddark together—not because the Heart commands them, but because they choose the same promise.

Rowan confesses publicly and steps down. Sable returns the final Flame after Mossgrove agrees that no Promise will ever again belong to one unquestioned Keeper.

The Heart is rebuilt with community-held witness lanterns and a Circle of Listeners. Pip becomes the first Listening Keeper: trusted not because Pip never learns the wrong rule, but because Pip can change when new evidence reveals harm.

Tovin's echo releases its final words: “I gave it away. The gate did exactly what we taught it. Teach it better.”

Every resident raises one lantern. The festival begins.`
    }
  });
  const $=selector=>document.querySelector(selector);
  let notebookReturnFocus=null;

  function mountNewPlayShell(){
    const shell=$("#newPlayShell");
    if(!shell || shell.dataset.mounted)return;
    document.body.classList.add("newPlayShell");
    $("#stageWorldMount").appendChild($(".worldCard"));
    $("#travelerRail").appendChild($("#lessonGrid"));
    $("#decisionPromptMount").appendChild($("#teachingStepPrompt"));
    $("#decisionActionsMount").appendChild($("#teachPanel"));
    $("#challengeButtonMount").appendChild($("#beginChallengeButton"));
    shell.appendChild($("#notebookCard"));
    shell.after($("#challengeCard"),$("#reflectionCard"));
    $("#openNotebookButton").onclick=()=>openNotebook();
    $("#closeNotebookButton").onclick=()=>closeNotebook();
    $("#notebookBackdrop").onclick=()=>closeNotebook();
    shell.dataset.mounted="true";
  }

  function notebookIsOpen(){return $("#notebookCard")?.classList.contains("open");}
  function openNotebook(){
    if(!play.level)return;
    notebookReturnFocus=document.activeElement;
    const card=$("#notebookCard");
    card.classList.add("open");
    card.querySelector(".notebookSpread").setAttribute("aria-hidden","false");
    requestAnimationFrame(()=>card.querySelector("#closeNotebookButton")?.focus());
  }
  function closeNotebook(){
    const card=$("#notebookCard");
    if(!card)return;
    card.classList.remove("open");
    card.querySelector(".notebookSpread").setAttribute("aria-hidden","true");
    notebookReturnFocus?.focus?.({preventScroll:true});
  }

  function updateStageShell(){
    if(!play.level)return;
    const level=play.level;
    $("#stageLabel").textContent=`Act ${["I","II","III"][Math.max(0,level.act-1)]} · Promise ${level.number} · ${level.title}`;
    $("#stageCounter").textContent=`Example ${Math.min(play.lessons.length+1,level.budget)} of ${level.budget}`;
    $("#lanternMeter").innerHTML=LEVELS.map((item,index)=>`<span class="${item.id===level.id?"current":""} ${progress.completed[item.id]?"done":""}" title="${escapeHtml(item.title)}"></span>`).join("");
  }

  function updateBeliefLine(){
    if(!play.level)return;
    const rules=E.consistentRules(play.level,play.lessons);
    let copy="Pip has narrowed it down to a few possible Promises — he still isn't sure whether fear changes anything.";
    if(play.lessons.length&&rules.length===0)copy="That surprised Pip. He's reopened a Promise he had already crossed out.";
    else if(play.lessons.length&&rules.length<=3)copy="Pip crossed out two more Promises. He's close to one clear rule now.";
    $("#beliefCopy").textContent=copy;
  }

  function renderNotebookSpread(){
    if(!play.level)return;
    const level=play.level;
    const rules=E.consistentRules(level,play.lessons);
    const proof=E.proofStatus(level,play.lessons);
    $("#notebookGoal").textContent=level.goal;
    $("#notebookEvidence").innerHTML=play.lessons.length?play.lessons.map(lesson=>{
      const action=level.actions.find(item=>item.id===lesson.action);
      const verdict=action?.id===level.actions[0]?.id?"crossed":"waited";
      return `<div class="notebookEvidenceRow"><div class="portraitMini portraitMini--${escapeHtml(lesson.caseData.species||"creature")}">${portraitMarkup(lesson.caseData)}</div><div><strong>${escapeHtml(lesson.caseData.name)}</strong><small>${escapeHtml(lesson.caseData.summary)}</small></div><em>${escapeHtml(verdict)}</em></div>`;
    }).join(""):`<p class="notebookWaiting">Show Pip an example and it will appear here.</p>`;
    const missing=proof.items.find(item=>!item.satisfied);
    $("#notebookSummaryStrip").textContent=missing?`Still missing: ${missing.label.toLowerCase()}.`:"Every part of the Promise has an example.";
    const rejected=level.rules.filter(rule=>!rules.some(item=>item.id===rule.id));
    const rejectedMarkup=rejected.map(rule=>{
      const killer=play.lessons.find(lesson=>E.predict(rule,lesson.caseData)!==lesson.action);
      const action=killer?actionLabel(level,killer.action):"your choice";
      return `<div class="rejectedRule"><span>${escapeHtml(rule.name)}</span><small>${killer?`${escapeHtml(killer.caseData.name)} led you to “${escapeHtml(action)}.”`:"This Promise no longer fits the examples."}</small></div>`;
    }).join("");
    const possible=rules.map(rule=>`<span class="possibleRule">${escapeHtml(rule.name)}</span>`).join("")||"<span class=\"possibleRule\">No Promise fits these examples yet.</span>";
    const right=$(".notebookPage--right");
    let inference=right.querySelector(".notebookInference");
    if(!inference){inference=document.createElement("div");inference.className="notebookInference";right.insertBefore(inference,right.querySelector(".notebookTitleRow"));}
    inference.innerHTML=`<span class="notebookEyebrow">PROMISES I'VE HAD TO CROSS OUT</span>${rejectedMarkup||"<p class=\"notebookWaiting\">No Promise has been crossed out yet.</p>"}<span class="notebookEyebrow">STILL POSSIBLE</span>${possible}`;
  }
  const storageState={available:true,error:null};

  function markStorageUnavailable(error){
    storageState.available=false;
    storageState.error=error||new Error("Browser storage is unavailable.");
    const banner=document.querySelector("#storageBanner");
    if(banner)banner.classList.remove("hidden");
  }

  function storageGet(key){
    try{return localStorage.getItem(key);}catch(error){markStorageUnavailable(error);return null;}
  }
  function storageSet(key,value){
    try{localStorage.setItem(key,value);return true;}catch(error){markStorageUnavailable(error);return false;}
  }
  function storageRemove(key){
    try{localStorage.removeItem(key);return true;}catch(error){markStorageUnavailable(error);return false;}
  }

  const defaultProgress=()=>({
    schemaVersion:4,
    unlocked:1,
    completed:{},
    attempts:{},
    storySeen:[],
    reviewer:false,
    chapterComplete:false,
    lastMistake:null,
    settings:{sound:true,reducedMotion:false,research:false,quickScenes:false}
  });

  function normalizeMistake(raw,validIds){
    if(!raw||typeof raw!=="object"||!validIds.has(raw.levelId))return null;
    const level=LEVELS.find(item=>item.id===raw.levelId);
    const caseIds=new Set([...(level?.teachCases||[]),...(level?.challengeCases||[])].map(item=>item.id));
    const actionIds=new Set((level?.actions||[]).map(item=>item.id));
    if(!caseIds.has(raw.caseId)||!actionIds.has(raw.predicted)||!actionIds.has(raw.expected))return null;
    return {levelId:raw.levelId,caseId:raw.caseId,predicted:raw.predicted,expected:raw.expected,at:Number(raw.at)||Date.now()};
  }

  function normalizeProgress(raw){
    const base=defaultProgress();
    if(!raw || typeof raw!=="object") return base;
    const validIds=new Set(LEVELS.map(level=>level.id));
    const completed={};
    for(const [id,item] of Object.entries(raw.completed||{})){
      if(!validIds.has(id) || !item || typeof item!=="object") continue;
      const stars=Math.max(0,Math.min(3,Number(item.stars)||0));
      if(stars<1) continue;
      completed[id]={
        stars,
        bestLessons:Math.max(0,Number(item.bestLessons??item.lessons)||0),
        lastLessons:Math.max(0,Number(item.lastLessons??item.lessons)||0),
        attempts:Math.max(0,Number(item.attempts)||0)
      };
    }
    const attempts={};
    for(const level of LEVELS){
      attempts[level.id]=Math.max(
        0,
        Number(raw.attempts?.[level.id])||0,
        Number(completed[level.id]?.attempts)||0
      );
    }
    const settings={
      sound:raw.settings?.sound!==false,
      reducedMotion:!!raw.settings?.reducedMotion,
      research:!!raw.settings?.research,
      quickScenes:!!raw.settings?.quickScenes
    };
    let contiguousCompleted=0;
    for(const level of LEVELS){
      if(!completed[level.id])break;
      contiguousCompleted=level.number;
    }
    const reviewer=!!raw.reviewer;
    const sequentialUnlocked=Math.min(LEVELS.length,contiguousCompleted+1);
    const unlocked=reviewer?LEVELS.length:sequentialUnlocked;
    return {
      ...base,
      schemaVersion:4,
      unlocked,
      completed,
      attempts,
      storySeen:Array.isArray(raw.storySeen)?[...new Set(raw.storySeen.filter(item=>typeof item==="string"))]:[],
      reviewer,
      chapterComplete:LEVELS.every(level=>!!completed[level.id]),
      lastMistake:normalizeMistake(raw.lastMistake,validIds),
      settings
    };
  }

  let migratedProgress=false;
  function readStoredProgress(key){
    try{
      const value=storageGet(key);
      return value?JSON.parse(value):null;
    }catch(_error){
      return null;
    }
  }

  function loadProgress(){
    const current=readStoredProgress(STORAGE_KEY);
    if(current) return normalizeProgress(current);
    for(const key of LEGACY_STORAGE_KEYS){
      const legacy=readStoredProgress(key);
      if(legacy){migratedProgress=true;return normalizeProgress(legacy);}
    }
    return defaultProgress();
  }

  let progress=loadProgress();
  let currentScreen="welcome";
  let play={
    level:null,index:-1,phase:PHASES.TEACHING,selectedId:null,lessons:[],running:false,solved:false,committed:false,
    challengeCases:[],challengeResults:[],learnedRule:null,lastScene:null,
    recommendedId:null,recommendedReason:"",attempt:0,skipRequested:false,showPredictions:false,notebookCollapsed:false
  };
  let storyAction=null;
  let audioContext=null;
  let lastFocusedElement=null;
  let sceneWaitResolver=null;
  let recoveredSession=readActiveSession();

  const HABITS=[
    {threshold:3,icon:"✦",name:"Helpful Example Finder",description:"Pip can point to an example that helps choose between two guesses."},
    {threshold:6,icon:"≈",name:"Patient Tester",description:"Pip can show how confident the current guess is."},
    {threshold:9,icon:"▣",name:"Mistake Finder",description:"After a mistake, Pip can show which example would help."},
    {threshold:12,icon:"✦",name:"Listening Keeper",description:"Pip can revise a Promise when context, evidence, or care proves the first rule incomplete."}
  ];

  function saveProgress(){
    progress=normalizeProgress(progress);
    storageSet(STORAGE_KEY,JSON.stringify(progress));
  }

  function normalizeActiveSession(raw){
    if(!raw || ![1,2].includes(Number(raw.version)) || typeof raw.levelId!=="string")return null;
    if(Number(raw.version)===2 && raw.contentRevision!==CONTENT_REVISION)return null;
    const level=LEVELS.find(item=>item.id===raw.levelId);
    if(!level)return null;
    const validCases=new Set(level.teachCases.map(item=>item.id));
    const validActions=new Set(level.actions.map(item=>item.id));
    const lessons=[];
    const usedCases=new Set();
    for(const item of Array.isArray(raw.lessons)?raw.lessons:[]){
      if(!item || !validCases.has(item.caseId) || !validActions.has(item.action) || usedCases.has(item.caseId))continue;
      lessons.push({caseId:item.caseId,action:item.action});
      usedCases.add(item.caseId);
      if(lessons.length>=level.budget)break;
    }
    return {
      version:2,
      contentRevision:CONTENT_REVISION,
      levelId:level.id,
      lessons,
      selectedId:lessons.length<level.budget&&validCases.has(raw.selectedId)&&!usedCases.has(raw.selectedId)?raw.selectedId:null,
      recommendedId:lessons.length<level.budget&&validCases.has(raw.recommendedId)&&!usedCases.has(raw.recommendedId)?raw.recommendedId:null,
      recommendedReason:typeof raw.recommendedReason==="string"?raw.recommendedReason:"",
      showPredictions:lessons.length>0&&!!raw.showPredictions,
      notebookCollapsed:!!raw.notebookCollapsed,
      savedAt:Number(raw.savedAt)||Date.now()
    };
  }

  function readActiveSession(){
    const keys=[ACTIVE_SESSION_KEY,...LEGACY_ACTIVE_SESSION_KEYS];
    for(const key of keys){
      try{
        const raw=JSON.parse(storageGet(key)||"null");
        const normalized=normalizeActiveSession(raw);
        if(!normalized)continue;
        if(key!==ACTIVE_SESSION_KEY){
          storageSet(ACTIVE_SESSION_KEY,JSON.stringify(normalized));
          storageRemove(key);
        }
        return normalized;
      }catch(_error){}
    }
    return null;
  }

  function saveActiveSession(){
    if(!play.level || play.committed || currentScreen!=="play")return;
    const payload={
      version:2,
      contentRevision:CONTENT_REVISION,
      levelId:play.level.id,
      lessons:play.lessons.map(lesson=>({caseId:lesson.caseData.id,action:lesson.action})),
      selectedId:play.selectedId,
      recommendedId:play.recommendedId,
      recommendedReason:play.recommendedReason,
      showPredictions:!!play.showPredictions,
      notebookCollapsed:!!play.notebookCollapsed,
      savedAt:Date.now()
    };
    if(storageSet(ACTIVE_SESSION_KEY,JSON.stringify(payload)))recoveredSession=payload;
  }

  function clearActiveSession(){
    recoveredSession=null;
    storageRemove(ACTIVE_SESSION_KEY);
    LEGACY_ACTIVE_SESSION_KEYS.forEach(storageRemove);
  }

  function resumeActiveSession(){
    const session=readActiveSession();
    if(!session){toast("No unfinished lesson is available.");renderWelcome();return;}
    const index=LEVELS.findIndex(level=>level.id===session.levelId);
    if(index<0){clearActiveSession();return;}
    startLevel(index,{restoreSession:session,skipStory:true});
    toast(session.lessons.length?`Restored ${session.lessons.length} example${session.lessons.length===1?"":"s"}.`:"Restored the unfinished lesson.");
  }

  if(migratedProgress){
    saveProgress();
    LEGACY_STORAGE_KEYS.forEach(storageRemove);
  }

  function completedCount(){return Object.keys(progress.completed).length;}
  function totalStars(){return Object.values(progress.completed).reduce((sum,item)=>sum+(item.stars||0),0);}
  function hasHabit(threshold){return progress.reviewer || completedCount()>=threshold;}

  function applySettings(){
    document.body.classList.toggle("reduceMotion",!!progress.settings.reducedMotion);
    document.body.classList.toggle("quickScenes",!!progress.settings.quickScenes);
    $("#soundToggle").checked=!!progress.settings.sound;
    $("#motionToggle").checked=!!progress.settings.reducedMotion;
    $("#researchToggle").checked=!!progress.settings.research;
    $("#quickToggle").checked=!!progress.settings.quickScenes;
    $("#soundButton").textContent=progress.settings.sound?"♪":"∅";
    $("#researchLens").classList.toggle("hidden",!progress.settings.research);
    $("#storageBanner").classList.toggle("hidden",storageState.available);
  }

  function setScreen(name){
    currentScreen=name;
    document.body.dataset.screen=name;
    $("#welcomeScreen").classList.toggle("hidden",name!=="welcome");
    $("#mapScreen").classList.toggle("hidden",name!=="map");
    $("#playScreen").classList.toggle("hidden",name!=="play");
    $("#homeButton").disabled=name==="welcome";
    window.scrollTo({top:0,behavior:progress.settings.reducedMotion?"auto":"smooth"});
    renderHeaderProgress();
    const labels={welcome:"Welcome to Rule Garden",map:"Chapter map",play:play.level?`Lesson ${play.level.number}: ${play.level.title}`:"Lesson"};
    $("#screenAnnouncer").textContent=labels[name]||name;
    requestAnimationFrame(()=>{
      const heading=document.querySelector(`#${name}Screen h1`);
      if(heading){heading.setAttribute("tabindex","-1");heading.focus({preventScroll:true});}
    });
  }

  function renderHeaderProgress(){
    const box=$("#chapterProgress");
    box.innerHTML=LEVELS.map(level=>{
      const done=!!progress.completed[level.id];
      const current=play.level && play.level.id===level.id && currentScreen==="play";
      return `<span class="${done?"done":""} ${current?"current":""}" title="${level.number}. ${escapeHtml(level.title)}"></span>`;
    }).join("");
    $("#chapterProgressLabel").textContent=`${completedCount()} / ${LEVELS.length}`;
  }

  function renderWelcome(){
    recoveredSession=readActiveSession();
    const hasProgress=completedCount()>0 || progress.unlocked>1;
    const hasSession=!!recoveredSession;
    $("#startButton").textContent=hasProgress||hasSession?"Start the chapter over":"Begin the chapter";
    $("#continueButton").textContent=progress.chapterComplete?"Return to completed chapter":"Continue the chapter";
    $("#continueButton").classList.toggle("hidden",!hasProgress);
    $("#resumeLessonButton").classList.toggle("hidden",!recoveredSession);
    if(recoveredSession){
      const level=LEVELS.find(item=>item.id===recoveredSession.levelId);
      $("#resumeLessonButton").textContent=`Resume ${level?.title||"unfinished lesson"}`;
    }
    applyPipAccessories($("#heroPip"));
  }

  function renderMap(){
    setScreen("map");
    renderNextLessonPanel();
    renderLevelMap();
    renderJournal();
    renderMapPip();
    const count=completedCount();
    $("#mapStoryText").textContent=count===0
      ?"The Welcome Flame is missing, the Bridge of Embers is fading, and Pip has awakened from the fracture. Follow the stolen Promises before the Wilddark learns Mossgrove's fear."
      :count<4
        ?"Silver ash links every failure. The thief is following an old Keeper route through the ward-gardens, Rootgate, and forge."
        :count<6
          ?"The ash belongs to Sable Vey, Rowan's former apprentice. Rowan knows why she returned—and is refusing to say."
          :count<8
            ?"Sable says the Lantern Gate chose a mark over her brother. Pip must discover whether a Promise can learn care instead of obedience."
            :count<11
              ?"The truth is out: Tovin gave away his mark, Rowan knew the Gate was incomplete, and Sable has begun the Unbinding. Reach the Heart before the Black Rain."
              :count<12
                ?"The path to the Heart is open. No one commands Pip now. The final Promise must decide what the whole system is for."
                :"The Heart now belongs to a Circle of Listeners. Mossgrove's Promises can be questioned, witnessed, and taught better.";
  }


  function renderNextLessonPanel(){
    const resume=readActiveSession();
    const next=resume?LEVELS.find(item=>item.id===resume.levelId):LEVELS.find(level=>!progress.completed[level.id])||LEVELS[LEVELS.length-1];
    $("#nextLessonTitle").textContent=resume?`Resume ${next.title}`:progress.chapterComplete?"Chapter complete":next.title;
    const nextStory=STORY_BEATS[next.id];
    $("#nextLessonCopy").textContent=resume
      ?`${resume.lessons.length} example${resume.lessons.length===1?"":"s"} saved. ${nextStory?.character||"The garden"} is still waiting for Pip's help.`
      :progress.chapterComplete
        ?`Play any lesson again to earn more stars or try different examples.`
        :`${nextStory?.job||next.subtitle} Best lesson: ${next.par} examples.`;
    $("#nextLessonButton").textContent=resume?"Resume":progress.chapterComplete?"Replay capstone":"Continue";
    $("#nextLessonButton").onclick=resume?resumeActiveSession:()=>startLevel(next.number-1);
    $("#nextLessonPanel").classList.toggle("complete",progress.chapterComplete&&!resume);
  }

  function renderLevelMap(){
    const map=$("#levelMap");
    map.innerHTML="";
    let lastAct=0;
    for(const level of LEVELS){
      if(level.act!==lastAct){
        lastAct=level.act;
        const divider=document.createElement("div");
        divider.className="actDivider";
        divider.textContent=level.act===1?"ACT I · THE MISSING PROMISES":level.act===2?"ACT II · THE RULE THAT FAILED":"ACT III · THE LAST PROMISE";
        map.appendChild(divider);
      }
      const completed=progress.completed[level.id];
      const unlocked=progress.reviewer || level.number<=progress.unlocked;
      const node=document.createElement("button");
      const isCurrent=level.number===progress.unlocked&&!completed;
      node.className=`levelNode ${completed?"completed":""} ${isCurrent?"current":""}`;
      if(isCurrent)node.setAttribute("aria-current","step");
      node.disabled=!unlocked;
      const starText=completed?`${"★".repeat(completed.stars)}${"☆".repeat(3-completed.stars)}`:(unlocked?"OPEN":"LOCKED");
      const masteryText=completed?`Best: ${completed.bestLessons||"—"} examples · 3-star goal: ${level.par}`:`3-star goal: ${level.par} examples`;
      node.setAttribute("aria-label",`${level.number}. ${level.title}. ${completed?`${completed.stars} stars. ${masteryText}`:unlocked?"Unlocked":"Locked"}`);
      node.innerHTML=`
        <span class="levelNumber">${level.number}</span>
        <span class="nodeStars">${starText}</span>
        <h3>${escapeHtml(level.title)}</h3>
        <p>${escapeHtml(level.subtitle)}</p>
        <small class="nodeMeta">${escapeHtml(masteryText)}</small>
        <span class="nodeKind">${kindGlyph(level.kind)}</span>`;
      node.onclick=()=>startLevel(level.number-1);
      map.appendChild(node);
    }
  }

  function renderJournal(){
    const perfect=Object.values(progress.completed).filter(item=>item.stars===3).length;
    const attempts=Object.values(progress.attempts).reduce((sum,value)=>sum+(Number(value)||0),0);
    $("#journalStats").innerHTML=`
      <div class="journalStat"><span>Promises restored</span><strong>${completedCount()} / ${LEVELS.length}</strong></div>
      <div class="journalStat"><span>Stars earned</span><strong>${totalStars()} / ${LEVELS.length*3}</strong></div>
      <div class="journalStat"><span>Three-star Promises</span><strong>${perfect}</strong></div>
      <div class="journalStat"><span>Solo tries</span><strong>${attempts}</strong></div>`;
    $("#habitList").innerHTML=HABITS.map(habit=>{
      const unlocked=hasHabit(habit.threshold);
      return `<div class="habit ${unlocked?"":"locked"}">
        <div class="habitIcon">${habit.icon}</div>
        <div><strong>${unlocked?habit.name:`Unlock after ${habit.threshold} finished lessons`}</strong><small>${unlocked?habit.description:"Pip has not learned this way of listening yet."}</small></div>
      </div>`;
    }).join("");
    const memory=progress.lastMistake;
    const memoryBox=$("#mistakeMemory");
    if(memory){
      const level=LEVELS.find(item=>item.id===memory.levelId);
      const caseData=[...(level?.teachCases||[]),...(level?.challengeCases||[])].find(item=>item.id===memory.caseId);
      memoryBox.classList.remove("hidden");
      $("#mistakeMemoryTitle").textContent=level?level.title:"A recent lesson";
      $("#mistakeMemoryCopy").textContent=level&&caseData
        ?`${caseData.name}: Pip chose “${actionLabel(level,memory.predicted)}” instead of “${actionLabel(level,memory.expected)}.”`
        :"Pip remembers a guess that still needs a more helpful example.";
      $("#mistakeMemoryButton").onclick=()=>level&&startLevel(level.number-1,{skipStory:true});
    }else{
      memoryBox.classList.add("hidden");
      $("#mistakeMemoryButton").onclick=null;
    }
  }

  function renderMapPip(){
    const portrait=$("#mapPipPortrait");
    portrait.innerHTML=pipMarkup(progress.chapterComplete?"mood-proud":completedCount()>=6?"mood-confident":"mood-curious");
    applyPipAccessories(portrait.querySelector(".pip"));
  }

  function startNewChapter(){
    if((completedCount()>0 || progress.unlocked>1 || readActiveSession()) && !confirm("Start over and erase the current chapter progress and unfinished notebook?"))return;
    const retainedSettings={...progress.settings};
    clearActiveSession();
    progress={...defaultProgress(),settings:retainedSettings};
    saveProgress();
    applySettings();
    renderWelcome();
    showStory({
      kicker:"THE RENEWAL",
      title:"The night the Lantern Heart went dark.",
      body:`Every Lantern Festival begins the same way: Mossgrove gathers around the Heart and renews the twelve Promises that keep the Wilddark from taking shape.

Tonight, before the first lantern can be lit, the Welcome Flame is stolen.

The Heart cracks. A small creature tumbles from the fracture with a blank notebook and one frightened question: “What am I supposed to know?”`,
      button:"Meet Pip",
      artLabel:"✦",
      onContinue:()=>showStory({
        kicker:"YOU ARE THE LISTENER",
        title:"Pip cannot be told the rule.",
        body:`The Lantern Heart—and Pip—learn only from witnessed examples. You must choose situations, show what should happen, and let Pip form the simplest Promise that fits.

Someone is stealing the Promises in a deliberate path through Mossgrove. Each missing Flame makes the valley forget an important distinction.

Teach Pip well. Then Pip must restore each Promise without your help.`,
        button:"Follow the first missing Flame",
        artLabel:"🔥",
        onContinue:()=>renderMap()
      })
    });
  }

  function setPhase(phase){
    play.phase=phase;
    $("#phaseRibbon").querySelectorAll("[data-phase]").forEach(step=>{
      const order=[PHASES.TEACHING,PHASES.EXAM,PHASES.REFLECTION];
      const stepIndex=order.indexOf(step.dataset.phase);
      const currentIndex=order.indexOf(phase===PHASES.COMMITTED?PHASES.REFLECTION:phase);
      const isActive=step.dataset.phase===phase || (phase===PHASES.COMMITTED&&step.dataset.phase===PHASES.REFLECTION);
      step.classList.toggle("active",isActive);
      step.classList.toggle("complete",stepIndex>=0&&currentIndex>stepIndex);
      if(isActive)step.setAttribute("aria-current","step");else step.removeAttribute("aria-current");
    });
    document.body.dataset.gamePhase=phase;
    if(phase===PHASES.REFLECTION)requestAnimationFrame(()=>openNotebook());
  }

  function startLevel(index,options={}){
    if(index<0||index>=LEVELS.length)return;
    const level=LEVELS[index];
    if(!progress.reviewer && level.number>progress.unlocked){toast("Complete the previous garden lesson first.");return;}
    const existing=readActiveSession();
    const restoreSession=options.restoreSession || (existing?.levelId===level.id?existing:null);
    if(existing && existing.levelId!==level.id && existing.lessons.length && !options.restoreSession){
      if(!confirm("Starting another lesson will replace the unfinished notebook. Continue?"))return;
    }
    if(!restoreSession)clearActiveSession();
    const restoredLessons=(restoreSession?.lessons||[]).map(saved=>{
      const caseData=level.teachCases.find(item=>item.id===saved.caseId);
      return caseData?{caseData,action:saved.action}:null;
    }).filter(Boolean);
    const restoredUsedIds=new Set(restoredLessons.map(lesson=>lesson.caseData.id));
    const restoredSelectedId=restoreSession?.selectedId&&!restoredUsedIds.has(restoreSession.selectedId)?restoreSession.selectedId:null;
    play={
      level,index,phase:PHASES.TEACHING,selectedId:restoredSelectedId,lessons:restoredLessons,
      running:false,solved:false,committed:false,challengeCases:[],challengeResults:[],learnedRule:null,lastScene:null,
      recommendedId:restoreSession?.recommendedId||null,recommendedReason:restoreSession?.recommendedReason||"",
      attempt:progress.attempts[level.id]||0,skipRequested:false,
      showPredictions:!!restoreSession?.showPredictions,notebookCollapsed:!!restoreSession?.notebookCollapsed
    };
    setScreen("play");
    renderPlayLevel();
    saveActiveSession();
    if(options.skipStory)return;
    const story=STORY_BEATS[level.id];
    const levelStoryKey=`level-${level.id}-intro`;
    if(!progress.storySeen.includes(levelStoryKey)){
      progress.storySeen.push(levelStoryKey);saveProgress();
      showStory({
        kicker:`${story?.character||"Mossgrove"} · ${story?.role||"Witness"}`,
        title:story?.job||level.title,
        body:`${story?.problem||level.intro}

${story?.stakes||level.goal}

        Teach Pip with examples. Then ${story?.solo||"Pip will try the job alone."}`,
        button:"Teach Pip",
        artLabel:story?.icon||"✦",
        artKey:characterAssetKey(story?.character)
      });
    }
  }

  function renderPlayLevel(){
    mountNewPlayShell();
    const level=play.level;
    setPhase(PHASES.TEACHING);
    $("#actLabel").textContent=level.act===1?"ACT I · THE MISSING PROMISES":level.act===2?"ACT II · THE RULE THAT FAILED":"ACT III · THE LAST PROMISE";
    $("#levelTitle").textContent=`${level.number}. ${level.title}`;
    $("#levelGoal").textContent=level.goal;
    const story=STORY_BEATS[level.id];
    const characterSource=CHARACTER_ASSETS[story?.character]||null;
    setOptionalImage($("#missionCharacter"),characterSource,story?.icon||"✦");
    $("#missionCharacterName").textContent=story?`${story.character} · ${story.role}`:"Promise in danger";
    $("#missionHook").textContent=story?.job||level.intro;
    $("#missionStakes").textContent=story?.stakes||"This Promise is part of the same unfolding crisis.";
    $("#lessonBudgetText").textContent=` of ${level.budget} · 3 stars at ${level.par}`;
    $("#levelStars").textContent=progress.completed[level.id]?starString(progress.completed[level.id].stars):"☆ ☆ ☆";
    $("#world").className=`world world--${level.scene.theme}`;
    $("#world").dataset.scene=sceneArtKey(level);
    renderSceneProp(level);
    $("#worldPrompt").textContent="Choose an action to play the example.";
    $("#challengeCard").classList.add("hidden");
    $("#reflectionCard").classList.add("hidden");
    $("#completeLevelButton").classList.remove("hidden");
    $("#completeLevelButton").disabled=false;
    $("#completeLevelButton").textContent="Continue the story";
    $("#replaySceneButton").disabled=true;
    $("#skipSceneButton").classList.add("hidden");
    $("#recommendedLessonPanel").classList.add("hidden");
    $("#recommendedReason").classList.add("hidden");
    $("#replayExamButton").classList.add("hidden");
    $("#challengeConfidence").textContent="Waiting";
    $("#challengeConfidence").className="challengeConfidence";
    setPipMood("curious","Show me.","Pip is ready for a lesson.");
    $("#pipLine").textContent="“Show me examples, and I will try to learn the rule.”";
    const restoredCase=level.teachCases.find(item=>item.id===play.selectedId);
    if(restoredCase){stageCase(restoredCase);setPipMood("curious","We were here.",`Pip returns to ${restoredCase.name}.`);}else clearScene();
    renderTeaching();
    updateNotebook();
    renderNotebookCollapse();
    applyPipAccessories($("#pip"));
  }

  function teachingStepState(){
    if(!play.level)return "pick";
    if(play.selectedId)return "act";
    const proof=E.proofStatus(play.level,play.lessons);
    const rules=E.consistentRules(play.level,play.lessons);
    if(proof.complete&&rules.length)return "test";
    if(play.lessons.length)return "repeat";
    return "pick";
  }

  function guidedTeachingCase(level){
    if(level.number!==1||play.lessons.length>=level.par||play.selectedId)return null;
    const info=E.mostInformativeTeachingCase(level,play.lessons);
    return info?.caseData||level.teachCases.find(item=>!play.lessons.some(lesson=>lesson.caseData.id===item.id))||null;
  }

  function updateTeachingGuide(){
    if(!play.level)return;
    const state=teachingStepState();
    const order=["pick","act","repeat","test"];
    const activeIndex=order.indexOf(state);
    document.body.dataset.teachingStep=state;
    document.querySelectorAll("#teachingSteps [data-teach-step]").forEach((item,index)=>{
      const isActive=item.dataset.teachStep===state;
      item.classList.toggle("active",isActive);
      item.classList.toggle("complete",index<activeIndex || (state==="repeat"&&index===1));
      if(isActive)item.setAttribute("aria-current","step");else item.removeAttribute("aria-current");
    });
    const prompt=$("#teachingStepPrompt");
    if(!prompt)return;
    const level=play.level;
    const proof=E.proofStatus(level,play.lessons);
    const next=proof.items.find(item=>!item.satisfied);
    const selected=level.teachCases.find(item=>item.id===play.selectedId);
    const guided=guidedTeachingCase(level);
    const content={
      pick:["Step 1 · Pick a situation",guided?`For this first lesson, try the highlighted ${guided.name} card.`:"Choose any unused card below."],
      act:["Step 2 · Choose what Pip should do",selected?`Use the garden rule above. What is the correct action for ${selected.name}?`:"Choose the correct action."],
      repeat:["Step 3 · Show another part of the rule",next?.hint||"Choose a different kind of situation so Pip sees the full rule."],
      test:["Step 4 · Let Pip try",`You showed all ${proof.total} parts. Pip is ready to try alone.`]
    }[state];
    prompt.className=`teachingStepPrompt step-${state}`;
    prompt.innerHTML=`<span class="stepPromptNumber">${activeIndex+1}</span><div><strong>${escapeHtml(content[0])}</strong><small>${escapeHtml(content[1])}</small></div>`;
  }

  function renderTeaching(){
    const level=play.level;
    $("#lessonCount").textContent=play.lessons.length;
    $("#clearLessonsButton").disabled=play.phase!==PHASES.TEACHING||play.running||play.solved||play.lessons.length===0;
    const insights=play.showPredictions&&play.lessons.length
      ?new Map(E.teachingCaseInsights(level,play.lessons).map(item=>[item.caseData.id,item]))
      :null;
    const grid=$("#lessonGrid");
    grid.innerHTML="";
    for(const caseData of level.teachCases){
      const used=play.lessons.some(lesson=>lesson.caseData.id===caseData.id);
      const selected=play.selectedId===caseData.id;
      const insight=insights?.get(caseData.id)||null;
      const prediction=insight?.chosenAction
        ?`<span class="casePredictionBadge ${insight.unanimous?"unanimous":"split"}" title="${Math.round(insight.agreement*100)}% of Pip's possible rules agree">${escapeHtml(actionLabel(level,insight.chosenAction))}<small>${Math.round(insight.agreement*100)}%</small></span>`
        :"";
      const guided=guidedTeachingCase(level);
      const isGuided=!used&&!selected&&guided?.id===caseData.id;
      const card=document.createElement("button");
      card.type="button";
      card.className=`lessonCard travelerNode ${used?"used":""} ${selected?"selected":""} ${play.recommendedId===caseData.id?"recommended":""} ${isGuided?"guidedChoice":""} ${prediction?"hasPrediction":""}`;
      card.disabled=play.phase!==PHASES.TEACHING||play.running||play.solved||used||play.lessons.length>=level.budget;
      card.setAttribute("aria-label",`${caseData.name}, ${used?"shown":selected?"teaching":"available"}. ${caseData.summary}`);
      card.setAttribute("aria-pressed",String(selected));
      card.innerHTML=`
        <div class="portraitMini portraitMini--${escapeHtml(caseData.species||"creature")}">${portraitMarkup(caseData)}</div>
        <strong>${escapeHtml(caseData.name)}</strong>
        <span class="pickLabel">${used?"Shown":selected?"Teaching":"Available"}</span>${prediction}`;
      card.onclick=()=>selectTeachingCase(caseData.id);
      grid.appendChild(card);
    }
    renderTeachPanel();
    renderLessonTrail();
    updateTeachingGuide();
    const reason=$("#recommendedReason");
    reason.classList.toggle("hidden",play.phase!==PHASES.TEACHING||!play.recommendedId||!play.recommendedReason);
    reason.textContent=play.recommendedReason||"";
  }

  function selectTeachingCase(id){
    if(play.phase!==PHASES.TEACHING||play.running||play.solved)return;
    play.selectedId=id;
    play.recommendedId=null;
    play.recommendedReason="";
    const caseData=play.level.teachCases.find(item=>item.id===id);
    stageCase(caseData);
    setPipMood("curious","What do we show?",`Pip studies ${caseData.name}.`);
    renderTeaching();
    saveActiveSession();
    requestAnimationFrame(()=>{
      const firstAction=$("#teachPanel .actionButton");
      if(firstAction && window.innerWidth<760)firstAction.focus({preventScroll:true});
      $("#teachPanel")?.scrollIntoView({behavior:progress.settings.reducedMotion?"auto":"smooth",block:"nearest"});
    });
  }

  function renderTeachPanel(){
    const panel=$("#teachPanel");
    const level=play.level;
    const caseData=level.teachCases.find(item=>item.id===play.selectedId);
    if(!caseData){
      panel.className="teachPanel teachPanel--empty";
      const proof=E.proofStatus(level,play.lessons);
      const rules=E.consistentRules(level,play.lessons);
      const ready=proof.complete&&rules.length;
      panel.innerHTML=ready
        ?`<span class="emptyStepNumber">✦</span><div><strong>You showed every part of the Promise</strong><small>Let Pip try alone when you are ready.</small></div>`
        :play.lessons.length>=level.budget
          ?`<span class="emptyStepNumber">!</span><div><strong>You used all ${level.budget} examples</strong><small>Let Pip try alone, or undo one example to make a change.</small></div>`
          :`<span class="emptyStepNumber">${play.lessons.length?3:1}</span><div><strong>${play.lessons.length?"Pick another situation":"Pick a situation above"}</strong><small>${play.lessons.length?"Try to show a different part of the rule.":"The action choices will appear here."}</small></div>`;
      return;
    }
    panel.className="teachPanel";
    const actionLocked=play.phase!==PHASES.TEACHING||play.running||play.solved;
    const choices=level.actions.map(action=>`
      <button class="actionButton tone-${action.tone}" data-action="${action.id}" ${actionLocked?"disabled":""}>
        ${escapeHtml(action.label)}
        <small>${escapeHtml(action.description)}</small>
      </button>`).join("");
    const insight=play.showPredictions&&play.lessons.length?E.predictionSnapshot(level,play.lessons,caseData):null;
    const currentPrediction=insight?.chosenAction
      ?`<div class="selectedPrediction"><span>PIP WOULD CURRENTLY</span><strong>${escapeHtml(actionLabel(level,insight.chosenAction))}</strong><small>${Math.round(insight.agreement*100)}% of Pip's possible rules agree${insight.unanimous?".":"; Pip still has different guesses here."}</small></div>`
      :"";
    panel.innerHTML=`
      <div class="selectedCaseHeader">
        <div class="portraitMini portraitMini--${escapeHtml(caseData.species||"creature")}">${portraitMarkup(caseData)}</div>
        <div><span class="selectedCaseEyebrow">SELECTED SITUATION</span><strong>${escapeHtml(caseData.name)}</strong><small>${escapeHtml(caseData.summary)}</small></div>
      </div>
      <div class="actionQuestion"><strong>The ${escapeHtml(caseData.name)} ${escapeHtml(caseData.summary)} What should the garden do?</strong></div>
      ${currentPrediction}
      <div class="actionChoices ${level.actions.length===2?"two":"three"}">${choices}</div>`;
    panel.querySelectorAll(".actionButton").forEach(button=>{
      button.onclick=()=>teachSelected(button.dataset.action);
    });
  }

  async function teachSelected(actionId){
    if(play.phase!==PHASES.TEACHING||play.running||play.solved)return;
    const level=play.level;
    const caseData=level.teachCases.find(item=>item.id===play.selectedId);
    if(!caseData)return;
    play.running=true;
    disablePlayControls(true);
    try{
      const target=E.targetRule(level);
      const correct=E.predict(target,caseData)===actionId;
      setPipMood("thinking","Let me watch.","Pip is looking for the difference that matters.");
      const worldCard=document.querySelector(".worldCard");
      worldCard?.classList.add("worldCard--active");
      if(window.innerWidth<760)worldCard?.scrollIntoView({behavior:progress.settings.reducedMotion?"auto":"smooth",block:"start"});
      await runScene(caseData,actionId,correct,true);
      play.lessons.push({caseData,action:actionId});
      play.notebookCollapsed=false;
      play.selectedId=null;
      play.lastScene={caseData,actionId,correct,isDemo:true};
      saveActiveSession();
      const rules=E.consistentRules(level,play.lessons);
      if(level.number===1&&play.lessons.length===1)toast("Good. Pip's notebook is open. Now show a different kind of situation.");
      if(!rules.length){
        setPipMood("confused","Those examples do not fit together.","Pip cannot find one rule that matches every example.");
      }else if(rules.length===1){
        setPipMood("confident","I think I've got it!",`Only one Promise fits now: ${rules[0].name}.`);
      }else if(rules.length<=3){
        setPipMood("thinking","I'm getting closer.",`Pip is considering ${rules.length} possible Promises.`);
      }else{
        setPipMood("curious","I have a first guess!",`Right now, Pip favors: ${rules[0].name}.`);
      }
    }catch(error){
      console.error("Rule Garden teaching scene interrupted",error);
      toast("The example was interrupted before Pip saved it. Try again.");
      setPipMood("confused","I missed that.","The interrupted example was not added to the notebook.");
    }finally{
      play.running=false;
      disablePlayControls(false);
      renderTeaching();
      updateNotebook();
      $("#replaySceneButton").disabled=!play.lastScene;
      document.querySelector(".worldCard")?.classList.remove("worldCard--active");
      if(window.innerWidth<760&&!play.running)document.querySelector(".teachingCard")?.scrollIntoView({behavior:progress.settings.reducedMotion?"auto":"smooth",block:"start"});
    }
  }

  function renderLessonTrail(){
    const trail=$("#lessonTrail");
    trail.innerHTML=play.lessons.map((lesson,index)=>{
      const actionIndex=play.level.actions.findIndex(item=>item.id===lesson.action);
      const action=play.level.actions[actionIndex];
      return `<span class="lessonChip action-${Math.max(0,actionIndex)}">${index+1}. ${escapeHtml(lesson.caseData.name)} → ${escapeHtml(action.shortLabel)}</span>`;
    }).join("");
  }

  function renderProofChecklist(level,status){
    $("#proofProgress").textContent=`${status.matchedCount} / ${status.total}`;
    const next=status.items.find(item=>!item.satisfied);
    $("#proofChecklist").innerHTML=status.items.map(item=>`
      <div class="proofItem ${item.satisfied?"complete":""} ${next&&next.id===item.id?"next":""}">
        <span class="proofMark">${item.satisfied?"✓":"○"}</span>
        <span><strong>${escapeHtml(item.label)}</strong><small>${item.satisfied?"One example covers this part of the rule.":"Needs its own example."}</small></span>
      </div>`).join("");
  }

  function renderNotebookCollapse(){
    const waiting=!play.lessons.length;
    const collapsed=waiting?false:!!play.notebookCollapsed;
    const card=$("#notebookCard");
    card?.classList.toggle("collapsed",collapsed);
    card?.classList.toggle("notebookCard--waiting",waiting);
    $("#notebookEmptyState")?.classList.toggle("hidden",!waiting);
    $("#notebookBody").classList.toggle("hidden",waiting||collapsed);
    $("#toggleNotebookButton").classList.toggle("hidden",waiting);
    $("#toggleNotebookButton").textContent=collapsed?"Open":"Hide";
    $("#toggleNotebookButton").setAttribute("aria-expanded",String(!waiting&&!collapsed));
  }

  function toggleNotebook(){
    if(!play.level||play.running)return;
    play.notebookCollapsed=!play.notebookCollapsed;
    renderNotebookCollapse();
    saveActiveSession();
  }

  function togglePredictions(){
    if(play.phase!==PHASES.TEACHING||play.running||play.solved||!play.lessons.length)return;
    play.showPredictions=!play.showPredictions;
    renderTeaching();
    updateNotebook();
    saveActiveSession();
    toast(play.showPredictions?"Pip's current choices are now shown on unused examples.":"Choice preview hidden.");
  }

  function updateNotebook(){
    const level=play.level;
    const rules=E.consistentRules(level,play.lessons);
    const chosen=rules[0]||null;
    const certainty=E.averageCertainty(level,rules,level.challengeCases);
    const proof=E.proofStatus(level,play.lessons);
    const canTest=proof.complete && rules.length>0 && !play.running && !play.solved;
    $("#beginChallengeButton").disabled=!canTest;
    $("#beginChallengeButton").textContent=canTest?"Let Pip try alone":proof.complete?"Fix the conflicting examples":`Show ${proof.total-proof.matchedCount} more part${proof.total-proof.matchedCount===1?"":"s"}`;
    $("#undoLessonButton").disabled=play.lessons.length===0||play.running||play.solved;
    $("#clearLessonsButton").disabled=play.lessons.length===0||play.running||play.solved;
    $("#togglePredictionButton").disabled=play.lessons.length===0||play.running||play.solved||play.phase!==PHASES.TEACHING;
    $("#togglePredictionButton").textContent=play.showPredictions?"Hide Pip's choices":"Preview Pip's choices";
    $("#togglePredictionButton").setAttribute("aria-pressed",String(!!play.showPredictions));
    $("#focusSuggestedButton").classList.toggle("hidden",play.phase!==PHASES.TEACHING||!play.recommendedId||play.running||play.solved);
    $("#consistentRuleCount").textContent=rules.length;
    $("#currentGuess").textContent=chosen?chosen.name:"contradiction";
    $("#averageCertainty").textContent=rules.length?`${Math.round(certainty*100)}%`:"—";
    $("#predictionRule").textContent=chosen?chosen.name:play.lessons.length?"No single rule fits":"No guess yet";
    $("#predictionCopy").textContent=chosen
      ? chosen.description
      : play.lessons.length
        ? "The examples require different actions. Undo or change one example."
        : "Show one example to help Pip make a guess.";
    $("#pipLine").textContent=play.lessons.length&&chosen
      ?`“Right now, I think: ${chosen.name}.”`
      :"“Show me examples, and I will try to learn the rule.”";
    $("#researchLens").classList.toggle("hidden",!progress.settings.research);
    renderProofChecklist(level,proof);
    renderNotebookCollapse();

    const meter=$("#notebookMeter");
    const active=Math.round(certainty*5);
    meter.innerHTML=Array.from({length:5},(_,index)=>`<span class="${index<active?"on":""}"></span>`).join("");
    updateStageShell();
    updateBeliefLine();
    renderNotebookSpread();

    if(!play.lessons.length){
      $("#notebookHeading").textContent="No examples yet";
      $("#notebookCopy").textContent="Pip is waiting for examples. Show one example for each part of the Promise.";
      setCertaintyBadge("Pip is curious","");
      return;
    }
    if(!rules.length){
      $("#notebookHeading").textContent="The lessons conflict";
      $("#notebookCopy").textContent="Undo one example or choose a different action. Pip cannot find one rule that fits all the examples.";
      setCertaintyBadge("Pip is tangled","low");
      return;
    }
    if(!proof.complete){
      const next=proof.items.find(item=>!item.satisfied);
      $("#notebookHeading").textContent=`${proof.matchedCount} of ${proof.total} parts shown`;
      $("#notebookCopy").textContent=next
        ?`Pip has a guess, but still needs an example for: ${next.label.toLowerCase()}.`
        :"Pip has a guess, but you have not shown every part of the rule.";
      setCertaintyBadge(hasHabit(6)?`${Math.round(certainty*100)}% confident`:"Pip has a guess",certainty>.85?"high":"");
      return;
    }
    $("#notebookHeading").textContent=rules.length===1?"Pip is ready to try":"Pip is ready, but still has more than one guess";
    $("#notebookCopy").textContent=hasHabit(6)
      ? certainty>.9?"You showed every part of the Promise. Pip is ready to try alone.":"You showed every part of the Promise. Pip still has more than one guess; the solo try will show which one he uses."
      :"You showed one example for each important part. Pip is ready to try alone.";
    setCertaintyBadge(hasHabit(6)?`${Math.round(certainty*100)}% confident`:"Ready","high");
  }

  function askPip(){
    if(play.phase!==PHASES.TEACHING||play.running||play.solved)return;
    const level=play.level;
    const proof=E.proofStatus(level,play.lessons);
    const next=proof.items.find(item=>!item.satisfied);
    if(!play.lessons.length){
      toast(next?.hint||"Start with one example where Pip should act and one where Pip should not.");
      setPipMood("curious","Show me a helpful difference.",next?.hint||"Pip needs an example that rules out an easy wrong guess.");
      return;
    }
    const info=E.mostInformativeTeachingCase(level,play.lessons);
    if(!info){
      toast("You already used every available example.");
      return;
    }
    if(hasHabit(3)){
      play.recommendedId=info.caseData.id;
      const thought=info.advancesProof?"This shows a missing part.":info.separates?"This may change my guess.":"My guesses differ here.";
      const caption=info.requirement?.hint||`${info.caseData.name} is the most helpful unused example.`;
      play.recommendedReason=`Suggested example: ${caption}`;
      renderTeaching();
      saveActiveSession();
      setPipMood("thinking",thought,caption);
      toast(info.advancesProof&&info.requirement?info.requirement.hint:`${info.caseData.name} makes Pip's possible rules choose different actions.`);
    }else{
      toast(next?.hint||"Look for a case where two plausible rules would demand different actions.");
      setPipMood("thinking","Which example would help?",next?.hint||"Pip is not sure which example would help yet.");
    }
  }

  function undoLesson(){
    if(play.phase!==PHASES.TEACHING||play.running||play.solved||!play.lessons.length)return;
    play.lessons.pop();
    if(!play.lessons.length)play.showPredictions=false;
    play.selectedId=null;play.recommendedId=null;play.recommendedReason="";
    renderTeaching();updateNotebook();saveActiveSession();
    setPipMood("thinking","Let me change that.","Pip removes the most recent example from the notebook.");
  }


  function clearLessons(){
    if(play.phase!==PHASES.TEACHING||play.running||play.solved||!play.lessons.length)return;
    if(!confirm("Clear every example from this notebook?"))return;
    play.lessons=[];play.selectedId=null;play.recommendedId=null;play.recommendedReason="";play.lastScene=null;play.showPredictions=false;
    renderTeaching();updateNotebook();clearScene();saveActiveSession();
    $("#replaySceneButton").disabled=true;
    setPipMood("curious","A new lesson.","Pip clears the notebook and waits for new examples.");
  }

  function focusSuggestedContrast(){
    if(play.phase!==PHASES.TEACHING||!play.recommendedId||play.running||play.solved)return;
    selectTeachingCase(play.recommendedId);
    document.querySelector(`.lessonCard.selected`)?.scrollIntoView({behavior:progress.settings.reducedMotion?"auto":"smooth",block:"center"});
  }


  function sceneDuration(milliseconds){
    if(play.skipRequested)return 0;
    if(progress.settings.reducedMotion)return Math.min(30,milliseconds);
    if(progress.settings.quickScenes)return Math.max(45,Math.round(milliseconds*.34));
    return milliseconds;
  }

  function sceneWait(milliseconds){
    return new Promise(resolve=>{
      let settled=false;
      const finish=()=>{
        if(settled)return;
        settled=true;
        sceneWaitResolver=null;
        resolve();
      };
      const timer=setTimeout(finish,sceneDuration(milliseconds));
      sceneWaitResolver=()=>{clearTimeout(timer);finish();};
    });
  }

  function skipCurrentScene(){
    if(!play.running)return;
    play.skipRequested=true;
    if(sceneWaitResolver)sceneWaitResolver();
    $("#skipSceneButton").classList.add("hidden");
  }

  function clearChallengeState(){
    play.challengeCases=[];
    play.challengeResults=[];
    play.learnedRule=null;
    $("#challengeConfidence").textContent="Waiting";
    $("#challengeConfidence").className="challengeConfidence";
    $("#challengeCard").classList.add("hidden");
    $("#reflectionCard").classList.add("hidden");
  }
  async function beginChallenge(){
    if(play.phase!==PHASES.TEACHING||play.running||play.solved)return;
    const level=play.level;
    const rules=E.consistentRules(level,play.lessons);
    const proof=E.proofStatus(level,play.lessons);
    if(!rules.length)return;
    if(!proof.complete){
      const next=proof.items.find(item=>!item.satisfied);
      toast(next?.hint||"Show an example for every part of the Promise before Pip tries alone.");
      askPip();
      return;
    }
    play.running=true;play.challengeResults=[];play.learnedRule=rules[0];
    setPhase(PHASES.EXAM);
    play.challengeCases=E.selectChallengeCases(level,play.lessons,level.challengeCount);
    const expectedChallengeCount=Math.min(Number(level.challengeCount)||0,(level.challengeCases||[]).length);
    if(!play.challengeCases.length || play.challengeCases.length!==expectedChallengeCount){
      play.running=false;
      setPhase(PHASES.TEACHING);
      clearChallengeState();
      updateNotebook();
      toast("This Promise is missing solo-try situations. Open validation.html for details.");
      return;
    }
    progress.attempts[level.id]=(progress.attempts[level.id]||0)+1;
    play.attempt=progress.attempts[level.id];saveProgress();
    disablePlayControls(true);
    renderChallengeShell();
    setPipMood("thinking","My turn.","The garden chooses situations that probe what Pip may still misunderstand.");
    $("#challengeCard").scrollIntoView({behavior:progress.settings.reducedMotion?"auto":"smooth",block:"start"});
    try{
      await sceneWait(500);
      const target=E.targetRule(level);
      for(let index=0;index<play.challengeCases.length;index++){
        const caseData=play.challengeCases[index];
        markChallengeActive(index);
        const snapshot=E.predictionSnapshot(level,play.lessons,caseData);
        const predicted=E.predict(play.learnedRule,caseData);
        const expected=E.predict(target,caseData);
        const correct=predicted===expected;
        const confidence=Math.round(snapshot.agreement*100);
        $("#challengeConfidence").textContent=snapshot.unanimous?"Pip is sure of this Promise":"Pip is weighing the Promise";
        $("#challengeConfidence").className=`challengeConfidence ${snapshot.unanimous?"high":confidence<70?"low":""}`;
        setPipMood(snapshot.unanimous?"confident":"thinking",snapshot.unanimous?"I'm sure.":"I have a guess…",`Pip chooses “${actionLabel(level,predicted)}.”`);
        await sceneWait(220);
        await runScene(caseData,predicted,correct,false);
        play.challengeResults.push({caseData,predicted,expected,correct,confidence,unanimous:snapshot.unanimous});
        renderChallengeResults(index);
        $("#challengeScore").textContent=`${play.challengeResults.filter(item=>item.correct).length} / ${index+1}`;
        await sceneWait(350);
      }
      play.running=false;
      $("#challengeConfidence").textContent="Solo try complete";
      $("#challengeConfidence").className="challengeConfidence high";
      showReflection();
      disablePlayControls(false);
    }catch(error){
      play.running=false;
      setPhase(PHASES.TEACHING);
      clearChallengeState();
      disablePlayControls(false);
      updateNotebook();
      console.error("Rule Garden test interrupted",error);
      toast("The garden scene was interrupted. Your examples are still safe; let Pip try again.");
      setPipMood("confused","The scene stopped.","Nothing in the notebook was lost.");
    }
  }

  function renderChallengeShell(){
    const level=play.level;
    $("#challengeCard").classList.remove("hidden");
    $("#reflectionCard").classList.add("hidden");
    $("#challengeHeading").textContent=`${play.challengeCases.length} new situations for Pip`;
    $("#challengeScore").textContent=`0 / ${play.challengeCases.length}`;
    $("#challengePolicyChip").textContent=play.learnedRule?`Pip chose: ${play.learnedRule.name}`:"Pip chose a rule";
    $("#challengeConfidence").textContent="Preparing";
    $("#challengeConfidence").className="challengeConfidence";
    const story=STORY_BEATS[level.id];
    $("#challengeIntro").textContent=`${story?.solo||"Pip is ready to try alone."} These new situations will reveal which Promise Pip learned.`;
    $("#challengeStrip").innerHTML=play.challengeCases.map(caseData=>{
      const reason=E.challengeCaseReason?E.challengeCaseReason(level,play.lessons,caseData):"Selected for Pip's solo try.";
      const label=reason.split(":")[0];
      return `<div class="challengeCase" data-id="${caseData.id}" title="${escapeHtml(reason)}">
        <div class="portraitMini portraitMini--${escapeHtml(caseData.species||"creature")}">${portraitMarkup(caseData)}</div>
        <strong>${escapeHtml(caseData.name)}</strong>
        <small>${escapeHtml(label)}</small><span class="resultMark"></span>
      </div>`;
    }).join("");
  }

  function markChallengeActive(index){
    $("#challengeStrip").querySelectorAll(".challengeCase").forEach((card,cardIndex)=>{
      const active=cardIndex===index;
      card.classList.toggle("active",active);
      if(active)card.setAttribute("aria-current","step");else card.removeAttribute("aria-current");
    });
  }

  function renderChallengeResults(index){
    const result=play.challengeResults[index];
    const card=$("#challengeStrip").children[index];
    card.classList.remove("active");
    card.classList.add(result.correct?"correct":"wrong");
    card.querySelector("small").textContent=`${actionLabel(play.level,result.predicted)} · ${result.correct?"right":"misunderstood"}`;
    card.querySelector(".resultMark").textContent=result.correct?"✓":"×";
  }

  function showReflection(){
    const level=play.level;
    setPhase(PHASES.REFLECTION);
    const results=play.challengeResults;
    const success=results.length>0 && results.length===play.challengeCases.length && results.every(item=>item.correct);
    play.solved=success;
    play.committed=false;
    const stars=success?calculateStars(level):0;
    $("#reflectionCard").classList.remove("hidden");
    const story=STORY_BEATS[level.id];
    $("#reflectionTitle").textContent=success?"The Promise works.":"Pip learned an incomplete Promise.";
    $("#reflectionSummary").textContent=success
      ?(story?.success||`Pip chose the correct action in all ${results.length} new situations.`)
      :`${story?.failure||"Pip's guess fit the examples but failed in a new situation."} Change one example and try again.`;
    $("#reflectionStars").textContent=success?starString(stars):"☆ ☆ ☆";
    const targetRule=E.targetRule(level);
    $("#houseRuleName").textContent=targetRule?.name||"Correct rule";
    $("#houseRuleDescription").textContent=targetRule?.description||level.goal;
    $("#learnedRuleName").textContent=play.learnedRule?.name||"No single rule fits";
    $("#learnedRuleDescription").textContent=play.learnedRule?.description||"The examples conflict.";
    $("#replayExamButton").classList.remove("hidden");
    $("#evidenceExplanation").innerHTML=play.lessons.map((lesson,index)=>{
      const explanation=E.explainEvidence(level,play.learnedRule,lesson);
      return `<div class="evidenceRow"><div class="evidenceIndex">${index+1}</div><div><strong>${escapeHtml(explanation.title)}</strong><br>${escapeHtml(explanation.text)}</div></div>`;
    }).join("");

    const panel=$("#misunderstandingPanel");
    if(success){
      if(progress.lastMistake?.levelId===level.id){progress.lastMistake=null;saveProgress();}
      $("#recommendedLessonPanel").classList.add("hidden");
      panel.className="misunderstandingPanel success";
      panel.textContent=play.lessons.length===level.par
        ?`Perfect lesson: ${play.lessons.length} examples showed all ${level.par} parts of the rule.`
        :`Good lesson: Pip understood. You used ${play.lessons.length-level.par} extra example${play.lessons.length-level.par===1?"":"s"} beyond the ${level.par}-example star goal.`;
      $("#reviseButton").textContent=stars<3?"Replay for more stars":"Try different examples";
      $("#completeLevelButton").textContent=level.number===LEVELS.length?"Write the Last Promise":"Continue the story";
      $("#completeLevelButton").disabled=false;
      $("#completeLevelButton").classList.remove("hidden");
      setPipMood("proud","We did it!","Pip used the Promise correctly in every new situation.");
      celebrate();
    }else{
      const first=results.find(item=>!item.correct);
      progress.lastMistake={levelId:level.id,caseId:first.caseData.id,predicted:first.predicted,expected:first.expected,at:Date.now()};
      saveProgress();
      const separating=E.findSeparatingCase(level,play.lessons,play.learnedRule);
      const predicted=actionLabel(level,first.predicted),expected=actionLabel(level,first.expected);
      panel.className="misunderstandingPanel failure";
      let copy=`${first.caseData.name} showed the problem: Pip chose “${predicted},” but the correct rule needed “${expected}.” `;
      if(hasHabit(9)&&separating) copy+=`${separating.name} is an example where Pip's guess and the correct rule choose different actions.`;
      else copy+="Add an example where Pip's guess and the correct rule choose different actions.";
      panel.textContent=copy;
      $("#reviseButton").textContent="Return to teaching";
      $("#completeLevelButton").classList.add("hidden");
      if(separating&&hasHabit(9)){
        play.recommendedId=separating.id;
        play.recommendedReason=`${separating.name} shows the difference between Pip's guess and the correct rule.`;
        $("#recommendedLessonTitle").textContent=separating.name;
        $("#recommendedLessonCopy").textContent=play.recommendedReason;
        $("#recommendedLessonPanel").classList.remove("hidden");
      }else{
        play.recommendedId=null;
        play.recommendedReason="";
        $("#recommendedLessonPanel").classList.add("hidden");
      }
      setPipMood("sad","My guess was wrong.","The examples in the notebook led Pip to this guess.");
    }
    $("#reflectionCard").scrollIntoView({behavior:progress.settings.reducedMotion?"auto":"smooth",block:"start"});
  }

  function useRecommendedLesson(){
    if(!play.recommendedId||play.running)return;
    const suggestedId=play.recommendedId;
    reviseLessons();
    play.recommendedId=suggestedId;
    play.recommendedReason=play.recommendedReason||"This example shows the difference between Pip's guess and the correct rule.";
    selectTeachingCase(suggestedId);
    $("#recommendedLessonPanel").classList.add("hidden");
  }

  async function replayExamSummary(){
    if(play.running||!play.challengeResults.length)return;
    play.running=true;
    play.skipRequested=false;
    disablePlayControls(true);
    $("#challengeCard").scrollIntoView({behavior:progress.settings.reducedMotion?"auto":"smooth",block:"start"});
    try{
      const cards=[...$("#challengeStrip").querySelectorAll(".challengeCase")];
      cards.forEach(card=>card.classList.remove("summaryReplay"));
      for(const card of cards){
        card.classList.add("summaryReplay");
        await sceneWait(420);
        card.classList.remove("summaryReplay");
      }
    }finally{
      play.running=false;
      disablePlayControls(false);
    }
  }

  function reviseLessons(){
    if(play.running)return;
    const returningFromMistake=!play.solved;
    play.solved=false;play.committed=false;
    if(returningFromMistake&&play.lessons.length)play.showPredictions=true;
    setPhase(PHASES.TEACHING);
    clearChallengeState();
    $("#recommendedLessonPanel").classList.add("hidden");
    $("#replayExamButton").classList.add("hidden");
    renderTeaching();updateNotebook();saveActiveSession();
    document.querySelector(".teachingCard")?.scrollIntoView({behavior:progress.settings.reducedMotion?"auto":"smooth",block:"start"});
    setPipMood("thinking","One better example.","Pip returns to the notebook without forgetting the existing lessons.");
  }

  function calculateStars(level){
    const proof=E.proofStatus(level,play.lessons);
    if(!proof.complete)return 0;
    if(play.lessons.length===level.par)return 3;
    if(play.lessons.length===level.par+1)return 2;
    return 1;
  }

  function completeLevel(){
    if(!play.solved||play.committed)return;
    const level=play.level;
    const proof=E.proofStatus(level,play.lessons);
    const stars=calculateStars(level);
    if(!proof.complete || stars<1){
      toast("You have not shown every part of the rule, so this lesson cannot be saved.");
      return;
    }
    play.committed=true;
    setPhase(PHASES.COMMITTED);
    clearActiveSession();
    $("#completeLevelButton").disabled=true;
    const completedBefore=completedCount();
    const old=progress.completed[level.id];
    const oldBest=Number(old?.bestLessons)>0?Number(old.bestLessons):Infinity;
    progress.completed[level.id]={
      stars:Math.max(stars,old?.stars||0),
      bestLessons:Math.min(oldBest,play.lessons.length),
      lastLessons:play.lessons.length,
      attempts:Math.max(play.attempt,old?.attempts||0)
    };
    progress.unlocked=Math.max(progress.unlocked,Math.min(LEVELS.length,level.number+1));
    progress.chapterComplete=LEVELS.every(item=>!!progress.completed[item.id]);
    const completedAfter=completedCount();
    const unlockedHabits=HABITS.filter(habit=>habit.threshold>completedBefore && habit.threshold<=completedAfter);
    const unlockedHabit=unlockedHabits[unlockedHabits.length-1]||null;
    saveProgress();
    const completedChapter=progress.chapterComplete;
    const story=STORY_BEATS[level.id];
    const lessonResolution=story?.success||level.outro;
    const habitResolution=unlockedHabit?`

New insight: ${unlockedHabit.name}.`:"";
    const finalLessonNote=level.number===LEVELS.length&&!completedChapter?`

The Last Promise is understood, but every earlier Promise must also be restored before Mossgrove can rebuild the Heart.`:"";
    const firstCompletion=!old;
    const interlude=firstCompletion && (level.number!==LEVELS.length || completedChapter)?INTERLUDES[level.id]:null;
    const finish=()=>renderMap();
    const continueStory=()=>{
      if(!interlude){finish();return;}
      showStory({
        kicker:interlude.kicker,
        title:interlude.title,
        body:interlude.body,
        button:level.number===LEVELS.length?"Return to Mossgrove":"Continue the pursuit",
        artLabel:interlude.icon||story?.icon||"✦",
        artKey:characterAssetKey(story?.character),
        onContinue:finish
      });
    };
    showStory({
      kicker:unlockedHabit?.name||`${story?.character||"Mossgrove"} · PROMISE RESTORED`,
      title:story?.completionTitle||`${level.title} is restored.`,
      body:`${lessonResolution}${habitResolution}${finalLessonNote}`,
      button:interlude?"Continue the story":"Return to the Promise path",
      artLabel:story?.icon||"✦",
      artKey:characterAssetKey(story?.character),
      onContinue:continueStory
    });

  }

  async function replayLastScene(){
    if(play.running||!play.lastScene)return;
    play.running=true;
    disablePlayControls(true);
    try{
      await runScene(play.lastScene.caseData,play.lastScene.actionId,play.lastScene.correct,play.lastScene.isDemo);
    }catch(error){
      console.error("Rule Garden replay interrupted",error);
      toast("The replay was interrupted. The notebook was not changed.");
      setPipMood("confused","The replay stopped.","Your saved examples are still safe.");
    }finally{
      play.running=false;
      disablePlayControls(false);
    }
  }

  async function runScene(caseData,actionId,correct,isDemo){
    const level=play.level;
    play.skipRequested=false;
    $("#skipSceneButton").classList.toggle("hidden",progress.settings.reducedMotion);
    try{
      stageCase(caseData);
      await sceneWait(260);
      $("#visitor").classList.add("enter");
      await sceneWait(460);
      const action=level.actions.find(item=>item.id===actionId);
      setPipMood(correct?(isDemo?"surprised":"proud"):"confused",correct?(isDemo?"Oh—I see!":"Yes!"):isDemo?"That went badly.":"Oh no.",correct?"Pip notices what changed.":"Pip sees that this action does not fit the Promise.");
      showEffect(level,actionId,correct);
      $("#sceneCaption").textContent=outcomeCaption(level,actionId,correct);
      toneForAction(action,correct);
      $("#visitor").classList.add("react");
      await sceneWait(850);
      $("#visitor").classList.remove("react");
      $("#visitor").classList.add("exit");
      await sceneWait(420);
    }finally{
      $("#skipSceneButton").classList.add("hidden");
      play.skipRequested=false;
      sceneWaitResolver=null;
    }
  }

  function stageCase(caseData){
    $("#visitor").className="visitor";
    $("#visitor").innerHTML=avatarMarkup(caseData);
    $("#effectLayer").innerHTML="";
    $("#sceneCaption").textContent=caseData.summary;
  }

  function clearScene(){
    $("#visitor").className="visitor";$("#visitor").innerHTML="";$("#effectLayer").innerHTML="";
    $("#sceneCaption").textContent="Choose a situation and an action above.";
  }

  function showEffect(level,actionId,correct){
    const symbol=effectSymbol(level.scene.theme,actionId,correct);
    const layer=$("#effectLayer");
    layer.innerHTML=Array.from({length:correct?4:6},(_,index)=>`<span class="effectBurst" style="left:${24+index*8}%;animation-delay:${index*.05}s">${symbol}</span>`).join("");
  }

  function outcomeCaption(level,actionId,correct){
    const key=`correct${capitalize(actionId)}`;
    if(correct && level.scene[key])return level.scene[key];
    if(correct && actionId==="act" && level.scene.correctAct)return level.scene.correctAct;
    if(correct && actionId==="hold" && level.scene.correctHold)return level.scene.correctHold;
    if(!correct && actionId==="act" && level.scene.wrongAct)return level.scene.wrongAct;
    if(!correct && actionId==="hold" && level.scene.wrongHold)return level.scene.wrongHold;
    if(!correct && level.scene.wrong)return level.scene.wrong;
    return correct?"The action follows the correct rule.":"The action does not follow the correct rule.";
  }

  function effectSymbol(theme,actionId,correct){
    if(!correct)return theme==="water"||theme==="rain"?"💦":theme==="gate"||theme==="festival"?"‼":"✹";
    if(actionId==="help")return "♥";
    if(actionId==="deliver")return "•";
    if(actionId==="admit"||actionId==="welcome"||actionId==="act")return theme==="water"||theme==="rain"?"·":theme==="festival"?"✦":"✧";
    if(actionId==="whisper")return "·";
    return "○";
  }

  function disablePlayControls(disabled){
    const inTeaching=play.phase===PHASES.TEACHING;
    const inReflection=play.phase===PHASES.REFLECTION;
    const proof=play.level?E.proofStatus(play.level,play.lessons):{complete:false};
    const rules=play.level?E.consistentRules(play.level,play.lessons):[];
    $("#beginChallengeButton").disabled=disabled||!inTeaching||!proof.complete||!rules.length;
    $("#undoLessonButton").disabled=disabled||!inTeaching||!play.lessons.length;
    $("#clearLessonsButton").disabled=disabled||!inTeaching||!play.lessons.length;
    $("#focusSuggestedButton").disabled=disabled||!inTeaching||!play.recommendedId;
    $("#togglePredictionButton").disabled=disabled||!inTeaching||!play.lessons.length||play.solved;
    $("#toggleNotebookButton").disabled=disabled;
    $("#hintButton").disabled=disabled||!inTeaching;
    $("#replaySceneButton").disabled=disabled||!play.lastScene||play.phase===PHASES.EXAM;
    $("#replayExamButton").disabled=disabled||!inReflection||!play.challengeResults.length;
    $("#recommendedLessonButton").disabled=disabled||!inReflection||!play.recommendedId;
    $("#reviseButton").disabled=disabled||!inReflection;
    $("#completeLevelButton").disabled=disabled||!inReflection||!play.solved||play.committed;
    if(disabled){
      $("#lessonGrid").querySelectorAll("button").forEach(button=>button.disabled=true);
      $("#teachPanel").querySelectorAll("button").forEach(button=>button.disabled=true);
    }else{
      renderTeaching();
    }
  }

  function setPipMood(mood,thought,caption){
    const pip=$("#pip");
    pip.className=`pip mood-${mood}`;
    applyPipAccessories(pip);
    pip.setAttribute("aria-label",`Pip is ${mood}`);
    $("#thoughtBubble").textContent=thought;
    $("#pipLine").textContent=`“${caption}”`;
  }

  function setCertaintyBadge(text,className){
    const badge=$("#certaintyBadge");badge.textContent=text;badge.className=`certaintyBadge ${className||""}`;
  }

  function applyPipAccessories(pip){
    if(!pip)return;
    pip.classList.toggle("has-pin",hasHabit(3));
    pip.classList.toggle("has-scarf",hasHabit(6));
    pip.classList.toggle("has-notebook",hasHabit(9));
    pip.classList.toggle("has-moon",hasHabit(12));
  }

  function trapFocus(event,container){
    if(event.key!=="Tab"||!container)return false;
    const focusable=[...container.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')]
      .filter(element=>!element.closest(".hidden"));
    if(!focusable.length)return false;
    const first=focusable[0],last=focusable[focusable.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();return true;}
    if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();return true;}
    return false;
  }

  function updateOverlayState(){
    const open=!$("#storyModal").classList.contains("hidden")||!$("#settingsDrawer").classList.contains("hidden");
    document.body.classList.toggle("overlayOpen",open);
  }

  function showStory({kicker,title,body,button,onContinue,artLabel,artKey}){
    lastFocusedElement=document.activeElement;
    $("#storyKicker").textContent=kicker||"RULE GARDEN";
    const artSource=CHARACTER_ASSETS[artKey]||null;
    setOptionalImage($("#storyArt"),artSource,artLabel||"✦");
    $("#storyTitle").textContent=title;
    $("#storyBody").textContent=body;
    $("#storyContinueButton").textContent=button||"Continue";
    storyAction=onContinue||null;
    $("#storyModal").classList.remove("hidden");
    $("#storyModal").setAttribute("aria-hidden","false");
    updateOverlayState();
    requestAnimationFrame(()=>$("#storyContinueButton").focus());
  }

  function closeStory(){
    $("#storyModal").classList.add("hidden");
    $("#storyModal").setAttribute("aria-hidden","true");
    updateOverlayState();
    const action=storyAction;storyAction=null;
    if(action)action();
    else lastFocusedElement?.focus?.();
  }

  function openSettings(){
    lastFocusedElement=document.activeElement;
    applySettings();
    $("#settingsDrawer").classList.remove("hidden");
    $("#settingsDrawer").setAttribute("aria-hidden","false");
    updateOverlayState();
    requestAnimationFrame(()=>$("#closeSettingsButton").focus());
  }
  function closeSettings(){
    $("#settingsDrawer").classList.add("hidden");
    $("#settingsDrawer").setAttribute("aria-hidden","true");
    updateOverlayState();
    lastFocusedElement?.focus?.();
  }

  function toneForAction(action,correct){
    if(!progress.settings.sound)return;
    const base=correct?({care:540,work:430,kind:620,cautious:350,firm:290}[action?.tone]||480):150;
    playTone(base,.09,correct?"sine":"triangle");
  }

  function playTone(frequency,duration,type="sine"){
    if(!progress.settings.sound)return;
    const Context=window.AudioContext||window.webkitAudioContext;if(!Context)return;
    audioContext=audioContext||new Context();
    const oscillator=audioContext.createOscillator();const gain=audioContext.createGain();
    oscillator.type=type;oscillator.frequency.value=frequency;gain.gain.value=.0001;
    oscillator.connect(gain);gain.connect(audioContext.destination);
    gain.gain.exponentialRampToValueAtTime(.06,audioContext.currentTime+.01);
    gain.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+duration);
    oscillator.start();oscillator.stop(audioContext.currentTime+duration+.03);
  }

  function celebrate(){[523,659,784,1047].forEach((frequency,index)=>setTimeout(()=>playTone(frequency,.13,"sine"),index*105));}

  function toast(message){
    const box=$("#toast");box.textContent=message;box.classList.remove("hidden");
    clearTimeout(toast.timer);toast.timer=setTimeout(()=>box.classList.add("hidden"),2700);
  }

  function actionLabel(level,id){return level.actions.find(action=>action.id===id)?.label||id;}
  function characterAssetKey(name){return CHARACTER_ASSETS[name]?name:null;}
  function starString(stars){return `${"★".repeat(stars)} ${"☆".repeat(3-stars)}`.trim();}
  function capitalize(text){return String(text).charAt(0).toUpperCase()+String(text).slice(1);}
  function kindGlyph(kind){return ({bell:"◉",water:"◒",gate:"⌑",basket:"▥",door:"▯",memory:"≋",care:"♥",moon:"☾",match:"◇",rhythm:"♫",weather:"☂",festival:"✦"})[kind]||"✦";}
  function escapeHtml(value){return String(value).replace(/[&<>'"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[char]);}

  function pipMarkup(mood){
    return `<div class="pip ${mood||"mood-curious"}"><div class="pip-ear pip-ear--left"></div><div class="pip-ear pip-ear--right"></div><div class="pip-body"><div class="pip-eye eye-left"></div><div class="pip-eye eye-right"></div><div class="pip-mouth"></div><div class="pip-cheek cheek-left"></div><div class="pip-cheek cheek-right"></div></div><div class="pip-feet"></div><div class="pip-accessories"></div></div>`;
  }

  const PORTRAIT_ASSETS=Object.freeze({
    rabbit:"assets/cinematic/portraits/rabbit.webp",
    frog:"assets/cinematic/portraits/frog.webp",
    moth:"assets/cinematic/portraits/moth.webp",
    fox:"assets/cinematic/portraits/fox.webp",
    badger:"assets/cinematic/portraits/badger.webp",
    bird:"assets/cinematic/portraits/bird.webp",
    snail:"assets/cinematic/portraits/snail.webp",
    mouse:"assets/cinematic/portraits/mouse.webp",
    raccoon:"assets/cinematic/portraits/raccoon.webp",
    squirrel:"assets/cinematic/portraits/squirrel.webp",
    otter:"assets/cinematic/portraits/otter.webp",
    plant:"assets/cinematic/portraits/plant.webp",
    flower:"assets/cinematic/portraits/flower.webp",
    basket:"assets/cinematic/portraits/basket.webp",
    beetle:"assets/cinematic/portraits/beetle.webp",
    mole:"assets/cinematic/portraits/mole.webp",
    cat:"assets/cinematic/portraits/cat.webp",
    turtle:"assets/cinematic/portraits/turtle.webp",
    bat:"assets/cinematic/portraits/bat.webp",
    lizard:"assets/cinematic/portraits/lizard.webp"
  });

  const CHARACTER_ASSETS=Object.freeze({
    Pip:"assets/cinematic/characters/pip_character.png",
    Rowan:"assets/cinematic/characters/rowan_character.png",
    Sable:"assets/cinematic/characters/sable_vey_character.png",
    Juniper:"assets/cinematic/characters/juniper_character.png",
    Lumi:"assets/cinematic/characters/lumi_spirit.png",
    "Tovin's Echo":"assets/cinematic/characters/tovins_echo.png"
  });

  const CINEMATIC_ASSETS=Object.freeze({
    promiseCrystal:"assets/cinematic/promise_flame_crystal.png",
    notebookPanel:"assets/cinematic/ui/notebook_panel_open.png",
    encounterCardFrame:"assets/cinematic/ui/encounter_card_frame.png"
  });

  const SCENE_PROP_ASSETS=Object.freeze({
    bridge:"assets/cinematic/props/bridge.webp",
    blackRain:"assets/cinematic/props/black-rain.webp",
    lantern:"assets/cinematic/props/lantern.webp",
    gate:"assets/cinematic/props/gate.webp",
    wardroot:"assets/cinematic/props/wardroot.webp"
  });

  const PIP_STATE_ASSETS=Object.freeze({
    pipIdle:"assets/cinematic/pip/idle.webp",
    pipThinking:"assets/cinematic/pip/thinking.webp",
    pipConfident:"assets/cinematic/pip/confident.webp",
    pipConfused:"assets/cinematic/pip/confused.webp",
    pipProud:"assets/cinematic/pip/proud.webp",
    pipSad:"assets/cinematic/pip/sad.webp"
  });

  const SCENE_ART_BY_LEVEL=Object.freeze({
    "bell-basics":"bridge-of-embers",
    "thirsty-beds":"wardroot-garden",
    "seed-gate":"rootgate",
    "berry-basket":"forge",
    "knock-first":"glassworks",
    "rain-memory":"second-morning",
    "care-first":"wardroot-garden",
    "moon-voices":"moonhouse",
    "matching-tools":"lantern-heart",
    "garden-rhythm":"tovins-route",
    "weather-wisdom":"black-rain",
    "festival-gate":"lantern-heart-breaking"
  });

  const SCENE_ART_BY_THEME=Object.freeze({
    festival:"bridge-of-embers",
    water:"wardroot-garden",
    care:"wardroot-garden",
    moon:"moonhouse",
    rain:"black-rain"
  });

  function sceneArtKey(level){
    return SCENE_ART_BY_LEVEL[level.id]||SCENE_ART_BY_THEME[level.scene?.theme]||"";
  }

  const SCENE_PROP_OVERRIDES=Object.freeze({
    "bell-basics":"bridge",
    "thirsty-beds":"wardroot",
    "seed-gate":"gate",
    "rain-memory":"blackRain",
    "weather-wisdom":"blackRain",
    "festival-gate":"gate"
  });

  function portraitMarkup(caseData){
    const source=PORTRAIT_ASSETS[caseData.species];
    const image=source?`<img class="portraitPhoto" src="${source}" alt="" loading="lazy" onerror="this.remove()" />`:"";
    return `${image}${avatarMarkup(caseData)}`;
  }

  function setOptionalImage(element,source,fallback){
    if(!element)return;
    element.textContent=fallback||"";
    if(!source)return;
    const image=new Image();
    image.alt="";
    image.onload=()=>element.replaceChildren(image);
    image.src=source;
  }

  function renderSceneProp(level){
    const element=$("#sceneProp");
    if(!element)return;
    const assetKey=SCENE_PROP_OVERRIDES[level.id]||(level.scene?.prop==="lantern-gate"?"lantern":null);
    const source=SCENE_PROP_ASSETS[assetKey];
    const fallback=()=>{element.innerHTML=propMarkup(level.scene?.prop);};
    if(!source){fallback();return;}
    element.textContent="";
    const image=new Image();
    image.className="scenePropPhoto";
    image.alt="";
    image.onload=()=>element.replaceChildren(image);
    image.onerror=fallback;
    image.src=source;
  }

  function preloadCinematicAssets(){
    const assets={
      heroPip:"assets/cinematic/hero-pip.webp",
      pipPortrait:"assets/cinematic/pip-portrait.webp",
      storyBridge:"assets/cinematic/story-bridge.webp",
      mapLandmarks:"assets/cinematic/map-landmarks.webp",
      ...CINEMATIC_ASSETS,
      ...PIP_STATE_ASSETS,
      ...Object.fromEntries(Object.entries(SCENE_ART_BY_LEVEL).map(([,key])=>[`scene${key.replace(/[^a-z]/gi,"")}`,`assets/cinematic/scenes/${key}.webp`])),
      ...Object.fromEntries(Object.entries(PORTRAIT_ASSETS).map(([key,source])=>[`portrait${key}`,source])),
      ...Object.fromEntries(Object.entries(SCENE_PROP_ASSETS).map(([key,source])=>[`sceneProp${key}`,source])),
      ...Object.fromEntries(Object.entries(CHARACTER_ASSETS).map(([key,source])=>[`character${key.replace(/[^a-z]/gi,"")}`,source]))
    };
    Object.entries(assets).forEach(([name,source])=>{
      const image=new Image();
      image.onload=()=>document.documentElement.classList.add(`asset-${name}`);
      image.src=source;
    });
  }

  function avatarMarkup(caseData){
    const [body="#7a9d68",accent="#d7b76a"]=caseData.palette||[];
    const species=caseData.species||"creature";
    const common=`<ellipse cx="50" cy="96" rx="31" ry="8" fill="rgba(30,50,40,.13)"/>`;
    const eyes=`<circle cx="40" cy="45" r="3.3" fill="#183126"/><circle cx="61" cy="45" r="3.3" fill="#183126"/>`;
    let art="";
    if(species==="bird")art=`<path d="M28 75 Q20 48 37 25 Q55 8 72 30 Q88 50 72 78 Q53 94 28 75" fill="${body}"/><path d="M68 43 l22 9 -22 8z" fill="${accent}"/><path d="M33 62 Q15 52 19 79 Q34 76 45 67" fill="${accent}"/>${eyes}<path d="M44 57 q7 6 14 0" fill="none" stroke="#183126" stroke-width="2.5"/>`;
    else if(species==="snail")art=`<path d="M19 77 Q25 54 49 58 L76 58 Q87 62 82 76 Q68 90 26 84z" fill="${body}"/><circle cx="43" cy="52" r="24" fill="${accent}"/><path d="M43 34 q18 5 8 22 q-9 12-22 2 q-9-8-2-17" fill="none" stroke="rgba(60,55,35,.35)" stroke-width="5"/><path d="M73 58 q0-24 7-29 M83 59 q4-22 13-25" stroke="${body}" stroke-width="4" fill="none"/><circle cx="80" cy="27" r="3" fill="#183126"/><circle cx="96" cy="32" r="3" fill="#183126"/>`;
    else if(species==="plant"||species==="flower")art=`<path d="M49 91 V48" stroke="#477854" stroke-width="8" stroke-linecap="round"/><path d="M49 66 Q25 58 23 39 Q44 39 49 57" fill="${body}"/><path d="M50 57 Q69 38 83 44 Q78 65 51 70" fill="${body}"/>${species==="flower"?`<g transform="translate(50 32)"><circle r="12" fill="${accent}"/><circle cx="-12" r="10" fill="${body}"/><circle cx="12" r="10" fill="${body}"/><circle cy="-12" r="10" fill="${body}"/><circle cy="12" r="10" fill="${body}"/><circle r="6" fill="#6f5630"/></g>`:`<path d="M50 45 Q33 30 50 14 Q68 30 50 45" fill="${accent}"/>`}`;
    else if(species==="basket")art=`<path d="M22 46 Q50 20 78 46" fill="none" stroke="${accent}" stroke-width="8"/><path d="M18 48 L82 48 L74 89 Q50 101 26 89z" fill="${accent}"/><path d="M23 58 H77 M21 70 H79 M30 48 V92 M44 48 V96 M58 48 V96 M72 48 V92" stroke="rgba(93,61,31,.28)" stroke-width="3"/><circle cx="38" cy="52" r="10" fill="${body}"/><circle cx="53" cy="49" r="11" fill="${body}"/><circle cx="66" cy="55" r="9" fill="${body}"/>`;
    else if(species==="moth"||species==="bat")art=`<ellipse cx="50" cy="57" rx="15" ry="30" fill="${body}"/><path d="M40 45 Q10 20 13 70 Q28 83 45 64" fill="${accent}"/><path d="M60 45 Q90 20 87 70 Q72 83 55 64" fill="${accent}"/>${eyes}<path d="M39 29 l-9-13 M61 29 l9-13" stroke="${body}" stroke-width="4"/>`;
    else if(species==="beetle")art=`<ellipse cx="50" cy="61" rx="30" ry="37" fill="${body}"/><path d="M50 26 V96 M26 50 H74" stroke="${accent}" stroke-width="4"/><circle cx="50" cy="25" r="17" fill="${accent}"/>${eyes}<path d="M25 48 L10 37 M23 65 L7 67 M75 48 L90 37 M77 65 L93 67" stroke="#405347" stroke-width="4"/>`;
    else if(species==="frog")art=`<ellipse cx="50" cy="66" rx="34" ry="29" fill="${body}"/><circle cx="33" cy="39" r="14" fill="${body}"/><circle cx="67" cy="39" r="14" fill="${body}"/><circle cx="33" cy="39" r="5" fill="#183126"/><circle cx="67" cy="39" r="5" fill="#183126"/><path d="M34 67 Q50 79 66 67" fill="none" stroke="#183126" stroke-width="3"/><ellipse cx="50" cy="73" rx="17" ry="9" fill="${accent}" opacity=".5"/>`;
    else {
      const longEars=species==="rabbit";
      const roundEars=["mouse","mole","otter"].includes(species);
      const noEars=["turtle","lizard"].includes(species);
      const earShape=longEars?"M25 38 Q12 3 32 5 Q45 28 39 43":roundEars?"M21 38 Q9 18 31 18 Q43 26 39 43":"M25 38 Q12 12 35 20 L42 43";
      const ear2=longEars?"M75 38 Q88 3 68 5 Q55 28 61 43":roundEars?"M79 38 Q91 18 69 18 Q57 26 61 43":"M75 38 Q88 12 65 20 L58 43";
      const ears=noEars?"":`<path d="${earShape}" fill="${body}"/><path d="${ear2}" fill="${body}"/>`;
      let tail="";
      if(species==="fox"||species==="cat")tail=`<path d="M74 76 Q105 62 91 91 Q82 103 70 88" fill="${accent}"/>`;
      if(species==="raccoon")tail=`<path d="M73 76 Q105 63 91 94 Q78 101 70 88" fill="${body}"/><path d="M80 72 l9 4 M78 83 l11 5 M76 92 l8 4" stroke="${accent}" stroke-width="5"/>`;
      if(species==="otter")tail=`<path d="M73 78 Q105 83 92 99 Q79 101 68 88" fill="${body}"/>`;
      if(species==="lizard")tail=`<path d="M75 78 Q108 73 92 104" fill="none" stroke="${body}" stroke-width="10" stroke-linecap="round"/>`;
      const shell=species==="turtle"?`<ellipse cx="50" cy="73" rx="38" ry="25" fill="${accent}"/><path d="M22 72 Q50 48 78 72 M31 58 L43 90 M69 58 L57 90" stroke="rgba(45,70,45,.3)" stroke-width="4"/>`:"";
      const mask=species==="raccoon"?`<path d="M25 40 Q50 26 75 40 Q67 57 50 51 Q33 57 25 40" fill="${accent}" opacity=".78"/>`:species==="badger"?`<path d="M37 23 L46 68 H31 L21 32z M63 23 L54 68 H69 L79 32z" fill="${accent}" opacity=".8"/>`:"";
      const whiskers=["cat","mouse","otter"].includes(species)?`<path d="M33 57 H12 M34 62 L15 68 M67 57 H88 M66 62 L85 68" stroke="#405347" stroke-width="2"/>`:"";
      const nose=species==="mole"?`<ellipse cx="50" cy="61" rx="14" ry="10" fill="${accent}"/><circle cx="50" cy="59" r="4" fill="#d98d8d"/>`:`<ellipse cx="50" cy="58" rx="10" ry="8" fill="${accent}"/><circle cx="50" cy="55" r="3" fill="#183126"/>`;
      art=`${tail}${shell}<ellipse cx="50" cy="69" rx="34" ry="30" fill="${body}"/>${ears}<ellipse cx="50" cy="45" rx="27" ry="25" fill="${body}"/>${mask}${eyes}${nose}${whiskers}<path d="M44 64 q6 6 12 0" fill="none" stroke="#183126" stroke-width="2.5"/>`;
    }
    return `<svg viewBox="0 0 100 110" role="img" aria-label="${escapeHtml(caseData.name)}">${common}${art}</svg>`;
  }

  function propMarkup(prop){
    const baseStart=`<svg viewBox="0 0 120 110" aria-hidden="true">`;
    const end=`</svg>`;
    const props={
      bell:`<path d="M39 70 Q42 33 60 25 Q78 33 81 70z" fill="#d2a342"/><rect x="34" y="69" width="52" height="9" rx="4" fill="#9a6b29"/><circle cx="60" cy="82" r="7" fill="#c2882e"/><path d="M60 25 V12" stroke="#7c5b2d" stroke-width="5"/>`,
      can:`<path d="M28 45 h52 v48 H28z" rx="8" fill="#6f9eaa"/><path d="M80 55 Q107 44 105 72 Q96 75 80 72" fill="none" stroke="#6f9eaa" stroke-width="9"/><path d="M36 45 Q39 21 60 21 Q78 23 78 45" fill="none" stroke="#507784" stroke-width="7"/>`,
      gate:`<rect x="24" y="22" width="10" height="76" fill="#8c6543"/><rect x="88" y="22" width="10" height="76" fill="#8c6543"/><path d="M32 38 H90 M32 59 H90 M32 80 H90 M40 30 V89 M59 30 V89 M78 30 V89" stroke="#d2ad72" stroke-width="7"/>`,
      basket:`<path d="M24 45 Q60 8 96 45" fill="none" stroke="#8f6338" stroke-width="8"/><path d="M19 46 H101 L91 96 H29z" fill="#c79a59"/><circle cx="45" cy="50" r="13" fill="#a74e58"/><circle cx="64" cy="46" r="14" fill="#b75a60"/><circle cx="80" cy="54" r="12" fill="#994a55"/>`,
      door:`<rect x="30" y="15" width="64" height="90" rx="4" fill="#725139"/><rect x="38" y="23" width="48" height="74" fill="#8c6849"/><circle cx="76" cy="62" r="5" fill="#d4aa43"/>`,
      calendar:`<rect x="24" y="24" width="72" height="72" rx="8" fill="#f2e7cd"/><rect x="24" y="24" width="72" height="20" rx="8" fill="#668da3"/><text x="60" y="78" text-anchor="middle" font-size="36" font-weight="900" fill="#36544a">2</text>`,
      "first-aid":`<rect x="25" y="34" width="70" height="55" rx="9" fill="#f0e8d7"/><rect x="48" y="22" width="24" height="15" rx="5" fill="#8c6a4a"/><path d="M53 45 h14 v12 h12 v14 H67 v12 H53 V71 H41 V57 H53z" fill="#b95450"/>`,
      moonhouse:`<path d="M18 53 L60 18 L102 53 V100 H18z" fill="#6a547a"/><rect x="48" y="64" width="25" height="36" fill="#d4ad60"/><circle cx="61" cy="42" r="13" fill="#f0df9b"/>`,
      shelf:`<rect x="19" y="27" width="82" height="72" fill="#8a6849"/><path d="M24 51 H96 M24 74 H96" stroke="#d0ad78" stroke-width="7"/><circle cx="42" cy="42" r="8" fill="#6684aa"/><circle cx="64" cy="42" r="8" fill="#d0a842"/><circle cx="82" cy="65" r="8" fill="#6e9967"/>`,
      chime:`<path d="M60 12 V31" stroke="#805f36" stroke-width="5"/><path d="M37 34 Q60 19 83 34 L77 76 Q60 90 43 76z" fill="#c89a3e"/><circle cx="60" cy="86" r="7" fill="#9d6e2c"/>`,
      thermometer:`<rect x="52" y="19" width="17" height="62" rx="8" fill="#f0e7d5"/><rect x="58" y="35" width="5" height="48" fill="#bd5754"/><circle cx="60.5" cy="86" r="17" fill="#bd5754"/>`,
      "lantern-gate":`<rect x="13" y="28" width="10" height="73" fill="#7b5b42"/><rect x="97" y="28" width="10" height="73" fill="#7b5b42"/><path d="M22 39 H98 M22 62 H98 M22 85 H98" stroke="#d5ae70" stroke-width="7"/><path d="M41 22 V7 M79 22 V7" stroke="#7d5e42" stroke-width="3"/><rect x="30" y="16" width="22" height="29" rx="6" fill="#e8ad45"/><rect x="68" y="16" width="22" height="29" rx="6" fill="#e8ad45"/>`
    };
    return baseStart+(props[prop]||props.bell)+end;
  }

  function contentDefinitionErrors(){
    return typeof E.validateCampaign==="function"?E.validateCampaign(LEVELS):LEVELS.flatMap(level=>
      E.validateLevelDefinition(level).map(error=>`${level.number}. ${level.title}: ${error}`)
    );
  }

  function showContentError(errors){
    $("#startButton").disabled=true;
    $("#continueButton").classList.add("hidden");
    $("#resumeLessonButton").classList.add("hidden");
    const copy=document.querySelector(".welcomeCopy p");
    const details=(errors||[]).slice(0,2).join(" ");
    if(copy)copy.textContent=`This development package contains an invalid lesson definition.${details?` ${details}`:""} Open validation.html for the full integrity report.`;
    $("#startButton").title=details||"Campaign content validation failed.";
    console.error("Rule Garden content integrity error",errors);
  }

  function confirmLeaveActiveLesson(){
    if(currentScreen!=="play" || !play.level || play.running)return !play.running;
    if(play.committed)return true;
    saveActiveSession();
    if(play.solved)return confirm("Leave before recording this completed lesson? The notebook will be saved, but Pip will need to try alone again.");
    return true;
  }

  // Navigation and settings bindings
  $("#reviewUnlockButton").classList.toggle("hidden",!REVIEW_TOOLS);
  $("#startButton").onclick=startNewChapter;
  $("#continueButton").onclick=renderMap;
  $("#resumeLessonButton").onclick=resumeActiveSession;
  $("#homeButton").onclick=()=>{
    if(play.running){toast("Finish the current scene first.");return;}
    if(currentScreen!=="welcome" && confirmLeaveActiveLesson())renderMap();
  };
  $("#backToMapButton").onclick=()=>{
    if(play.running){toast("Finish the current scene first.");return;}
    if(confirmLeaveActiveLesson())renderMap();
  };
  $("#settingsButton").onclick=openSettings;
  $("#closeSettingsButton").onclick=closeSettings;
  $("#closeSettingsBottomButton").onclick=closeSettings;
  $("#settingsDrawer .drawerBackdrop").onclick=closeSettings;
  $("#storyContinueButton").onclick=closeStory;
  $("#storyModal .modalBackdrop").onclick=()=>{};
  $("#soundButton").onclick=()=>{progress.settings.sound=!progress.settings.sound;saveProgress();applySettings();};
  $("#soundToggle").onchange=event=>{progress.settings.sound=event.target.checked;saveProgress();applySettings();};
  $("#motionToggle").onchange=event=>{progress.settings.reducedMotion=event.target.checked;saveProgress();applySettings();};
  $("#researchToggle").onchange=event=>{
    progress.settings.research=event.target.checked;saveProgress();applySettings();
    if(play.level && currentScreen==="play")updateNotebook();
  };
  $("#quickToggle").onchange=event=>{progress.settings.quickScenes=event.target.checked;saveProgress();applySettings();};
  $("#reviewUnlockButton").onclick=()=>{
    if(!confirmLeaveActiveLesson())return;
    progress.reviewer=true;progress.unlocked=LEVELS.length;saveProgress();renderMap();toast("All chapter lessons unlocked for review.");
  };
  $("#resetProgressButton").onclick=()=>{
    if(confirm("Reset chapter progress and the unfinished notebook?")){
      const retainedSettings={...progress.settings};
      clearActiveSession();progress={...defaultProgress(),settings:retainedSettings};saveProgress();applySettings();renderWelcome();setScreen("welcome");
    }
  };
  $("#hintButton").onclick=askPip;
  $("#undoLessonButton").onclick=undoLesson;
  $("#clearLessonsButton").onclick=clearLessons;
  $("#focusSuggestedButton").onclick=focusSuggestedContrast;
  $("#togglePredictionButton").onclick=togglePredictions;
  $("#toggleNotebookButton").onclick=toggleNotebook;
  $("#beginChallengeButton").onclick=beginChallenge;
  $("#replaySceneButton").onclick=replayLastScene;
  $("#skipSceneButton").onclick=skipCurrentScene;
  $("#replayExamButton").onclick=replayExamSummary;
  $("#recommendedLessonButton").onclick=useRecommendedLesson;
  $("#reviseButton").onclick=reviseLessons;
  $("#completeLevelButton").onclick=completeLevel;

  window.addEventListener("keydown",event=>{
    const tag=event.target?.tagName?.toLowerCase();
    if(["input","select","textarea"].includes(tag))return;
    const settingsOpen=!$("#settingsDrawer").classList.contains("hidden");
    const storyOpen=!$("#storyModal").classList.contains("hidden");
    const notebookOpen=notebookIsOpen();
    if(settingsOpen&&trapFocus(event,$("#settingsDrawer .drawerPanel")))return;
    if(storyOpen&&trapFocus(event,$("#storyModal .modalCard")))return;
    if(notebookOpen&&trapFocus(event,$("#notebookCard .notebookSpread")))return;
    if(event.key==="Escape"){
      if(settingsOpen){event.preventDefault();closeSettings();return;}
      if(storyOpen){event.preventDefault();closeStory();return;}
      if(notebookOpen){event.preventDefault();closeNotebook();return;}
      if(currentScreen==="play"&&!play.running&&confirmLeaveActiveLesson()){event.preventDefault();renderMap();}
      return;
    }
    if(settingsOpen||storyOpen||notebookOpen||currentScreen!=="play"||play.running)return;
    if(event.key.toLowerCase()==="h"){event.preventDefault();askPip();}
    if(event.key.toLowerCase()==="u"){event.preventDefault();undoLesson();}
    if(event.key.toLowerCase()==="p"){event.preventDefault();togglePredictions();}
    if(event.key.toLowerCase()==="n"){event.preventDefault();openNotebook();}
    if(event.key==="Enter"&&!$("#beginChallengeButton").disabled){event.preventDefault();beginChallenge();}
  });

  window.addEventListener("beforeunload",event=>{
    saveActiveSession();
    const hasUncommittedResult=currentScreen==="play" && !play.committed && (play.running||play.solved);
    if(!hasUncommittedResult)return;
    event.preventDefault();
    event.returnValue="";
  });

  preloadCinematicAssets();
  applySettings();
  renderWelcome();
  renderHeaderProgress();
  const startupErrors=contentDefinitionErrors();
  if(startupErrors.length)showContentError(startupErrors);
})();
