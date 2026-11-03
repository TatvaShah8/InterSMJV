const fs=require("fs");
const p="C:/Users/gpgam/AppData/Roaming/Open Design/launcher/channels/stable/namespaces/release-stable-win/versions/0.26.1/payload/resources/app/node_modules/@open-design/contracts/dist/index.mjs";
const s=fs.readFileSync(p,"utf8");
let i=s.indexOf("od-done");
while(i!==-1){ console.log("=== @"+i); console.log(s.slice(Math.max(0,i-900),i+500)); console.log(); i=s.indexOf("od-done",i+1); if(i>470000) break; }
