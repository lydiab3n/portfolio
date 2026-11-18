import puppeteer from "puppeteer-core";
import fs from "fs";
import { D, ic } from "./data.mjs";
const photo = "data:image/jpeg;base64," + fs.readFileSync("photo.jpg").toString("base64");
const css = `
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
:root{--ink:#26262e;--mut:#5d5d69;--acc:#d1336f;--accd:#a3194f;--soft:#fdeef4;--line:#efd9e3}
html,body{width:210mm;height:297mm;overflow:hidden}
body{font:9pt/1.4 'Poppins',system-ui,sans-serif;color:var(--ink);-webkit-print-color-adjust:exact;print-color-adjust:exact;background:#fff}
.page{position:relative;width:210mm;height:297mm}
.band{position:absolute;left:0;top:0;width:100%;height:67mm;background:radial-gradient(120% 160% at 100% 0%,#ff8db3 0%,transparent 55%),linear-gradient(120deg,#c9275f 0%,#e0457b 55%,#f06a9a 100%);color:#fff;overflow:hidden}
.band::before{content:"";position:absolute;right:-18mm;bottom:-30mm;width:90mm;height:90mm;border-radius:50%;background:rgba(255,255,255,.08)}
.band::after{content:"";position:absolute;right:30mm;top:-26mm;width:50mm;height:50mm;border-radius:50%;background:rgba(255,255,255,.07)}
.ph{position:absolute;left:14mm;top:13mm;width:50mm;height:50mm;border-radius:50%;z-index:3;border:1.8mm solid #fff;box-shadow:0 2mm 5mm rgba(120,10,50,.28);overflow:hidden;background:#fff}
.ph img{width:100%;height:100%;object-fit:cover;display:block}
.hd{position:absolute;left:73mm;right:12mm;top:8mm;z-index:2;color:#fff}
h1{font:700 25pt/1 'Poppins';letter-spacing:.01em}
.role{font:500 11pt 'Poppins';margin:1.4mm 0 2.6mm;color:#ffe3ee;letter-spacing:.02em}
.ct{display:flex;flex-wrap:wrap;gap:1.2mm 4.6mm;font-size:8pt}
.ct span,.ct a{display:inline-flex;align-items:center;gap:1.6mm;color:#fff;text-decoration:none}
.ct svg{width:3.3mm;height:3.3mm;fill:#fff}
.ct a{text-decoration:underline;text-decoration-color:rgba(255,255,255,.6);text-underline-offset:.6mm}
.sum{margin-top:2.6mm;font-size:8.3pt;line-height:1.45;color:rgba(255,255,255,.93)}
.sum b{font-weight:600;color:#fff}
.cols{position:absolute;left:0;right:0;top:67mm;bottom:0;display:grid;grid-template-columns:71mm 1fr}
aside{padding:14mm 6mm 6mm 12mm}
main{padding:8mm 11mm 6mm 6mm}
h2{font:700 8.4pt 'Poppins';text-transform:uppercase;letter-spacing:.16em;color:var(--accd);display:flex;align-items:center;gap:2.4mm;margin-bottom:2.8mm}
h2::before{content:"";width:2.4mm;height:2.4mm;border-radius:50%;background:var(--acc);box-shadow:0 0 0 .9mm var(--soft)}
section{margin-bottom:4.6mm}
.e{margin-bottom:3.2mm;padding-left:4.8mm}
.e .d{font:600 7.6pt 'Poppins';color:var(--accd)}
.e h4{font:600 8.6pt/1.3 'Poppins';margin:.3mm 0}
.e .o{font-size:8.1pt;color:var(--mut)}
.e p{font-size:7.9pt;color:var(--mut);line-height:1.4;margin-top:.8mm}
.sk{margin-bottom:2.2mm;font-size:8pt;line-height:1.38;padding-left:4.8mm}
.sk b{display:block;font-weight:600}
.sk span{color:var(--mut)}
.l{display:flex;justify-content:space-between;font-size:8pt;margin-bottom:1mm;padding-left:4.8mm}
.l span{color:var(--mut)}
.int{font-size:8pt;color:var(--mut);margin-bottom:.8mm;padding-left:4.8mm}
.work{position:relative}
.j{position:relative;padding-left:6mm;margin-bottom:6.2mm;break-inside:avoid}
.j::before{content:"";position:absolute;left:.2mm;top:1.5mm;width:3mm;height:3mm;border-radius:50%;background:var(--acc);box-shadow:0 0 0 .9mm #fff,0 0 0 1.5mm var(--acc);z-index:1}
.j::after{content:"";position:absolute;left:1.35mm;top:6mm;bottom:-6.8mm;width:.5mm;background:linear-gradient(180deg,var(--acc),#f5c3d6);border-radius:1mm}
.j:last-child::after{display:none}
.jh{display:flex;justify-content:space-between;align-items:flex-start;gap:3mm}
.jh h4{font:600 11pt/1.25 'Poppins'}
.pill{white-space:nowrap;background:var(--soft);color:var(--accd);font:600 7.4pt 'Poppins';padding:.8mm 3mm;border-radius:10mm;box-shadow:inset 0 0 0 .25mm #f0bfd2}
.org{font-size:9pt;color:var(--mut);margin:.2mm 0 1.6mm}
.org b{color:var(--acc);font-weight:600}
.sup{font-size:8.2pt;color:var(--mut);font-style:italic;margin:-.8mm 0 1.4mm}
.j ul{margin-left:3.4mm;font-size:8.9pt;color:var(--mut);line-height:1.48}
.j li{margin-bottom:.9mm}
.j li b{color:var(--ink);font-weight:600}
.j li i{color:var(--ink)}
`;
function html(d){
 const li = (a)=>a.map(x=>`<li>${x}</li>`).join("");
 return `<!doctype html><html lang="${d.lang}"><head><meta charset="utf-8"><title>CV – Lydia Benosmane</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet"><style>${css}</style></head><body><div class="page">
<div class="band"></div><div class="ph"><img src="${photo}" alt=""></div>
<div class="hd"><h1>LYDIA BENOSMANE</h1><div class="role">${d.title}</div>
<div class="ct"><span>${ic.mail}lydiabenosmane@gmail.com</span><span>${ic.tel}+33 6 69 13 14 77</span><span>${ic.pin}${d.where}</span><a href="${d.link}">${ic.web}${d.linkTxt}</a></div>
<p class="sum">${d.summary}</p></div>
<div class="cols"><aside>
<section><h2>${d.h.edu}</h2>${d.edu.map(e=>`<div class="e"><div class="d">${e.d}</div><h4>${e.t}</h4><div class="o">${e.o}</div><p>${e.b}</p></div>`).join("")}</section>
<section><h2>${d.h.skills}</h2>${d.skills.map(s=>`<div class="sk"><b>${s[0]}</b><span>${s[1]}</span></div>`).join("")}</section>
<section><h2>${d.h.lang}</h2>${d.langs.map(l=>`<div class="l"><b style="font-weight:600">${l[0]}</b><span>${l[1]}</span></div>`).join("")}</section>
<section><h2>${d.h.int}</h2>${d.ints.map(i=>`<div class="int">${i}</div>`).join("")}</section>
</aside>
<main><section class="work"><h2>${d.h.work}</h2>${d.jobs.map(j=>`<div class="j"><div class="jh"><h4>${j.role}</h4><span class="pill">${j.d}</span></div><div class="org"><b>${j.org}</b> · ${j.place}</div>${j.sup?`<div class="sup">${j.sup}</div>`:""}<ul>${li(j.b)}</ul></div>`).join("")}</section></main>
</div></div></body></html>`;
}
const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new" });
for (const k of ["en","fr"]) {
  fs.writeFileSync(`${k}.html`, html(D[k]));
  const p = await b.newPage(); await p.setViewport({width:794,height:1123,deviceScaleFactor:2});
  await p.goto(`file://${process.cwd()}/${k}.html`, {waitUntil:"networkidle0"}); await p.evaluate("document.fonts.ready");
  console.log(k, JSON.stringify(await p.evaluate(()=>{const r=e=>[...document.querySelectorAll(e)].pop().getBoundingClientRect().bottom;return {main:r("main .j"),aside:r("aside section"),band:document.querySelector(".band").getBoundingClientRect().bottom,sum:document.querySelector(".sum").getBoundingClientRect().bottom,page:1123}})));
  await p.pdf({path:`${k}.pdf`, format:"A4", printBackground:true, preferCSSPageSize:true});
  await p.screenshot({path:`${k}.png`});
}
await b.close();
