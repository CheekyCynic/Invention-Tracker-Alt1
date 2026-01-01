const a1 = window.alt1;
if (!a1) { document.getElementById("status").textContent = "Alt1 not detected"; }
const reader = new alt1.ChatboxReader();
reader.readargs = { colors: [alt1.chatColor.system, alt1.chatColor.game] };
const STORAGE_KEY = "inventionTracker";
const rareComponents = ["Avernic component","Armadyl component","Bandos component","Ancient component","Brassican component","Clockwork component","Hydrix component","Crystal component","Dragonkin component","Dungeoneering component","Saradomin component","Zaros component"];
const uncommonComponents = ["Superior component","Precise component","Refined component","Enhanced component"];
const commonComponents = ["Standard component","Basic component","Minor component"];
function getRarity(name){if(rareComponents.includes(name))return"rare"; if(uncommonComponents.includes(name))return"uncommon"; if(commonComponents.includes(name))return"common"; return"junk";}
let sessionStart = Date.now();
let scavProcs = 0, scavAttempts = 0;
let components = { scav:{}, spring:{} };
const saved = localStorage.getItem(STORAGE_KEY);
if(saved) components = JSON.parse(saved);
const tbody = document.getElementById("components"), statusEl = document.getElementById("status"), timerEl = document.getElementById("timer");
let activeTab = "scav";
document.querySelectorAll(".tab-button").forEach(btn=>{btn.addEventListener("click",()=>{document.querySelectorAll(".tab-button").forEach(b=>b.classList.remove("active")); btn.classList.add("active"); activeTab=btn.dataset.tab; render();})});
document.getElementById("reset").addEventListener("click",()=>{components={scav:{},spring:{}}; scavProcs=0; scavAttempts=0; sessionStart=Date.now(); localStorage.removeItem(STORAGE_KEY); render();});
document.getElementById("export").addEventListener("click",()=>{const header=["Tab","Component","Quantity","Qty/Hour","Rarity"]; const rows=[header.join(",")]; const elapsedHours=(Date.now()-sessionStart)/3600000; ["scav","spring"].forEach(tab=>{const current=components[tab]; Object.entries(current).forEach(([name,qty])=>{const xph=elapsedHours>0?(qty/elapsedHours).toFixed(1):0; const rarity=getRarity(name); rows.push([tab,name,qty,xph,rarity].join(","));})}); const csvContent=rows.join("\n"); const blob=new Blob([csvContent],{type:"text/csv;charset=utf-8;"}); const url=URL.createObjectURL(blob); const link=document.createElement("a"); link.setAttribute("href",url); link.setAttribute("download",`invention_tracker_${Date.now()}.csv`); link.style.display="none"; document.body.appendChild(link); link.click(); document.body.removeChild(link);});
function format(num){return Math.floor(num).toLocaleString();}
function addComponent(name,qty,isScav=false){const tab=isScav?"scav":"spring"; if(!components[tab][name]) components[tab][name]=0; components[tab][name]+=qty; if(isScav) scavAttempts++; if(isScav&&rareComponents.includes(name)) scavProcs++; if(rareComponents.includes(name)) alert(`Rare component dropped: ${name}`); localStorage.setItem(STORAGE_KEY,JSON.stringify(components)); render();}
function render(){tbody.innerHTML=""; const elapsedHours=(Date.now()-sessionStart)/3600000; const current=components[activeTab]; let totals={rare:0,uncommon:0,common:0,junk:0}; Object.entries(current).sort((a,b)=>b[1]-a[1]).forEach(([name,qty])=>{const xph=elapsedHours>0?(qty/elapsedHours).toFixed(1):0; const rarity=getRarity(name); totals[rarity]+=qty; const row=document.createElement("tr"); row.innerHTML=`<td>${name}</td><td>${qty} (${xph}/h)</td>`; row.classList.add(rarity); tbody.appendChild(row);}); const procRate=scavAttempts>0?((scavProcs/scavAttempts)*100).toFixed(2):0; statusEl.textContent=`Scav Proc Rate: ${procRate}% | Totals - Rare: ${totals.rare}, Uncommon: ${totals.uncommon}, Common: ${totals.common}, Junk: ${totals.junk}`;}
function updateTimer(){const elapsed=Math.floor((Date.now()-sessionStart)/1000); const h=String(Math.floor(elapsed/3600)).padStart(2,"0"); const m=String(Math.floor((elapsed%3600)/60)).padStart(2,"0"); const s=String(elapsed%60).padStart(2,"0"); timerEl.textContent=`Session Time: ${h}:${m}:${s}`;}
setInterval(updateTimer,1000);
function parseLine(line){const scav=line.match(/You scavenged:\s(.+?)\s*\(x(\d+)\)/i); if(scav){addComponent(scav[1],parseInt(scav[2]),true); return;} const spring=line.match(/spring cleaner.*?:\s(.+)/i); if(spring) addComponent(spring[1],1,false);}
function readChat(){const lines=reader.read(); if(!lines) return; lines.forEach(l=>parseLine(l.text));}
setInterval(readChat,600); render(); setInterval(render,1000);