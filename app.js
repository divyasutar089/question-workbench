(function(){
const $=s=>document.querySelector(s);
const FW={
 PICO:{els:[["Population","Who, how many, where","e.g. first-year undergraduates"],["Intervention","What exposure or action","e.g. social media use of 3 h or more a day"],["Comparison","Compared with what","e.g. use of less than 1 h a day"],["Outcome","What is measured","e.g. end-of-semester GPA"]],
  t:["Among ",0,", does ",1,", compared with ",2,", change ",3,"?"]},
 SPIDER:{els:[["Sample","Who is studied","e.g. first-year undergraduates"],["Phenomenon of interest","The experience studied","e.g. experience of social media while studying"],["Design","How data is collected","e.g. semi-structured interviews"],["Evaluation","What is explored","e.g. perceived focus and study habits"],["Research type","Qualitative, quantitative or mixed","e.g. qualitative"]],
  t:["How do ",0," describe ",1,", examined through ",2," with a focus on ",3,"? (",4," research)"]},
 SPICE:{els:[["Setting","Where it happens","e.g. a university library"],["Perspective","Whose view","e.g. first-year students"],["Intervention","The service or practice","e.g. a weekly study-skills workshop"],["Comparison","Compared with what","e.g. no workshop"],["Evaluation","How success is judged","e.g. self-reported study confidence"]],
  t:["In ",0,", from the perspective of ",1,", how does ",2,", compared with ",3,", affect ",4,"?"]}
};
const FINER=["Feasible: I have the time, access and skills to answer it.","Interesting: it matters to me and to my readers.","Novel: it confirms, refutes or extends what is known.","Ethical: it can be studied without undue harm.","Relevant: the answer informs knowledge or practice."];
const RUB=["Clarity and focus","Specificity of population or context","Measurable outcome or phenomenon","Feasibility"];
const EX={
 PICO:{topic:"Does social media affect students?",v:["first-year undergraduates","social media use of 3 h or more a day","use of less than 1 h a day","end-of-semester GPA"]},
 SPIDER:{topic:"Does social media affect students?",v:["first-year undergraduates","experience of social media while studying","semi-structured interviews","perceived focus and study habits","qualitative"]}
};
const blank=()=>({topic:"",fw:"PICO",v:{PICO:[],SPIDER:[],SPICE:[]},finer:[],ps:{known:"",missing:"",why:""},r:[0,0,0,0]});
let S=blank();
try{const d=JSON.parse(localStorage.getItem("rqw"));if(d)S=Object.assign(blank(),d)}catch(e){}
const save=()=>{try{localStorage.setItem("rqw",JSON.stringify(S))}catch(e){}};

function fields(){
  const box=$("#fields");box.textContent="";
  FW[S.fw].els.forEach((e,i)=>{
    const d=document.createElement("div");d.className="field";
    const l=document.createElement("label");l.textContent=e[0]+" ("+e[1].toLowerCase()+")";l.htmlFor="f"+i;
    const inp=document.createElement("input");inp.type="text";inp.id="f"+i;inp.placeholder=e[2];inp.value=S.v[S.fw][i]||"";
    inp.addEventListener("input",()=>{S.v[S.fw][i]=inp.value.trim();preview();save()});
    d.append(l,inp);box.append(d);
  });
}
function question(){
  const f=FW[S.fw],q=$("#q");q.textContent="";
  const any=f.els.some((_,i)=>S.v[S.fw][i]);
  if(!any){q.textContent="Fill the elements in step 3 and your question assembles here.";q.style.color="var(--mut)";return}
  q.style.color="";
  f.t.forEach(p=>{
    if(typeof p==="string"){q.append(p);return}
    const val=S.v[S.fw][p],s=document.createElement(val?"mark":"span");
    if(val)s.textContent=val;else{s.className="gap-x";s.textContent="["+f.els[p][0]+"]"}
    q.append(s);
  });
}
function statement(){
  const box=$("#ps");box.textContent="";
  const rows=[["What is known","known"],["What is missing","missing"],["Why it matters","why"]];
  if(!rows.some(r=>S.ps[r[1]])){const p=document.createElement("p");p.className="empty";p.textContent="Complete step 5 to see your problem statement.";box.append(p);return}
  rows.forEach(([l,k])=>{if(!S.ps[k])return;const p=document.createElement("p"),b=document.createElement("b");b.textContent=l+": ";p.append(b,S.ps[k]);box.append(p)});
}
function preview(){
  question();statement();
  const t=S.r.reduce((a,b)=>a+b,0);$("#total").textContent=t;
  $("#band").textContent=t<10?"Rework it: tighten the weakest criterion first.":t<15?"Usable: raise the lowest-scoring criterion.":"Strong: ready to test against your reader.";
  $("#finerCount").textContent="FINER: "+S.finer.length+" of 5 checks passed.";
}
function build(){
  const fb=$("#finer");FINER.forEach((t,i)=>{
    const l=document.createElement("label"),c=document.createElement("input");c.type="checkbox";c.checked=S.finer.includes(i);
    c.addEventListener("change",()=>{S.finer=c.checked?[...S.finer,i]:S.finer.filter(x=>x!==i);preview();save()});
    l.append(c,t);fb.append(l)});
  const rb=$("#rubric");RUB.forEach((t,i)=>{
    const d=document.createElement("div");d.className="rub";
    const l=document.createElement("label"),o=document.createElement("span");o.textContent=S.r[i]+" / 5";l.htmlFor="r"+i;l.append(t,o);
    const r=document.createElement("input");r.type="range";r.min=0;r.max=5;r.step=1;r.id="r"+i;r.value=S.r[i];
    r.addEventListener("input",()=>{S.r[i]=+r.value;o.textContent=r.value+" / 5";preview();save()});
    d.append(l,r);rb.append(d)});
}
function sync(){
  $("#topic").value=S.topic;
  document.querySelectorAll('input[name=fw]').forEach(r=>r.checked=r.value===S.fw);
  document.querySelectorAll("[data-ps]").forEach(t=>t.value=S.ps[t.dataset.ps]);
  document.querySelectorAll("#finer input").forEach((c,i)=>c.checked=S.finer.includes(i));
  document.querySelectorAll("#rubric input").forEach((r,i)=>{r.value=S.r[i];r.previousSibling.lastChild.textContent=S.r[i]+" / 5"});
  fields();preview();
}
$("#topic").addEventListener("input",e=>{S.topic=e.target.value.trim();save()});
document.querySelectorAll('input[name=fw]').forEach(r=>r.addEventListener("change",()=>{S.fw=r.value;fields();preview();save()}));
document.querySelectorAll("[data-ps]").forEach(t=>t.addEventListener("input",()=>{S.ps[t.dataset.ps]=t.value.trim();preview();save()}));
document.querySelectorAll("[data-ex]").forEach(b=>b.addEventListener("click",()=>{const e=EX[b.dataset.ex];S.fw=b.dataset.ex;S.topic=e.topic;S.v[S.fw]=e.v.slice();sync();save()}));
$("#reset").addEventListener("click",()=>{if(confirm("Clear everything and start over?")){S=blank();sync();save()}});
$("#copy").addEventListener("click",e=>{const b=e.target,txt=$("#q").textContent;
  (navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(()=>{b.textContent="Copied"},()=>{b.textContent="Copy failed"});
  setTimeout(()=>b.textContent="Copy question",1500)});
$("#dl").addEventListener("click",()=>{
  const t=S.r.reduce((a,b)=>a+b,0);
  const txt=["RESEARCH QUESTION WORKSHEET","","Topic: "+S.topic,"Framework: "+S.fw,"","Question:",$("#q").textContent,"",
   ...FW[S.fw].els.map((e,i)=>e[0]+": "+(S.v[S.fw][i]||"")),"","Problem statement",
   "Known: "+S.ps.known,"Missing: "+S.ps.missing,"Why it matters: "+S.ps.why,"",
   "FINER checks passed: "+S.finer.length+"/5","Rubric: "+RUB.map((r,i)=>r+" "+S.r[i]+"/5").join("; "),"Total: "+t+"/20"].join("\n");
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([txt],{type:"text/plain"}));a.download="research-question.txt";a.click();URL.revokeObjectURL(a.href)});
build();sync();
})();
