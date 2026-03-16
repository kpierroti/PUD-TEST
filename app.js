(function () {

const DATA = window.PUD_DATA;
const AREA_LABEL = window.PUD_AREA_LABEL;

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

const state = {
track: "criancas",
area: "all",
q: ""
};

function normalize(str){

return (str || "")
.toLowerCase()
.normalize("NFD")
.replace(/[\u0300-\u036f]/g,"")
.trim();

}

function safeText(id,value){

const el = $(id);

if(el) el.textContent = value || "—";

}

function getFiltered(){

const trackObj = DATA[state.track];
const qn = normalize(state.q);
const results = [];

for(const [areaKey,areaObj] of Object.entries(trackObj.areas)){

if(state.area !== "all" && state.area !== areaKey) continue;

const lanes = (areaObj.lanes || [])

.map(l=>{

const steps = (l.steps || []).filter(step=>{

if(!qn) return true;

const hay = normalize(step.title + " " + (step.note || ""));

return hay.includes(qn);

});

return {...l,steps};

})

.filter(l=>l.steps.length>0);

if(lanes.length>0){

results.push({areaKey,areaObj,lanes});

}

}

return results;

}

function openModal({step,track,area,lane}){

const meta = step.meta || {};

safeText("#mTitle",step.title);
safeText("#mTrack",track);
safeText("#mArea",area);
safeText("#mLane",lane);
safeText("#mCarga",meta.carga_horaria);

if(meta.data_inicio && meta.data_final){

safeText("#mDatas",`${meta.data_inicio} → ${meta.data_final}`);

}

if(meta.horario_inicio && meta.horario_final){

safeText("#mHorario",`${meta.horario_inicio} - ${meta.horario_final}`);

}

safeText("#mFormato",meta.formato);


const desc = $("#mObs");

desc.textContent = step.note || "";
desc.classList.add("collapsed");

$("#toggleDesc").textContent = "Ver mais";


$("#toggleDesc").onclick = ()=>{

desc.classList.toggle("collapsed");

$("#toggleDesc").textContent =
desc.classList.contains("collapsed")
? "Ver mais"
: "Ver menos";

};


/* BOTÃO EMENTA */

$("#ementaBtn").onclick = ()=>{

const conteudo = meta.conteudo_programatico || [];

let html = "<h3>Ementa completa</h3>";

conteudo.forEach(l=>{

html += `<p>${l}</p>`;

});

const win = window.open("","ementa","width=700,height=800");

win.document.write(`
<html>
<head>
<title>Ementa</title>
<style>
body{
font-family:system-ui;
padding:30px;
line-height:1.6;
}
h3{
margin-bottom:20px;
}
</style>
</head>
<body>
${html}
</body>
</html>
`);

};


/* ABRIR MODAL */

const dlg = $("#dlg");

if(dlg.showModal) dlg.showModal();

}

function render(){

const trackObj = DATA[state.track];

$("#headline").textContent = trackObj.label;

$("#subline").textContent = trackObj.description;

const content = $("#content");

content.innerHTML = "";

const filtered = getFiltered();

$("#empty").hidden = filtered.length !== 0;

filtered.forEach(({areaKey,areaObj,lanes})=>{

const card = document.createElement("article");

card.className = `areaCard ${areaObj.accentClass || ""}`;

const accent =
areaKey==="audiovisual"
? "var(--cyan)"
: areaKey==="design"
? "var(--pink)"
: "var(--orange)";

card.style.setProperty("--accent",accent);

const laneCount = lanes.length;

const stepCount = lanes.reduce((acc,l)=>acc+(l.steps?.length||0),0);

card.innerHTML = `
<div class="areaHeader">

<div class="areaTitle">

<span class="spark"></span>

<div style="min-width:0">

<h3>${areaObj.label}</h3>

<div class="meta">
${laneCount} trilha(s) • ${stepCount} curso(s)
</div>

</div>

</div>

<span class="chip">

<span style="width:8px;height:8px;border-radius:999px;background:var(--accent);display:inline-block"></span>

${trackObj.label}

</span>

</div>

<div class="roadmap"></div>
`;

const roadmap = $(".roadmap",card);

lanes.forEach((lane,laneIndex)=>{

const laneBox = document.createElement("div");

laneBox.className = "lane";

laneBox.style.marginTop = laneIndex===0 ? "0":"12px";

const header = document.createElement("div");

header.className="connector";

header.innerHTML = `
<div><strong>${lane.label}</strong></div>
<div class="line"></div>
<div>sequência sugerida</div>
`;

laneBox.appendChild(header);

const steps = document.createElement("div");

steps.className="steps";

lane.steps.forEach((step,i)=>{

const el = document.createElement("div");

el.className="step";

el.style.setProperty("--accent",accent);

el.innerHTML=`

<div class="stepTop">

<span class="tag">${AREA_LABEL[areaKey]}</span>

<span class="tag">Etapa ${i+1}</span>

</div>

<h4>${step.title}</h4>

<p>${step.note || "Clique para ver detalhes."}</p>

`;

el.addEventListener("click",()=>{

openModal({
step,
track:trackObj.label,
area:AREA_LABEL[areaKey],
lane:lane.label
});

});

steps.appendChild(el);

});

laneBox.appendChild(steps);

roadmap.appendChild(laneBox);

});

content.appendChild(card);

});

}

function setTrack(track){

state.track = track;

$$(".tab").forEach(btn=>{

const active = btn.dataset.track===track;

btn.setAttribute("aria-selected",active?"true":"false");

});

render();

}

function bindEvents(){

$$(".tab").forEach(btn=>{
btn.addEventListener("click",()=>setTrack(btn.dataset.track));
});

$("#q").addEventListener("input",e=>{
state.q = e.target.value || "";
render();
});

$("#area").addEventListener("change",e=>{
state.area = e.target.value;
render();
});

$("#closeBtn").addEventListener("click",()=>$("#dlg").close());

$("#copyBtn").addEventListener("click",async()=>{

const text = $("#mTitle").textContent || "";

await navigator.clipboard.writeText(text);

});

}

bindEvents();
render();

})();
