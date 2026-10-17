const defaultParticipants = [
  {last:"Dittert", first:"Sebastian", kst:"13701"},
  {last:"Hachenberg", first:"Marcel", kst:"13701"},
  {last:"Schiffner", first:"Pierre", kst:"50212"},
  {last:"Treichel", first:"Viktor", kst:"50212"},
  {last:"Schmidt", first:"Steffen", kst:"25901"},
  {last:"Caltepe", first:"Yusuf", kst:"25901"},
  {last:"Warkentin", first:"Kevin", kst:"4140002611"},
  {last:"Birinci", first:"Enez", kst:"25702"},
  {last:"Bavtijari", first:"Nebi", kst:"25702"},
  {last:"Przystarz", first:"Krystian", kst:"25705"}
];
const participants = (() => {
  try {
    const saved = JSON.parse(localStorage.getItem("attendance-participants") || "null");
    return Array.isArray(saved) && saved.length ? saved : defaultParticipants.map(p=>({...p}));
  } catch { return defaultParticipants.map(p=>({...p})); }
})();
// Erstimport der historischen Listen. ? = noch manuell zu prüfen; zählt NICHT als Anwesenheit.
const historicalSeed = {
 '2025-04':[2,5,23,26,28], '2025-06':[11,14,16,18,28], '2025-07':[2], '2025-08':[20,23,25,30],
 '2025-11':[1,3,5,8,10,12,15,17,19,24,29], '2025-12':[1,3,6,8,10,13,15,20],
 '2026-01':[12,14,17,19,21,24,26,28,31], '2026-02':[2,4,7,9,11,14,16,18,21,23,25],
 '2026-03':[2,4,9,11,14,18,21,23,25,28], '2026-04':[15],
 '2026-05':[4,6,9,11,13,18,20,27,30], '2026-06':[1,3,8,10,13,15,17,20,22,24],
 '2026-08':[8,10,12,15,17,19,22,24,26,29,31],
 '2026-09':[2,5,7,9,14,16,19,21,23,26,28,30]
};
// Gut lesbare Einträge aus den Originalfotos Januar bis April 2026.
// Ein Slash bleibt Abwesenheit; leere/unklare Felder werden mit ? zur Prüfung markiert.
const transcribed = {
 '2026-01': [
  ['/', 'SD','SD','SD','SD','SD','/','/','SD'],
  ['MH','MH','MH','MH','MH','MH','MH','MH','MH'],
  ['PS','/','PS','PS','PS','PS','PS','PS','PS'],
  ['VT','VT','VT','VT','VT','VT','VT','VT','/'],
  ['STS','STS','STS','STS','STS','STS','STS','STS','STS'],
  ['YC','YC','/','YC','/','YC','YC','/','YC'],
  ['KW','KW','KW','KW','KW','KW','KW','KW','KW'],
  ['EB','EB','EB','EB','EB','EB','EB','EB','EB'],
  ['NB','NB','NB','/','NB','NB','NB','NB','NB'],
  ['KP','KP','KP','KP','KP','KP','KP','KP','KP']
 ],
 '2026-02': [
  ['SD','/','SD','SD','SD','SD','/','SD','SD','/','SD'],
  ['MH','/','MH','MH','/','MH','MH','MH','/','MH','MH'],
  ['PS','/','PS','PS','PS','PS','PS','PS','PS','PS','PS'],
  ['VT','VT','VT','VT','/','VT','VT','VT','VT','/','VT'],
  ['STS','STS','STS','STS','STS','STS','STS','STS','STS','STS','STS'],
  ['YC','YC','YC','YC','YC','YC','YC','YC','YC','YC','YC'],
  ['KW','KW','KW','KW','KW','KW','/','KW','KW','KW','KW'],
  ['EB','EB','EB','EB','EB','EB','EB','EB','EB','EB','?'],
  ['NB','/','NB','NB','NB','NB','NB','NB','NB','NB','?'],
  ['KP','KP','KP','/','KP','KP','KP','/','KP','KP','KP']
 ],
 '2026-03': [
  ['SD','SD','/','SD','SD','SD','SD','SD','SD','SD'],
  ['MH','MH','MH','MH','MH','MH','/','MH','MH','MH'],
  ['PS','PS','PS','/','PS','PS','/','PS','PS','PS'],
  ['VT','VT','VT','VT','VT','VT','VT','VT','VT','VT'],
  ['STS','STS','STS','STS','/','STS','STS','STS','STS','STS'],
  ['YC','YC','YC','YC','YC','YC','YC','YC','YC','YC'],
  ['KW','KW','KW','KW','KW','KW','KW','KW','KW','KW'],
  ['EB','EB','EB','EB','EB','EB','EB','EB','EB','EB'],
  ['NB','NB','NB','NB','NB','NB','NB','NB','NB','NB'],
  ['KP','KP','KP','KP','KP','/','KP','KP','KP','KP']
 ],
 '2026-04': [['SD'],['MH'],['PS'],['VT'],['STS'],['YC'],['KW'],['EB'],['NB'],['KP']]
};
function installHistoricalSeed(){
  // Neue historische Monate separat ergänzen, ohne bereits gespeicherte Monate/Änderungen zu überschreiben.
  if(!localStorage.getItem('attendance:2026-09')) {
    const month='2026-09';
    const dayNums=historicalSeed[month];
    const dates=dayNums.map(d=>`${month}-${String(d).padStart(2,'0')}`);
    const rows=[
      ['/','SD','SD','SD','/','SD','SD','SD','SD','/','/','?'],
      ['MH','MH','/','MH','MH','MH','MH','MH','MH','MH','/','?'],
      ['PS','PS','PS','PS','PS','PS','?','PS','/','PS','?','?'],
      ['VT','VT','/','/','VT','VT','VT','VT','VT','VT','VT','?'],
      ['STS','/','STS','STS','STS','/','STS','STS','STS','STS','STS','STS'],
      ['YC','YC','/','YC','YC','YC','YC','YC','YC','YC','YC','YC'],
      ['KW','KW','KW','KW','KW','KW','KW','KW','KW','KW','KW','KW'],
      ['EB','EB','/','/','/','EB','EB','EB','EB','EB','EB','EB'],
      ['NB','/','/','/','NB','NB','NB','NB','/','NB','/','NB'],
      ['/','/','/','/','KP','KP','KP','KP','KP','KP','KP','/']
    ];
    const attendance={}; dates.forEach((d,j)=>{attendance[d]={}; rows.forEach((r,i)=>attendance[d][i]=r[j]||'?');});
    localStorage.setItem('attendance:'+month,JSON.stringify({dates,attendance,source:'September 2026 vom Foto übertragen; ? = prüfen, bitte Handschrift kontrollieren'}));
  }
  if(localStorage.getItem('attendance-historical-seed-v1')) return;
  Object.entries(historicalSeed).forEach(([month,dayNums])=>{
    const dates=dayNums.map(d=>`${month}-${String(d).padStart(2,'0')}`);
    const attendance={};
    dates.forEach(d=>{attendance[d]={}; for(let i=0;i<defaultParticipants.length;i++) attendance[d][i]='?';});
    const rows=transcribed[month];
    if(rows) rows.forEach((vals,i)=>vals.forEach((v,j)=>{if(dates[j]) attendance[dates[j]][i]=v;}));
    localStorage.setItem('attendance:'+month,JSON.stringify({dates,attendance,source:'historische Liste; ? = prüfen'}));
  });
  localStorage.setItem('attendance-historical-seed-v1','done');
}

const $ = id => document.getElementById(id);
function saveParticipants(){ localStorage.setItem("attendance-participants", JSON.stringify(participants)); }
const now = new Date();
const monthInput = $("month");
monthInput.value = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
let dates = [];
let attendance = {};
let hourSettings = {totalHours:1000, requiredPercent:70, weekdayHours:4, saturdayHours:6};


function monthKey(){return monthInput.value || `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;}
function loadMonth(){
  const saved = JSON.parse(localStorage.getItem("attendance:"+monthKey()) || "{}");
  dates = saved.dates || [];
  attendance = saved.attendance || {};
  render();
  renderOverview();
  renderArchiveList();
}
function saveMonth(){localStorage.setItem("attendance:"+monthKey(),JSON.stringify({dates,attendance}));}
function showStatus(message,error=false,ok=false){const el=$("status");el.textContent=message;el.className="status"+(error?" error":ok?" ok":"");}
function saveHourSettings(){
  hourSettings = {
    totalHours: Math.max(1, Number($("totalHours").value)||1000),
    requiredPercent: Math.min(100,Math.max(0,Number($("requiredPercent").value)||0)),
    weekdayHours: Math.max(0,Number($("weekdayHours").value)||0),
    saturdayHours: Math.max(0,Number($("saturdayHours").value)||0)
  };
  localStorage.setItem("attendance-hour-settings", JSON.stringify(hourSettings));
  renderOverview();
}
function dayHours(date){
  const day = new Date(date+"T12:00:00").getDay(); // 0=Sun, 6=Sat
  if(day===0) return 0;
  return day===6 ? hourSettings.saturdayHours : hourSettings.weekdayHours;
}
function isPresent(value){
  const v=(value||"").trim();
  return v!=="" && v!=="?" && v!=="/" && v!=="—" && v!=="-" && !["E","K","U"].includes(v.toUpperCase());
}
function ensureReviewOptions(){
  const select=$("reviewParticipant");
  if(!select) return;
  const current=select.value;
  select.innerHTML="";
  participants.forEach((p,i)=>{
    const option=document.createElement("option");
    option.value=String(i);
    option.textContent=`${i+1}. ${p.first} ${p.last}`;
    select.appendChild(option);
  });
  if(current && Number(current)<participants.length) select.value=current;
}
function renderDayReview(){
  const select=$("reviewParticipant");
  const body=$("dayReviewBody");
  if(!select || !body) return;
  const index=Number(select.value||0);
  const p=participants[index];
  body.innerHTML="";
  dates.forEach(date=>{
    const tr=document.createElement("tr");
    const d=new Date(date+"T12:00:00");
    const weekday=d.toLocaleDateString("de-DE",{weekday:"long"});
    const hours=dayHours(date);
    const tdDate=document.createElement("td");tdDate.textContent=d.toLocaleDateString("de-DE");tr.appendChild(tdDate);
    const tdDay=document.createElement("td");tdDay.textContent=weekday;tr.appendChild(tdDay);
    const tdHours=document.createElement("td");tdHours.textContent=`${hours} Std.`;tr.appendChild(tdHours);
    const tdStatus=document.createElement("td");
    const status=document.createElement("select");
    status.className="attendance-status";
    [["","Nicht eingetragen / abwesend"],["X","Anwesend"],["/","Abwesend"],["E","Entschuldigt"],["K","Krank"],["U","Unentschuldigt"]].forEach(([value,label])=>{
      const option=document.createElement("option");option.value=value;option.textContent=label;status.appendChild(option);
    });
    const current=(attendance[date]||{})[index]||"";
    status.value=isPresent(current)?"X":current==="/"?"/":["E","K","U"].includes(current)?current:"";
    status.addEventListener("change",()=>{
      attendance[date]=attendance[date]||{};
      attendance[date][index]=status.value;
      saveMonth();
      renderOverview();
      renderDayReview();
      showStatus("Anwesenheit geändert und gespeichert.",false,true);
    });
    tdStatus.appendChild(status);tr.appendChild(tdStatus);
    body.appendChild(tr);
  });
}
function getSavedMonths(){
  const keys=[];
  for(let i=0;i<localStorage.length;i++){
    const key=localStorage.key(i);
    if(key && key.startsWith("attendance:") && /^attendance:\d{4}-\d{2}$/.test(key)) keys.push(key);
  }
  return keys.sort().map(key=>{
    try { return {month:key.slice("attendance:".length), data:JSON.parse(localStorage.getItem(key)||"{}")}; }
    catch { return {month:key.slice("attendance:".length),data:{dates:[],attendance:{}}}; }
  });
}
function monthLabelForKey(key){const [y,m]=key.split("-").map(Number);return new Date(y,m-1,1).toLocaleDateString("de-DE",{month:"long",year:"numeric"});}
function renderPersonTabs(){
  const box=$("personTabs"); if(!box) return;
  const current=Number($("reviewParticipant")?.value||0);
  box.innerHTML="";
  participants.forEach((p,i)=>{
    const b=document.createElement("button"); b.type="button"; b.className="person-tab"+(i===current?" active":"");
    b.setAttribute("role","tab"); b.setAttribute("aria-selected",String(i===current));
    b.textContent=`${p.first} ${p.last}`;
    b.addEventListener("click",()=>{$("reviewParticipant").value=String(i);renderOverview();});
    box.appendChild(b);
  });
}
function renderPersonMonthTable(index){
  const body=$("personMonthBody"); if(!body) return;
  body.innerHTML="";
  const months=getSavedMonths();
  let allPresentDays=0,allDays=0,allPresentHours=0,allScheduledHours=0;
  months.forEach(({month,data})=>{
    const monthDates=(data.dates||[]).slice().sort();
    let presentDays=0,scheduledHours=0,presentHours=0;
    monthDates.forEach(d=>{
      const h=dayHours(d); scheduledHours+=h;
      if(isPresent(((data.attendance||{})[d]||{})[index])) { presentDays++; presentHours+=h; }
    });
    allPresentDays+=presentDays; allDays+=monthDates.length; allPresentHours+=presentHours; allScheduledHours+=scheduledHours;
    const tr=document.createElement("tr");
    const vals=[monthLabelForKey(month),`${presentDays}`,`${monthDates.length}`,`${monthDates.length?(presentDays/monthDates.length*100).toLocaleString("de-DE",{maximumFractionDigits:1}):"0,0"} %`,`${presentHours.toLocaleString("de-DE",{maximumFractionDigits:1})} Std.`];
    vals.forEach(v=>{const td=document.createElement("td");td.textContent=v;tr.appendChild(td);}); body.appendChild(tr);
  });
  const tr=document.createElement("tr");tr.className="total-row";
  const pct=allDays?allPresentDays/allDays*100:0;
  const vals=["GESAMT",`${allPresentDays}`,`${allDays}`,`${pct.toLocaleString("de-DE",{maximumFractionDigits:1})} %`,`${allPresentHours.toLocaleString("de-DE",{maximumFractionDigits:1})} Std.`];
  vals.forEach(v=>{const td=document.createElement("td");td.textContent=v;tr.appendChild(td);});body.appendChild(tr);
}
function renderOverview(){
  const body=$("overviewBody");
  if(!body) return;
  ensureReviewOptions();
  renderPersonTabs();
  body.innerHTML="";
  const total=hourSettings.totalHours;
  const useCourseTotal=true;
  const goal=total*hourSettings.requiredPercent/100;
  participants.forEach((p,i)=>{
    let present=0, scheduled=0;
    dates.forEach(date=>{
      const h=dayHours(date);
      scheduled+=h;
      if(isPresent((attendance[date]||{})[i])) present+=h;
    });
    const percent=scheduled>0 ? present/scheduled*100 : 0;
    const coursePercent=useCourseTotal ? present/total*100 : percent;
    const remaining=Math.max(0,goal-present);
    const tr=document.createElement("tr");
    const values=[
      `${p.last}, ${p.first}`,
      `${present.toLocaleString("de-DE",{maximumFractionDigits:1})} Std.`,
      `${scheduled.toLocaleString("de-DE",{maximumFractionDigits:1})} Std.`,
      `${percent.toLocaleString("de-DE",{maximumFractionDigits:1})} %`,
      `${coursePercent.toLocaleString("de-DE",{maximumFractionDigits:1})} %`,
      remaining===0 ? "Ziel erreicht" : `${remaining.toLocaleString("de-DE",{maximumFractionDigits:1})} Std. fehlen`
    ];
    values.forEach((value,j)=>{const td=document.createElement("td");td.textContent=value;if(j===4){td.className=coursePercent>=hourSettings.requiredPercent?"good":"needs-work";}if(j===5){td.className=remaining===0?"good":"needs-work";}tr.appendChild(td);});
    body.appendChild(tr);
  });
  const selected=Number($("reviewParticipant")?.value||0);
  let selectedPresent=0, selectedScheduled=0;
  dates.forEach(date=>{const h=dayHours(date);selectedScheduled+=h;if(isPresent((attendance[date]||{})[selected]))selectedPresent+=h;});
  const selectedPct=total>0?selectedPresent/total*100:0;
  const target=total*hourSettings.requiredPercent/100;
  const remaining=Math.max(0,target-selectedPresent);
  const months=getSavedMonths();
  let allPresentDays=0,allDays=0,allPresentHours=0,allScheduledHours=0;
  months.forEach(({data})=>{
    (data.dates||[]).forEach(d=>{allDays++;const h=dayHours(d);allScheduledHours+=h;if(isPresent(((data.attendance||{})[d]||{})[selected])){allPresentDays++;allPresentHours+=h;}});
  });
  const allPct=useCourseTotal ? (total>0?allPresentHours/total*100:0) : (allScheduledHours>0?allPresentHours/allScheduledHours*100:0);
  $("reviewSummary").innerHTML=`<strong>${participants[selected].first} ${participants[selected].last}</strong><span>Aktueller Monat: ${selectedPresent.toLocaleString("de-DE")} Std. anwesend</span><span class="review-percent">Gesamtquote: ${allPct.toLocaleString("de-DE",{maximumFractionDigits:1})}% (${useCourseTotal ? `${allPresentHours.toLocaleString("de-DE",{maximumFractionDigits:1})} von ${total} Std.` : `${allPresentHours.toLocaleString("de-DE",{maximumFractionDigits:1})} von ${allScheduledHours.toLocaleString("de-DE",{maximumFractionDigits:1})} bisher erfassten Soll-Std.`})</span><span>Anwesend: ${allPresentHours.toLocaleString("de-DE",{maximumFractionDigits:1})} Std.</span><span>Unterricht bisher: ${allScheduledHours.toLocaleString("de-DE",{maximumFractionDigits:1})} Std.</span><span>${useCourseTotal ? `${remaining.toLocaleString("de-DE",{maximumFractionDigits:1})} Std. bis zur Kurszielmarke (bezogen auf ${total} Kursstunden)` : "Prozentwert bezieht sich nur auf bisher erfasste Unterrichtsstunden."}</span>`;
  renderPersonMonthTable(selected);
  renderDayReview();
}
function render(){
  const head=$("tableHead");
  head.innerHTML='<th>Nr.</th><th>Nachname</th><th>Vorname</th><th>KST.</th>';
  dates.forEach((date,index)=>{
    const th=document.createElement("th");th.className="date-head";
    const label=document.createElement("span");label.textContent=new Date(date+"T12:00:00").getDate()+".";
    const del=document.createElement("button");del.className="remove-date";del.textContent="entfernen";del.title="Unterrichtstag entfernen";
    del.addEventListener("click",()=>{dates.splice(index,1);saveMonth();render();});
    th.append(label,del);head.appendChild(th);
  });
  const body=$("tableBody");body.innerHTML="";
  participants.forEach((person,i)=>{
    const tr=document.createElement("tr");
    const num=document.createElement("td");num.textContent=String(i+1);tr.appendChild(num);
    [["last","name"],["first","name"],["kst","kst"]].forEach(([field,cls])=>{
      const td=document.createElement("td");td.className=cls;
      const input=document.createElement("input");input.value=person[field];input.setAttribute("aria-label",`${field} Teilnehmer ${i+1}`);
      input.addEventListener("change",()=>{person[field]=input.value.trim();saveParticipants();renderOverview();showStatus("Teilnehmerdaten gespeichert.",false,true);});
      td.appendChild(input);tr.appendChild(td);
    });
    dates.forEach(date=>{
      const td=document.createElement("td");
      td.className="attendance-cell";
      const input=document.createElement("input");input.maxLength=12;input.placeholder="—";
      input.value=(attendance[date]||{})[i]||"";
      td.classList.toggle("has-entry",isPresent(input.value));
      td.classList.toggle("is-uncertain",input.value.trim()==="?");
      input.setAttribute("aria-label",`${person.first} ${person.last}, ${date}`);
      input.title="Feld anklicken, um das Kürzel automatisch einzutragen; danach bei Bedarf bearbeiten";
      input.addEventListener("click",()=>{
        if(!input.value.trim()){
          const initials=["SD","MH","PS","VT","STS","YC","KW","EB","NB","KP"][i] || (person.first[0]+person.last[0]).toUpperCase();
          input.value=initials;
          attendance[date]=attendance[date]||{};attendance[date][i]=initials;
          td.classList.add("has-entry");
          td.classList.remove("is-uncertain");
          saveMonth();renderOverview();
        }
      });
      input.addEventListener("change",()=>{
        attendance[date]=attendance[date]||{};
        attendance[date][i]=input.value.trim();
        td.classList.toggle("has-entry",isPresent(input.value));
        td.classList.toggle("is-uncertain",input.value.trim()==="?");
        saveMonth();renderOverview();
        showStatus("Tagesfeld aktualisiert und gespeichert.",false,true);
      });
      td.appendChild(input);tr.appendChild(td);
    });
    body.appendChild(tr);
  });
  saveMonth();
  renderOverview();
}
function addDate(value){
  const date=value || $("newDate").value;
  if(!date){showStatus("Bitte zuerst ein Datum auswählen.",true);return;}
  if(date.slice(0,7)!==monthKey()){showStatus("Das Datum liegt nicht im ausgewählten Monat.",true);return;}
  if(dates.includes(date)){showStatus("Dieser Unterrichtstag ist bereits eingetragen.",true);return;}
  dates.push(date);dates.sort();$("newDate").value="";saveMonth();render();showStatus("Unterrichtstag hinzugefügt.",false,true);
}
function monthLabel(){const [y,m]=monthKey().split("-").map(Number);return new Date(y,m-1,1).toLocaleDateString("de-DE",{month:"long",year:"numeric"});}
function createPdf(){
  if(!window.jspdf || !window.jspdf.jsPDF) throw new Error("PDF-Bibliothek konnte nicht geladen werden. Bitte Internetverbindung prüfen.");
  [...$("tableBody").rows].forEach((row,i)=>{participants[i].last=row.cells[1].querySelector("input").value;participants[i].first=row.cells[2].querySelector("input").value;participants[i].kst=row.cells[3].querySelector("input").value;});
  saveParticipants();
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF({orientation:"landscape",unit:"mm",format:"a4"});
  // Originalähnliche Vorlage: Monat/Jahr oben, Teilnehmer links, Datumsfelder rechts.
  doc.setFont("helvetica","bold");doc.setFontSize(13);
  doc.text("Anwesenheitsliste",doc.internal.pageSize.getWidth()-14,12,{align:"right"});
  doc.setFontSize(11);
  doc.text("Meisterkurs Kunststoff/Kautschuk",doc.internal.pageSize.getWidth()-14,18,{align:"right"});
  doc.setFont("helvetica","normal");doc.setFontSize(9);
  const maxDateCols=18;
  const visibleDates=dates.slice(0,maxDateCols);
  const emptyCols=Math.max(0,Math.min(6,maxDateCols-visibleDates.length));
  const dateHeaders=[...visibleDates.map(d=>String(new Date(d+"T12:00:00").getDate())),...Array(emptyCols).fill("")];
  const head=[["Lfd. Nr.","Name","Vorname","KST.",...Array(dateHeaders.length).fill("")]];
  const body=participants.map((p,i)=>[String(i+1),p.last,p.first,p.kst,...visibleDates.map(d=>(attendance[d]||{})[i]||""),...Array(emptyCols).fill("")]);
  const pageW=doc.internal.pageSize.getWidth();
  const dateCount=dateHeaders.length;
  const fixedWidths={0:11,1:39,2:39,3:22};
  const fixedTotal=Object.values(fixedWidths).reduce((a,b)=>a+b,0);
  const dateWidth=(pageW-20-fixedTotal)/Math.max(1,dateCount);
  const columnStyles={0:{cellWidth:fixedWidths[0]},1:{cellWidth:fixedWidths[1],halign:"left"},2:{cellWidth:fixedWidths[2],halign:"left"},3:{cellWidth:fixedWidths[3]}};
  for(let c=4;c<4+dateCount;c++) columnStyles[c]={cellWidth:dateWidth};
  // Kopfzeile mit Kästchen: Monat/Jahr links und jedes Datum direkt darüber in einer eigenen Spalte.
  const boxY=25, boxH=10, leftX=10, dateStartX=leftX+fixedTotal;
  doc.setDrawColor(75,85,95); doc.setLineWidth(.22);
  doc.rect(leftX,boxY,fixedTotal,boxH);
  doc.setFont("helvetica","bold");doc.setFontSize(9);
  doc.text(`Monat/Jahr: ${monthLabel()}`,leftX+3,boxY+6.2);
  doc.setFont("helvetica","normal");doc.setFontSize(8);
  doc.text("Teilnehmer Continental Korbach",leftX+3,boxY+9.2);
  let xDate=dateStartX;
  dateHeaders.forEach((day)=>{
    doc.rect(xDate,boxY,dateWidth,boxH);
    if(day){
      doc.setFont("helvetica","bold");doc.setFontSize(9);
      doc.text(day, xDate + dateWidth/2, boxY+6.2, {align:"center"});
    }
    xDate += dateWidth;
  });
  doc.autoTable({head,body,startY:boxY+boxH,theme:"grid",styles:{font:"helvetica",fontSize:8,cellPadding:2.2,minCellHeight:8,halign:"center",valign:"middle",lineColor:[75,85,95],lineWidth:.22,textColor:[25,25,25]},headStyles:{fillColor:[255,255,255],textColor:[25,25,25],fontStyle:"bold",lineColor:[75,85,95]},columnStyles,margin:{left:10,right:10},tableWidth:pageW-20});
  const y=doc.lastAutoTable.finalY+8;
  doc.setFontSize(8);doc.text("Der Teilnehmer bestätigt seine Anwesenheit mit seinem Namenskürzel.",10,Math.min(y,195));
  return doc;
}
function renderArchiveList(){
  const el=$("archiveList"); if(!el) return;
  const months=getSavedMonths();
  el.innerHTML="<strong>Abgelegte Monatslisten</strong>";
  if(!months.length){el.innerHTML+="<p class=\"muted small\">Noch keine Monate gespeichert.</p>";return;}
  const list=document.createElement("div");list.className="archive-items";
  months.forEach(({month,data})=>{
    const row=document.createElement("div");row.className="archive-item";
    const label=document.createElement("span");label.textContent=monthLabelForKey(month)+` · ${(data.dates||[]).length} Unterrichtstage`;
    const btn=document.createElement("button");btn.type="button";btn.className="button secondary";btn.textContent="Öffnen";
    btn.addEventListener("click",()=>{$("month").value=month;loadMonth();showMainView(false);window.scrollTo({top:0,behavior:"smooth"});});
    row.append(label,btn);list.appendChild(row);
  });
  el.appendChild(list);
}
$("archiveMonth")?.addEventListener("click",()=>{
  saveMonth();
  const archived=JSON.parse(localStorage.getItem("attendance-archived-months")||"[]");
  const key=monthKey();
  if(!archived.includes(key)) archived.push(key);
  localStorage.setItem("attendance-archived-months",JSON.stringify(archived));
  renderArchiveList();
  showStatus(`${monthLabel()} wurde gespeichert und in der Monatsablage abgelegt.`,false,true);
});

function pdfFileName(){return "Anwesenheit_"+monthKey()+".pdf";}
function pdfBase64(doc){return doc.output("datauristring").split(",")[1];}
$("addDate").addEventListener("click",()=>{$("newDate").focus();});
$("addDateValue").addEventListener("click",()=>addDate());
$("month").addEventListener("change",loadMonth);
function openCurrentMonthPdfPreview(){
  try{
    saveMonth();
    const doc=createPdf();
    // Öffne zuerst ein leeres Fenster synchron zum Klick, damit Browser-Popup-Blocker es nicht blockieren.
    const printWindow=window.open("about:blank","_blank");
    if(!printWindow){
      showStatus("Der Browser hat das Druckfenster blockiert. Bitte Pop-ups für diese Website erlauben und erneut klicken.",true);
      return;
    }
    const blob=doc.output("blob");
    const url=URL.createObjectURL(blob);
    printWindow.document.open();
    printWindow.document.write(`<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Anwesenheitsliste drucken</title><style>
      *{box-sizing:border-box}body{margin:0;background:#e9edf2;font-family:Arial,sans-serif;color:#183047}
      .toolbar{position:sticky;top:0;display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:12px 16px;background:#fff;border-bottom:1px solid #ccd5df;box-shadow:0 2px 8px #0001}
      .toolbar strong{margin-right:auto}.toolbar button{border:0;border-radius:8px;padding:10px 16px;font-weight:700;cursor:pointer;background:#174f78;color:white}.toolbar .secondary{background:#e8eef4;color:#183047}
      iframe{display:block;width:100%;height:calc(100vh - 62px);border:0;background:white}
      @media print{.toolbar{display:none}iframe{height:100vh}}
      </style></head><body><div class="toolbar"><strong>Anwesenheitsliste – ${monthLabel()}</strong><button onclick="document.getElementById('pdfFrame').contentWindow.print()">Drucken / als PDF speichern</button><button class="secondary" onclick="sharePdf()">PDF teilen</button></div><iframe id="pdfFrame" title="Druckvorschau"></iframe><script>
      async function sharePdf(){try{const response=await fetch(${JSON.stringify(url)});const blob=await response.blob();const file=new File([blob],${JSON.stringify(pdfFileName())},{type:'application/pdf'});if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:${JSON.stringify("Anwesenheitsliste "+monthLabel())}});}else{alert('Teilen wird von diesem Browser nicht unterstützt. Bitte „Drucken / als PDF speichern“ wählen und die Datei anschließend teilen.');}}catch(e){alert('Teilen konnte nicht geöffnet werden. Bitte die Druck-/Speicherfunktion verwenden.');}}
      <\/script></body></html>`);
    printWindow.document.close();
    printWindow.document.getElementById("pdfFrame").src=url;
    showStatus("Druckübersicht geöffnet. Nutze dort „Drucken / als PDF speichern“ oder „PDF teilen“.",false,true);
  }catch(e){showStatus(e.message||"Druckübersicht konnte nicht geöffnet werden.",true);}
}
$("makePdf").addEventListener("click",openCurrentMonthPdfPreview);
$("sendMonthPdf")?.addEventListener("click",openCurrentMonthPdfPreview);
async function makeAndShare(){
  try {
    saveMonth();
    const doc = createPdf();
    const blob = doc.output("blob");
    const file = new File([blob], pdfFileName(), {type:"application/pdf"});
    if (navigator.share && navigator.canShare && navigator.canShare({files:[file]})) {
      await navigator.share({files:[file], title:`Anwesenheit ${monthLabel()}`, text:`Anwesenheitsliste ${monthLabel()}`});
      showStatus("Teilen-Menü geöffnet.",false,true);
    } else {
      doc.save(pdfFileName());
      showStatus("PDF heruntergeladen. Öffne die Datei und nutze anschließend „Teilen“ auf deinem Gerät.",false,true);
    }
  } catch(e) {
    if (e && e.name === "AbortError") {
      showStatus("Teilen abgebrochen. Die PDF wurde nicht versendet.",false,false);
    } else {
      showStatus(e.message || "PDF konnte nicht geteilt werden.",true);
    }
  }
}
$("sharePdf").addEventListener("click",makeAndShare);
$("newClass").addEventListener("click",()=>{
  const confirmed=window.confirm("Neue Klasse vorbereiten? Dabei werden alle gespeicherten Anwesenheitsmonate in diesem Browser gelöscht. Die Teilnehmernamen bleiben erhalten und können danach geändert werden. Diese Aktion kann nicht rückgängig gemacht werden.");
  if(!confirmed) return;
  Object.keys(localStorage).filter(key=>key.startsWith("attendance:")).forEach(key=>localStorage.removeItem(key));
  dates=[]; attendance={}; saveMonth(); render(); renderOverview();
  showStatus("Alte Anwesenheitsdaten gelöscht. Du kannst jetzt die Teilnehmernamen für die neue Klasse ändern.",false,true);
});

["totalHours","requiredPercent","weekdayHours","saturdayHours"].forEach(id=>{
  $(id).addEventListener("change",()=>{
    saveHourSettings();
    showStatus("Anwesenheitsberechnung aktualisiert.",false,true);
  });
});
hourSettings=JSON.parse(localStorage.getItem("attendance-hour-settings")||'{"totalHours":1000,"requiredPercent":70,"weekdayHours":4,"saturdayHours":6}');
$("totalHours").value=hourSettings.totalHours;
$("requiredPercent").value=hourSettings.requiredPercent;
$("weekdayHours").value=hourSettings.weekdayHours;
$("saturdayHours").value=hourSettings.saturdayHours;

function showMainView(showOverview){
  document.body.classList.toggle("show-overview",showOverview);
  const btn=$("openOverview");
  if(btn) btn.textContent=showOverview ? "Zurück zur Monatsliste" : "Anwesenheitsübersicht";
  if(showOverview) renderOverview();
}
$("openOverview")?.addEventListener("click",()=>{
  const opening=!document.body.classList.contains("show-overview");
  showMainView(opening);
  document.querySelectorAll(".menu-item").forEach(b=>b.classList.toggle("active",opening ? b.id==="menuOverview" : b.dataset.target==="attendanceSection"));
});
const backButton=document.createElement("button");
backButton.type="button"; backButton.className="button secondary overview-back";
backButton.textContent="← Zurück zur Monatsliste";
backButton.addEventListener("click",()=>{
  showMainView(false);
  document.querySelectorAll(".menu-item").forEach(b=>b.classList.toggle("active",b.dataset.target==="attendanceSection"));
});
const overviewPanel=$("overviewPanel");
if(overviewPanel) overviewPanel.insertBefore(backButton,overviewPanel.firstChild);

$("reviewParticipant")?.addEventListener("change",renderOverview);
$("useCourseTotal")?.addEventListener("change",()=>{
  const help=$("quoteModeHelp");
  if(help) help.textContent=$("useCourseTotal").checked
    ? "Aktiv: Quote wird auf die eingestellten gesamten Kursstunden bezogen."
    : "Standard: Quote nur bezogen auf die bisher erfassten Unterrichtsstunden.";
  renderOverview();
});


function saveAllLocal(){
  saveMonth();
  saveParticipants();
  saveHourSettings();
}
async function saveAllNow(){
  saveAllLocal();
  if(window.attendanceCloud && window.attendanceCloud.isReady()){
    try { await window.attendanceCloud.saveAll(); showStatus("Änderungen in Supabase gespeichert.",false,true); }
    catch(err){ console.error(err); showStatus("Lokal gespeichert, aber Supabase-Speichern fehlgeschlagen: "+(err.message||err),true); }
  } else showStatus("Lokal gespeichert. Bitte erst anmelden, damit Supabase synchronisiert werden kann.",false,true);
}
$("saveNow")?.addEventListener("click",saveAllNow);
$("refreshApp")?.addEventListener("click",async()=>{
  const btn=$("refreshApp"); if(btn){btn.disabled=true;btn.textContent="Aktualisiere …";}
  try {
    if(window.attendanceCloud && window.attendanceCloud.isReady()) await window.attendanceCloud.refreshAll();
    else { loadMonth(); renderArchiveList(); }
    showStatus("Daten aktualisiert.",false,true);
  } catch(err){ console.error(err); showStatus("Aktualisieren fehlgeschlagen: "+(err.message||err),true); }
  finally { if(btn){btn.disabled=false;btn.textContent="Aktualisieren";} }
});

function activateMenu(activeId){
  document.querySelectorAll(".menu-item").forEach(b=>b.classList.toggle("active",b.id===activeId || b.dataset.target===activeId));
}
document.querySelectorAll(".menu-item[data-target]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    showMainView(false);
    activateMenu(btn.id || btn.dataset.target);
    const target=document.getElementById(btn.dataset.target);
    if(target) target.scrollIntoView({behavior:"smooth",block:"start"});
    if(btn.id==="menuArchive") $("archiveList")?.scrollIntoView({behavior:"smooth",block:"start"});
    if(btn.dataset.target==="pdfSection") $("makePdf")?.focus({preventScroll:true});
  });
});
$("menuOverview")?.addEventListener("click",()=>{
  showMainView(true);
  document.querySelectorAll(".menu-item").forEach(b=>b.classList.toggle("active",b.id==="menuOverview"));
  $("overviewPanel")?.scrollIntoView({behavior:"smooth",block:"start"});
});
installHistoricalSeed();
loadMonth();
renderArchiveList();


// Supabase login + shared cloud data. Publishable key is safe for browser use;
// all access is controlled by database RLS policies.
(function setupSupabaseAttendance(){
  const SUPABASE_URL = "https://yfkijeyujeclgupjfkdi.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_UipmVVhaE89yrjLW7vRxiA_XFLd5n2i";
  const sb = window.supabase?.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  const gate = document.getElementById('authGate');
  const authForm = document.getElementById('authForm');
  const authMessage = document.getElementById('authMessage');
  const signupBtn = document.getElementById('signupBtn');
  let activeUser = null;
  let remoteParticipants = [];
  let participantMap = new Map();
  let cloudReady = false;
  const msg = (t, err=false) => { if(authMessage){authMessage.textContent=t;authMessage.className='status'+(err?' error':' ok');} };
  const setGate = (locked) => document.body.classList.toggle('auth-locked',locked);
  if(!sb){ msg('Supabase konnte nicht geladen werden. Bitte Internetverbindung prüfen.',true); return; }

  async function getProfile(user){
    const {data,error}=await sb.from('app_profiles').select('user_id,display_name,role,approved').eq('user_id',user.id).maybeSingle();
    if(error) throw error;
    return data;
  }
  async function afterAuth(user){
    activeUser=user;
    const profile=await getProfile(user);
    if(!profile){setGate(true);msg('Dein Profil wurde noch nicht angelegt. Bitte Administrator kontaktieren.',true);return;}
    if(!profile.approved){setGate(true);msg('Deine Anfrage ist eingegangen. Der Administrator muss deinen Zugang in Supabase unter Table Editor → app_profiles freigeben.',false);return;}
    setGate(false);
    let signout=document.getElementById('signOutButton');
    if(!signout){signout=document.createElement('button');signout.id='signOutButton';signout.className='button secondary';signout.type='button';signout.textContent='Abmelden';document.querySelector('.app-menu')?.appendChild(signout);}
    signout.onclick=async()=>{await sb.auth.signOut();cloudReady=false;activeUser=null;setGate(true);msg('Du wurdest abgemeldet.');};
    try { await refreshAll(); cloudReady=true; showStatus('Mit Supabase verbunden. Gemeinsame Daten geladen.',false,true); }
    catch(err){ console.error(err); showStatus('Anmeldung aktiv, aber Daten konnten nicht geladen werden: '+err.message,true); }
  }
  async function upsertParticipantsFromLocal(){
    const local = participants.map(p=>({full_name:(p.first+' '+p.last).trim(),participant_number:String(p.kst||'')}));
    const {data:existing,error}=await sb.from('course_participants').select('id,full_name,participant_number');
    if(error) throw error;
    const list=existing||[];
    for(const p of local){
      const found=list.find(x=>x.full_name.toLowerCase()===p.full_name.toLowerCase() && String(x.participant_number||'')===p.participant_number);
      if(!found){ const {data,error:insErr}=await sb.from('course_participants').insert(p).select('id,full_name,participant_number').single(); if(insErr) throw insErr; list.push(insErr?null:data); }
    }
    remoteParticipants=list.filter(Boolean);
    participantMap=new Map();
    participants.forEach((p,i)=>{
      const full=(p.first+' '+p.last).trim().toLowerCase();
      const match=remoteParticipants.find(r=>r.full_name.toLowerCase()===full && String(r.participant_number||'')===String(p.kst||''));
      if(match) participantMap.set(i,match.id);
    });
  }
  async function refreshAll(){
    if(!activeUser) throw new Error('Bitte anmelden.');
    const profile=await getProfile(activeUser);
    if(!profile || !profile.approved) throw new Error('Dein Konto ist nicht freigegeben.');
    const {data:remote,error}=await sb.from('course_participants').select('id,full_name,participant_number').order('created_at');
    if(error) throw error;
    if(remote && remote.length){
      remoteParticipants=remote;
      participants.splice(0,participants.length,...remote.map(r=>{const parts=(r.full_name||'').trim().split(/\s+/);return {first:parts.slice(0,-1).join(' ')||'',last:parts.slice(-1)[0]||'',kst:r.participant_number||''};}));
      saveParticipants();
    } else {
      await upsertParticipantsFromLocal();
    }
    participantMap=new Map();
    participants.forEach((p,i)=>{const full=(p.first+' '+p.last).trim().toLowerCase();const r=remoteParticipants.find(x=>x.full_name.toLowerCase()===full&&String(x.participant_number||'')===String(p.kst||''));if(r)participantMap.set(i,r.id);});
    const {data:days,error:daysErr}=await sb.from('attendance_days').select('participant_id,attendance_date,entry');
    if(daysErr) throw daysErr;
    // Build a month cache from the shared attendance rows.
    const monthData={};
    for(const row of (days||[])){
      const mk=row.attendance_date.slice(0,7); if(!monthData[mk]) monthData[mk]={dates:[],attendance:{}};
      const idx=participants.findIndex((p,i)=>participantMap.get(i)===row.participant_id);
      if(idx<0) continue;
      if(!monthData[mk].dates.includes(row.attendance_date)) monthData[mk].dates.push(row.attendance_date);
      monthData[mk].attendance[row.attendance_date]=monthData[mk].attendance[row.attendance_date]||{};
      monthData[mk].attendance[row.attendance_date][idx]=row.entry||'';
    }
    Object.entries(monthData).forEach(([mk,data])=>{data.dates.sort();localStorage.setItem('attendance:'+mk,JSON.stringify(data));});
    // If the cloud has no attendance yet, seed the existing local months once.
    if(!(days||[]).length) await saveAll();
    loadMonth(); renderArchiveList(); renderOverview();
  }
  async function saveAll(){
    if(!activeUser) throw new Error('Bitte anmelden.');
    const profile=await getProfile(activeUser); if(!profile?.approved) throw new Error('Dein Konto ist nicht freigegeben.');
    await upsertParticipantsFromLocal();
    // Keep participant metadata in sync with the locally editable table.
    for(let i=0;i<participants.length;i++){
      const id=participantMap.get(i); if(!id) continue;
      const p=participants[i];
      const {error}=await sb.from('course_participants').update({full_name:(p.first+' '+p.last).trim(),participant_number:String(p.kst||'')}).eq('id',id);
      if(error) throw error;
    }
    const keys=Object.keys(localStorage).filter(k=>/^attendance:\d{4}-\d{2}$/.test(k));
    for(const key of keys){
      const mk=key.slice('attendance:'.length); let data; try{data=JSON.parse(localStorage.getItem(key)||'{}')}catch{continue;}
      for(const date of (data.dates||[])){
        const row=data.attendance?.[date]||{};
        for(let i=0;i<participants.length;i++){
          const pid=participantMap.get(i); if(!pid) continue;
          const entry=String(row[i]||'');
          const {error}=await sb.from('attendance_days').upsert({participant_id:pid,attendance_date:date,entry,updated_by:activeUser.id,updated_at:new Date().toISOString()},{onConflict:'participant_id,attendance_date'});
          if(error) throw error;
        }
      }
    }
    cloudReady=true;
  }
  window.attendanceCloud={isReady:()=>Boolean(cloudReady&&activeUser),saveAll,refreshAll};
  authForm?.addEventListener('submit',async e=>{
    e.preventDefault();
    const email=document.getElementById('authEmail').value.trim(); const password=document.getElementById('authPassword').value;
    const btn=document.getElementById('loginBtn'); if(btn){btn.disabled=true;btn.textContent='Bitte warten …';}
    try{const {data,error}=await sb.auth.signInWithPassword({email,password});if(error)throw error;await afterAuth(data.user);}
    catch(err){msg('Anmeldung fehlgeschlagen: '+err.message,true);}
    finally{if(btn){btn.disabled=false;btn.textContent='Anmelden';}}
  });
  signupBtn?.addEventListener('click',async()=>{
    const email=document.getElementById('authEmail').value.trim(); const password=document.getElementById('authPassword').value; const name=document.getElementById('authName').value.trim();
    if(!email||!password){msg('Bitte E-Mail und Passwort eingeben.',true);return;}
    signupBtn.disabled=true;signupBtn.textContent='Anfrage wird gesendet …';
    try{
      const {data,error}=await sb.auth.signUp({email,password,options:{data:{full_name:name}}}); if(error)throw error;
      msg(data.session ? 'Konto erstellt. Bitte auf die Freigabe durch den Administrator warten.' : 'Registrierung gestartet. Prüfe ggf. deine E-Mail zur Bestätigung. Danach wird dein Profil in Supabase unter app_profiles angelegt.');
    }catch(err){msg('Anfrage fehlgeschlagen: '+err.message,true);}
    finally{signupBtn.disabled=false;signupBtn.textContent='Zugang anfordern';}
  });
  sb.auth.getSession().then(async({data,error})=>{if(error){msg(error.message,true);return;}if(data.session){try{await afterAuth(data.session.user);}catch(err){msg('Konto konnte nicht geprüft werden: '+err.message,true);}}});
  sb.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_OUT'){activeUser=null;cloudReady=false;setGate(true);}});
})();
