import { createServer } from "node:http";
import { readFile, stat, mkdir } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

let chromium;
try{
  ({chromium}=await import("playwright"));
}catch(error){
  console.error("Playwright is required for the screenshot tour. Run: npm install && npx playwright install chromium");
  process.exitCode=1;
  throw error;
}

const root=fileURLToPath(new URL(".",import.meta.url));
const output=join(root,"screenshots");
const types={
  ".html":"text/html; charset=utf-8",
  ".js":"text/javascript; charset=utf-8",
  ".css":"text/css; charset=utf-8",
  ".svg":"image/svg+xml",
  ".png":"image/png"
};

const server=createServer(async(request,response)=>{
  try{
    const rawPath=decodeURIComponent((request.url||"/").split("?")[0]);
    const relative=rawPath==="/"?"index.html":rawPath.replace(/^\/+/,"");
    const path=normalize(join(root,relative));
    if(!path.startsWith(root))throw new Error("Invalid path");
    const info=await stat(path);
    if(!info.isFile())throw new Error("Not a file");
    response.writeHead(200,{"Content-Type":types[extname(path)]||"application/octet-stream","Cache-Control":"no-store"});
    response.end(await readFile(path));
  }catch(_error){
    response.writeHead(404,{"Content-Type":"text/plain; charset=utf-8"});
    response.end("Not found");
  }
});

await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const address=server.address();
const url=`http://127.0.0.1:${address.port}/`;
await mkdir(output,{recursive:true});

const browser=await chromium.launch({headless:true});

async function shot(page,name,{fullPage=true}={}){
  await page.screenshot({path:join(output,`${name}.png`),fullPage});
  console.log(`captured screenshots/${name}.png`);
}

async function clickIfVisible(page,selector){
  const locator=page.locator(selector);
  if(await locator.isVisible().catch(()=>false))await locator.click();
}

async function prepareFreshPage(context){
  const page=await context.newPage();
  await page.goto(url,{waitUntil:"networkidle"});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:"networkidle"});
  return page;
}

async function enableFastReview(page){
  await page.locator("#settingsButton").click();
  await page.locator("#motionToggle").check();
  await page.locator("#quickToggle").check();
  await page.locator("#closeSettingsBottomButton").click();
}

try{
  const desktopContext=await browser.newContext({viewport:{width:1440,height:1100},deviceScaleFactor:1});
  const page=await prepareFreshPage(desktopContext);
  await enableFastReview(page);

  await shot(page,"01-desktop-welcome",{fullPage:false});
  await page.locator("#startButton").click();
  await page.locator("#storyModal:not(.hidden)").waitFor();
  await shot(page,"02-desktop-renewal-story",{fullPage:false});
  await page.locator("#storyContinueButton").click();
  await page.locator("#storyModal:not(.hidden)").waitFor();
  await shot(page,"03-desktop-listener-story",{fullPage:false});
  await page.locator("#storyContinueButton").click();
  await page.locator("#mapScreen:not(.hidden)").waitFor();
  await shot(page,"04-desktop-chapter-map");

  await page.locator("#nextLessonButton").click();
  await clickIfVisible(page,"#storyContinueButton");
  await page.locator("#playScreen:not(.hidden)").waitFor();
  await shot(page,"05-desktop-lesson-start");

  await page.getByRole("button",{name:/Ember Snail/i}).click();
  await shot(page,"06-desktop-teaching-choice",{fullPage:false});
  await page.getByRole("button",{name:/Light the bridge/i}).click();
  await page.locator("#lessonCount").filter({hasText:"1"}).waitFor();

  await page.getByRole("button",{name:/Frightened Crow/i}).click();
  await page.getByRole("button",{name:/Hold the crossing/i}).click();
  await page.locator("#lessonCount").filter({hasText:"2"}).waitFor();
  await page.locator("#togglePredictionButton").click();
  await shot(page,"07-desktop-proof-and-prediction-lens");

  await page.locator("#beginChallengeButton").click();
  await page.locator("#reflectionCard:not(.hidden)").waitFor({timeout:15000});
  await shot(page,"08-desktop-solo-try-reflection");

  await page.locator("#completeLevelButton").click();
  await page.locator("#storyModal:not(.hidden)").waitFor();
  await shot(page,"09-desktop-promise-restored",{fullPage:false});
  await desktopContext.close();

  const mobileContext=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
  const mobile=await prepareFreshPage(mobileContext);
  await enableFastReview(mobile);
  await shot(mobile,"09-mobile-welcome",{fullPage:false});

  await mobile.locator("#startButton").click();
  await mobile.locator("#storyModal:not(.hidden)").waitFor();
  await mobile.locator("#storyContinueButton").click();
  await mobile.locator("#storyModal:not(.hidden)").waitFor();
  await mobile.locator("#storyContinueButton").click();
  await mobile.locator("#mapScreen:not(.hidden)").waitFor();
  await shot(mobile,"10-mobile-chapter-map");

  await mobile.locator("#nextLessonButton").click();
  await clickIfVisible(mobile,"#storyContinueButton");
  await mobile.locator("#playScreen:not(.hidden)").waitFor();
  await shot(mobile,"11-mobile-lesson-start");
  await mobileContext.close();

  console.log(`Screenshot tour complete: ${output}`);
}finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
