/* Winter Arc OS — frontend prototype + Supabase integration hooks.
   Cloud is the source of truth when Supabase is configured. Demo mode is intentional
   so the complete UI can be explored before backend credentials are supplied. */
const C = window.WINTER_ARC_CONFIG || {SUPABASE_URL:"",SUPABASE_ANON_KEY:""};
const supabase = (C.SUPABASE_URL && !C.SUPABASE_URL.includes("YOUR_"))
  ? window.supabase.createClient(C.SUPABASE_URL,C.SUPABASE_ANON_KEY) : null;

const state = {
  page:"dashboard", user:null, profile:null, demo:true, selectedYear:2028,
  nav:[
   ["dashboard","⌂","Dashboard"],["arc","❄","Winter Arc"],["study","📚","Study"],
   ["cbt","⌨","CBT Arena"],["focus","⏱","Focus"],["analytics","📊","Analytics"],
   ["revision","🔄","Revision"],["errorbook","📕","Error Book"],["friends","👥","Friends"],
   ["calendar","🗓","Calendar"],["rewards","🏆","Rewards"],["profile","◉","Profile"]
  ],
  data:{
    hours:4.8, target:6, questions:186, accuracy:82, streak:12, xp:2480, level:9,
    tests:[{name:"JEE Main 2025 S1",score:156,max:300,acc:82},{name:"Mixed Mock #7",score:142,max:300,acc:78},{name:"Chapter Test",score:71,max:100,acc:86}],
    subjects:[["Physics",38],["Chemistry",27],["Maths",35]],
    chapters:[
      ["Physics","Kinematics","Projectile Motion",72,"practicing"],["Physics","NLM","Friction",48,"learning"],
      ["Chemistry","Chemical Bonding","MOT",64,"practicing"],["Chemistry","Periodic Properties","Trends",81,"revised"],
      ["Maths","Quadratic Equations","Roots & Graphs",58,"learning"],["Maths","Sequence & Progression","AP/GP",76,"practicing"]
    ],
    friends:[["Aarav","4.2h","183 Q","87%","🔥"],["Riya","3.6h","142 Q","84%","⚡"],["Kabir","5.1h","221 Q","91%","🏆"]],
    tasks:[
      ["Revise NLM — Friction","Physics","Today","high",false],["30 PYQs — Chemical Bonding","Chemistry","Today","medium",true],
      ["Kinematics mini CBT","Physics","Tomorrow","high",false],["Maths formula vault","Maths","Friday","low",false]
    ]
  }
};

const $=s=>document.querySelector(s);
function esc(x=""){return String(x).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}
function pct(a,b){return b?Math.round(a/b*100):0;}
function pageTitle(){return state.nav.find(x=>x[0]===state.page)?.[2]||"Winter Arc OS";}
function shell(){
 return `<div class="app"><aside class="sidebar"><div class="brand"><span>✦</span><div><b>WINTER ARC</b><small>JEE OS</small></div></div>
 <div class="nav">${state.nav.map(n=>`<button class="${state.page===n[0]?'active':''}" data-page="${n[0]}"><i>${n[1]}</i>${n[2]}</button>`).join("")}</div>
 <div class="side-bottom"><div class="mini"><span class="avatar">DP</span><div><b>${esc(state.profile?.display_name||"Dhairya")}</b><small>@${esc(state.profile?.username||"demo_user")}</small></div></div><button class="ghost" data-page="settings">⚙ Settings</button></div>
 </aside><main><header><button class="mobile-menu" onclick="document.body.classList.toggle('menu')">☰</button><div><small>WINTER ARC OS</small><h1>${pageTitle()}</h1></div><div class="header-actions"><span class="pill">🔥 ${state.data.streak} day streak</span><button class="iconbtn" onclick="openLogin()">⌁</button></div></header><section id="content">${renderPage()}</section></main></div>`;
}
function card(title,body,cls=""){return `<div class="card ${cls}"><div class="cardhead"><h3>${title}</h3></div>${body}</div>`;}
function progress(label,v,sub=""){return `<div class="progrow"><div><span>${label}</span><b>${v}%</b></div><div class="bar"><i style="width:${v}%"></i></div>${sub?`<small>${sub}</small>`:""}</div>`;}
function renderPage(){
 switch(state.page){
  case"dashboard":return dashboard(); case"arc":return arc(); case"study":return study(); case"cbt":return cbt();
  case"focus":return focus(); case"analytics":return analytics(); case"revision":return revision();
  case"errorbook":return errorbook(); case"friends":return friends(); case"calendar":return calendar();
  case"rewards":return rewards(); case"profile":return profile(); case"settings":return settings();
  default:return dashboard();
 }
}
function dashboard(){
 return `<div class="hero"><div><span class="eyebrow">JEE ${state.selectedYear} • CLOUD SYNC ${supabase?"ON":"DEMO"}</span><h2>Build the day you want to repeat.</h2><p>Your study, tests, revision and accountability — one operating system.</p><button class="primary" onclick="go('study')">Start today's mission →</button></div><div class="countdown"><small>JEE COUNTDOWN</small><strong id="countdown">—</strong><span>Target: 20 Jan ${state.selectedYear} until official date is configured</span></div></div>
 <div class="stats"><div class="stat"><small>Study today</small><b>${state.data.hours}h</b><span>of ${state.data.target}h</span></div><div class="stat"><small>Questions</small><b>${state.data.questions}</b><span>today</span></div><div class="stat"><small>Accuracy</small><b>${state.data.accuracy}%</b><span>attempted</span></div><div class="stat"><small>Level</small><b>${state.data.level}</b><span>${state.data.xp} XP</span></div></div>
 <div class="grid2">${card("Today's Mission",`<div class="mission"><b>🎯 6-hour JEE grind</b><span>2h Physics • 2h Chemistry • 2h Maths</span><div class="bar"><i style="width:${pct(state.data.hours,state.data.target)}%"></i></div><button class="secondary" onclick="go('focus')">Focus now</button></div>`)}
 ${card("Smart Alerts",`<div class="alerts"><p>🔄 <b>2 revisions</b> are due today.</p><p>⚠️ Friction mastery is only <b>48%</b>.</p><p>⌨️ Your next planned CBT is tomorrow.</p></div>`)}</div>
 <div class="grid3">${card("Subject mastery",state.data.subjects.map((s,i)=>progress(s[0],s[1],["Mechanics","Physical + Inorganic","Algebra + Coordinate"][i])).join(""))}
 ${card("Recent tests",state.data.tests.map(t=>`<div class="row"><span>${esc(t.name)}</span><b>${t.score}/${t.max}</b><small>${t.acc}%</small></div>`).join(""))}
 ${card("Friends activity",state.data.friends.map(f=>`<div class="friendline"><span class="avatar">${f[0][0]}</span><div><b>${f[0]}</b><small>${f[1]} • ${f[2]} • ${f[3]}</small></div><em>${f[4]}</em></div>`).join(""))}</div>`;
}
function arc(){
 return `<div class="sectionintro"><span class="eyebrow">CONSISTENCY ENGINE</span><h2>Choose the mode that matches reality.</h2><p>No shame loops. Recovery is a feature, not a failure.</p></div><div class="modegrid">${[
 ["Regular","Balanced daily plan","📘"],["Holiday","High-volume study","☀️"],["Challenge","Push your limits","⚔️"],["Recovery","Minimum viable day","🛟"],["Test Day","Exam execution","🧪"],["Backlog Raid","Attack overdue chapters","🚨"],["Revision Day","Revision-first plan","🔄"]
].map((m,i)=>`<button class="mode ${i===0?"chosen":""}" onclick="toast('${m[0]} mode selected')"><span>${m[2]}</span><b>${m[0]}</b><small>${m[1]}</small></button>`).join("")}</div>
 <div class="grid2">${card("Backlog Radar",state.data.chapters.map(c=>`<div class="row"><span>${c[1]} / ${c[2]}</span><b>${c[3]}%</b><small>${c[4]}</small></div>`).join(""))}
 ${card("Why am I behind?",`<div class="bigmetric"><b>7.5h</b><span>weekly gap</span></div><p class="muted">3 unfinished tasks • 2 missed revisions • Physics backlog +4h</p><button class="primary" onclick="toast('Recovery plan generated')">Generate recovery plan</button>`)}</div>`;
}
function study(){
 return `<div class="toolbar"><button class="primary" onclick="addTask()">＋ Add task</button><button class="secondary" onclick="toast('Smart Study Engine created a priority queue')">✨ What should I study?</button><select><option>Today</option><option>This week</option></select></div>
 <div class="grid2">${card("Today's Tasks",state.data.tasks.map((t,i)=>`<div class="task ${t[4]?'done':''}"><input type="checkbox" ${t[4]?"checked":""} onchange="toggleTask(${i})"><div><b>${esc(t[0])}</b><small>${t[1]} • ${t[2]} • ${t[3]} priority</small></div><span>${t[3]==="high"?"🔥":t[3]==="medium"?"•":"○"}</span></div>`).join(""))}
 ${card("Lecture Tracker",["Kinematics one-shot","Chemical Bonding — MOT","Quadratic Equations","NLM — Friction"].map((x,i)=>`<div class="lecture"><div><b>${x}</b><small>${["Completed","Watching","Notes pending","Questions pending"][i]}</small></div><div class="chips"><span>${i<2?"✓":"→"}</span></div></div>`).join(""))}</div>
 <div class="grid3">${card("Chapter Intelligence",state.data.chapters.map(c=>`<div class="chapter"><div><b>${c[1]}</b><small>${c[0]} • ${c[2]}</small></div><strong>${c[3]}%</strong></div>`).join(""))}
 ${card("Formula Vault",["NLM","Kinematics","Chemical Bonding","Quadratic","Sequences"].map(x=>`<div class="row"><span>⚡ ${x}</span><button class="link" onclick="toast('Formula quiz opened')">Quiz me</button></div>`).join(""))}
 ${card("Doubt Queue",`<div class="bigmetric"><b>4</b><span>unresolved doubts</span></div><button class="secondary" onclick="toast('Doubt added')">＋ Add doubt</button>`)}</div>`;
}
const officialPapers=[
 ["2026 • Apr 2 • Shift 1","B.Tech Paper 1","https://jeemain.nta.nic.in/admission-bulletin/"],
 ["2026 • Apr 2 • Shift 2","B.Tech Paper 1","https://jeemain.nta.nic.in/admission-bulletin/"],
 ["2026 • Apr 4 • Shift 1","B.Tech Paper 1","https://jeemain.nta.nic.in/admission-bulletin/"],
 ["2026 • Apr 4 • Shift 2","B.Tech Paper 1","https://jeemain.nta.nic.in/admission-bulletin/"],
 ["2026 • Apr 5 • Shift 1","B.Tech Paper 1","https://jeemain.nta.nic.in/admission-bulletin/"],
 ["2026 • Apr 5 • Shift 2","B.Tech Paper 1","https://jeemain.nta.nic.in/admission-bulletin/"],
 ["2026 • Apr 6 • Shift 1","B.Tech Paper 1","https://jeemain.nta.nic.in/admission-bulletin/"],
 ["2026 • Apr 6 • Shift 2","B.Tech Paper 1","https://jeemain.nta.nic.in/admission-bulletin/"],
 ["2026 • Apr 8 • Shift 2","B.Tech Paper 1","https://jeemain.nta.nic.in/admission-bulletin/"]
];
function cbt(){
 return `<div class="hero compact"><div><span class="eyebrow">JEE CBT ARENA</span><h2>Practice like test day.</h2><p>Full papers, subject tests, chapter tests, sub-topic tests, PYQs and adaptive/custom CBTs.</p></div><div class="countdown"><small>LAST CBT</small><strong>156/300</strong><span>82% accuracy</span></div></div>
 <div class="filters"><select><option>JEE Main</option><option>JEE Advanced</option></select><select><option>All years</option><option>2026</option><option>2025</option><option>2024</option></select><select><option>All subjects</option><option>Physics</option><option>Chemistry</option><option>Maths</option></select><button class="primary" onclick="startCBT()">▶ Start custom CBT</button></div>
 <div class="grid3">${card("Official JEE Paper Library",`<p class="muted">Official-source paper index. Winter Arc OS stores metadata/links here; question text is not copied without permission.</p>${officialPapers.map(p=>`<div class="row"><span>${p[0]}<small>${p[1]}</small></span><a class="link" href="${p[2]}" target="_blank" rel="noopener">Open NTA ↗</a></div>`).join("")}<a class="secondary linkbtn" href="https://jeemain.nta.nic.in/" target="_blank" rel="noopener">Official JEE Main website</a>`)}
 ${card("Chapter CBT",`<div class="selectline"><select><option>Physics</option><option>Chemistry</option><option>Maths</option></select><select><option>Kinematics</option><option>NLM</option><option>Rotation</option></select></div><div class="subtopics"><span>☑ 1D Motion</span><span>☑ Projectile</span><span>☑ Relative Motion</span><span>☐ Graphs</span></div><button class="secondary" onclick="startCBT()">Create chapter test</button>`)}
 ${card("Sub-topic CBT",`<b>Projectile Motion</b><p class="muted">10 questions • Mixed • 20 min</p><button class="secondary" onclick="startCBT()">Start targeted test</button>`)}</div>
 <div class="grid2">${card("Adaptive CBT",`<p>Difficulty adjusts from your response speed and accuracy.</p><button class="primary" onclick="toast('Adaptive CBT configured')">Build adaptive test</button>`)}
 ${card("Weakness CBT",`<p>Auto-targets NLM, Friction and weak sub-topics from your actual analytics.</p><button class="primary" onclick="toast('Weakness CBT generated')">Generate weak-area test</button>`)}</div>
 <div id="cbtbox"></div>
 <div class="grid3">${card("Question tools",["⭐ Important","❌ Mistake","🤔 Doubt","🔥 Tough","🔄 Reattempt"].map(x=>`<span class="tag">${x}</span>`).join(" "))}
 ${card("CBT history",state.data.tests.map(t=>`<div class="row"><span>${t.name}</span><b>${t.score}</b><small>${t.acc}%</small></div>`).join(""))}
 ${card("Time-management lab",`<div class="bigmetric"><b>2m 41s</b><span>average / question</span></div><p class="muted">18% of test time went to questions eventually left unattempted.</p>`)}</div>`;
}
function focus(){
 return `<div class="focuswrap"><div class="timer"><small>FOCUS SESSION</small><strong id="timer">50:00</strong><span>Physics • Kinematics</span><div><button class="primary" onclick="timerStart()">Start</button><button class="secondary" onclick="timerReset()">Reset</button></div></div><div class="focusmodes">${["25/5","50/10","90/15","Custom"].map((x,i)=>`<button class="${i===1?"chosen":""}" onclick="toast('${x} mode')">${x}</button>`).join("")}</div></div>
 <div class="grid3">${card("Allowed study apps",`<p class="muted">Website focus mode cannot technically block Android apps. It can provide fullscreen focus, session tracking and notifications.</p><button class="secondary" onclick="toast('Fullscreen focus enabled')">Enter fullscreen</button>`)}
 ${card("Focus history",`<div class="bigmetric"><b>18</b><span>sessions this week</span></div><p>Longest: 1h 32m • Average: 46m</p>`)}
 ${card("Daily Boss Battle",`<b>15 questions • 20 minutes</b><p class="muted">Target 80% accuracy.</p><button class="primary" onclick="startCBT()">Fight boss</button>`)}</div>`;
}
function analytics(){
 return `<div class="grid3">${card("Study quality",`<div class="score">87</div><p class="muted">Hours + questions + accuracy + revision consistency.</p>`)}
 ${card("Personal bests",["6h 48m — best day","1,240 — best week questions","91% — best accuracy","178 — highest mock score","21 days — longest streak"].map(x=>`<div class="row"><span>${x}</span><b>PB</b></div>`).join(""))}
 ${card("Score trend",`<div class="spark">${[118,132,147,139,156].map((x,i)=>`<i style="height:${x/2}px" title="${x}"></i>`).join("")}</div><small>Mock scores: 118 → 132 → 147 → 139 → 156</small>`)}</div>
 <div class="grid2">${card("Subject distribution",`<div class="donut" style="--p:${state.data.subjects[0][1]}%"></div><div class="legend">${state.data.subjects.map(s=>`<span>● ${s[0]} ${s[1]}%</span>`).join("")}</div>`)}
 ${card("Study-type distribution",["Lecture 28%","Questions 42%","Revision 12%","DPP 8%","PYQ 7%","Tests 3%"].map(x=>`<div class="row"><span>${x}</span></div>`).join(""))}</div>
 ${card("Trend analysis",`<div class="bars">${[42,55,48,70,64,82,78,91,86,96,88,100,94,108].map((x,i)=>`<i style="height:${x/2}px"></i>`).join("")}</div><p class="muted">Best day: Sunday • Most productive: 9 PM–12 AM • Weekly target: 30h</p>`)}`;
}
function revision(){
 return `<div class="grid3">${card("Due today",`<div class="bigmetric"><b>7</b><span>revision items</span></div><button class="primary" onclick="toast('Revision queue started')">Start queue</button>`)}
 ${card("Revision engine",["NLM — Friction","Chemical Bonding — MOT","Quadratic — Roots","Kinematics — Projectile","Sequences — AP/GP"].map((x,i)=>`<div class="row"><span>${x}</span><b>${["Urgent","Due","Due","Upcoming","Upcoming"][i]}</b></div>`).join(""))}
 ${card("Confidence",["😵 Don't know","😐 Weak","🙂 Okay","🔥 Strong"].map(x=>`<span class="tag">${x}</span>`).join(" "))}</div>
 ${card("Spaced revision calendar",["Revision 1","Revision 2","Revision 3","Revision 4"].map((x,i)=>`<div class="timeline"><b>${x}</b><span>${["Today","+2 days","+7 days","+21 days"][i]}</span></div>`).join(""))}`;
}
function errorbook(){
 return `<div class="toolbar"><button class="primary" onclick="toast('Mistake added')">＋ Add mistake</button><button class="secondary" onclick="toast('Retry set created')">🔄 Retry mistakes</button></div><div class="grid2">${card("Repeated mistakes",[
 ["NLM","Sign convention","Concept"],["Chemical Bonding","Hybridisation","Concept"],["Quadratic","Calculation slip","Silly"],["Kinematics","Graph interpretation","Concept"]
 ].map(x=>`<div class="mistake"><span class="dot"></span><div><b>${x[0]} — ${x[1]}</b><small>${x[2]} • reattempt due tomorrow</small></div></div>`).join(""))}
 ${card("Explain my mistake",`<p>Select a saved question and get: what you assumed → where it failed → correct concept → similar trap → one follow-up question.</p><button class="primary" onclick="toast('AI explanation requested')">Explain selected mistake</button>`)}</div>`;
}
function friends(){
 return `<div class="toolbar"><input id="friendSearch" placeholder="Search username…"><button class="primary" onclick="toast('Friend request sent')">＋ Send request</button></div><div class="grid3">${state.data.friends.map(f=>card(`<span class="avatar">${f[0][0]}</span> ${f[0]}`,`<div class="row"><span>Study</span><b>${f[1]}</b></div><div class="row"><span>Questions</span><b>${f[2]}</b></div><div class="row"><span>Accuracy</span><b>${f[3]}</b></div><button class="secondary" onclick="toast('Profile opened')">View progress</button>`)).join("")}</div>
 <div class="grid2">${card("Friend requests",`<div class="row"><span>Neha • @neha_jee</span><div><button class="link" onclick="toast('Accepted')">Accept</button> <button class="link" onclick="toast('Rejected')">Reject</button></div></div>`)}
 ${card("Team challenge",`<b>3-Day Winter Arc Challenge</b><div class="bar"><i style="width:66%"></i></div><p>15.8 / 24 team hours</p><button class="primary" onclick="toast('Challenge joined')">Join challenge</button>`)}</div>
 <p class="privacy">Friends can see only the fields you choose. Error Book, notes and doubts are private by default.</p>`;
}
function calendar(){
 const cells=Array.from({length:84},(_,i)=>`<i class="heat h${(i*7+3)%5}" title="${i} days ago"></i>`).join("");
 return `<div class="heatmap">${cells}</div><div class="grid2">${card("Day details",`<div class="bigmetric"><b>4h 48m</b><span>today</span></div><div class="row"><span>Questions</span><b>186</b></div><div class="row"><span>Revision</span><b>2</b></div><div class="row"><span>Focus</span><b>4 sessions</b></div>`)}
 ${card("JEE countdown",`<div class="bigmetric"><b id="countdown2">—</b><span>days remaining</span></div><p class="muted">Fallback target: 20 January ${state.selectedYear}. Switch to official NTA date when configured.</p>`)}</div>`;
}
function rewards(){
 const ach=["First 100 questions","7-day streak","10-hour week","First mock","500 questions","30-day consistency","Backlog cleared","Personal best","10 focus sessions"];
 return `<div class="grid3">${card("Level",`<div class="levelcircle">${state.data.level}</div><div class="bar"><i style="width:72%"></i></div><p>2,480 / 3,400 XP</p>`)}
 ${card("Achievements",ach.map((x,i)=>`<div class="achievement ${i<5?"unlocked":""}"><span>${i<5?"✓":"◇"}</span><b>${x}</b></div>`).join(""))}
 ${card("Reward vault",["❄ Winter theme","⚡ Neon profile frame","🏆 Consistency badge","🌌 Aurora background"].map(x=>`<div class="row"><span>${x}</span><button class="link" onclick="toast('Reward preview')">Preview</button></div>`).join(""))}</div>
 ${card("Congratulations engine",`<div class="congrats">🔥 7-day streak! You showed up when motivation wasn't enough.</div><p class="muted">Messages rotate across milestones instead of repeating the same line.</p>`)}`;
}
function profile(){
 return `<div class="profilehero"><span class="avatar xl">DP</span><div><h2>${esc(state.profile?.display_name||"Dhairya Parode")}</h2><p>@${esc(state.profile?.username||"dhairya_jee")} • Class 11 • JEE Main + Advanced</p></div></div>
 <div class="grid3">${card("JEE target",`<b>JEE ${state.selectedYear}</b><p class="muted">Countdown always stays active; official date can replace fallback.</p>`)}
 ${card("Personal stats",`<div class="row"><span>Streak</span><b>${state.data.streak}d</b></div><div class="row"><span>Level</span><b>${state.data.level}</b></div><div class="row"><span>XP</span><b>${state.data.xp}</b></div>`)}
 ${card("Privacy",`<p class="muted">Control what friends see.</p><button class="secondary" onclick="go('settings')">Privacy settings</button>`)}</div>`;
}
function settings(){
 return `<div class="grid2">${card("Account",`<button class="primary" onclick="openLogin()">Continue with Google</button><p class="muted">Username is required during onboarding and must be unique.</p>`)}
 ${card("Friend visibility",["Study hours","Questions","Streak","Tests","Accuracy","Achievements","Activity"].map((x,i)=>`<label class="switchrow"><span>${x}</span><input type="checkbox" ${i<6?"checked":""}></label>`).join(""))}</div>
 ${card("Cloud status",`<p>${supabase?"🟢 Supabase connected":"🟡 Demo mode — add Supabase config for cloud storage"}</p><p class="muted">The production architecture uses PostgreSQL as the source of truth. Browser storage is not the primary database.</p>`)}`;
}
function render(){ $("#app").innerHTML=shell(); bind(); countdown(); }
function bind(){document.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>go(b.dataset.page));}
function go(p){state.page=p;render();window.scrollTo(0,0);}
function toast(t){let e=document.createElement("div");e.className="toast";e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),2200);}
function toggleTask(i){state.data.tasks[i][4]=!state.data.tasks[i][4];toast(state.data.tasks[i][4]?"Task completed + XP":"Task reopened");render();}
function addTask(){const t=prompt("Task name");if(t){state.data.tasks.unshift([t,"General","Today","medium",false]);render();}}
function startCBT(){document.querySelector("#cbtbox")?.scrollIntoView({behavior:"smooth"});toast("CBT ready — connect your question bank to start live questions");}
let interval=null,seconds=3000;
function timerStart(){if(interval)return;interval=setInterval(()=>{seconds--;if(seconds<0){clearInterval(interval);interval=null;seconds=3000;toast("Focus session complete + XP");}updateTimer()},1000);toast("Focus started");}
function timerReset(){clearInterval(interval);interval=null;seconds=3000;updateTimer();}
function updateTimer(){let m=Math.floor(seconds/60),s=seconds%60;let e=$("#timer");if(e)e.textContent=`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;}
function countdown(){let target=new Date(`${state.selectedYear}-01-20T09:00:00`),d=Math.max(0,Math.ceil((target-new Date())/86400000));document.querySelectorAll("#countdown,#countdown2").forEach(e=>e.textContent=d+"d");}
function openLogin(){document.body.insertAdjacentHTML("beforeend",`<div class="modal" id="login"><div class="modalbox"><button class="close" onclick="$('#login').remove()">×</button><span class="eyebrow">ACCOUNT</span><h2>Enter Winter Arc OS</h2><p class="muted">Use Google or create a username.</p><button class="google" onclick="googleLogin()">G Continue with Google</button><div class="or">or</div><input id="username" placeholder="Choose username"><input id="displayname" placeholder="Display name"><button class="primary wide" onclick="saveDemoProfile()">Continue</button><small>In production, Google OAuth and username uniqueness are enforced by Supabase.</small></div></div>`);}
async function googleLogin(){if(!supabase){toast("Demo mode: add Supabase config for Google login");return;}const {error}=await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:location.origin}});if(error)toast(error.message);}
function saveDemoProfile(){let u=$("#username")?.value.trim()||"demo_user";let d=$("#displayname")?.value.trim()||"JEE Aspirant";state.profile={username:u,display_name:d};$("#login")?.remove();toast("Profile saved");render();}
async function hydrate(){if(!supabase)return;const {data:{session}}=await supabase.auth.getSession();if(session){state.demo=false;state.user=session.user;const {data}=await supabase.from("profiles").select("*").eq("id",session.user.id).maybeSingle();if(data)state.profile=data;}}
window.go=go;window.toast=toast;window.toggleTask=toggleTask;window.addTask=addTask;window.startCBT=startCBT;window.timerStart=timerStart;window.timerReset=timerReset;window.openLogin=openLogin;window.googleLogin=googleLogin;window.saveDemoProfile=saveDemoProfile;
hydrate().then(render);