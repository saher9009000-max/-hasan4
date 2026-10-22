let from='ar', to='en', mode='friendly';
const $=s=>document.querySelector(s);
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500)};

function getKey(){return localStorage.getItem('openai_key')||''}

async function aiTranslate(){
 const text=$('#inputText').value.trim();
 if(!text){toast('اكتب نصاً');return}
 const key=getKey();
 if(!key){$('#keyModal').classList.remove('hidden');toast('أدخل مفتاح OpenAI أولاً');return}

 const btn=$('#translateBtn');
 btn.disabled=true; btn.textContent='🤖 ChatGPT يفكر...';
 $('#outputText').textContent='...';

 const systemPrompts={
  friendly: `You are LinguaFlow, a professional translator. Translate from ${from} to ${to}. Keep it friendly, natural, conversational, not literal.`,
  formal: `You are a formal professional translator. Translate from ${from} to ${to} in formal business tone, accurate.`,
  syrian: `You are expert in Syrian dialect. If input is Syrian Arabic, translate to natural English keeping meaning. If English to Syrian, use Syrian dialect. From ${from} to ${to}.`,
  turkish: `You translate between Arabic/English and Turkish intelligently. Detect language. Translate to ${to}. If Turkish involved, translate perfectly. From ${from} to ${to}.`
 };

 try{
  const res=await fetch('https://api.openai.com/v1/chat/completions',{
   method:'POST',
   headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},
   body: JSON.stringify({
    model:'gpt-4o-mini',
    messages:[
     {role:'system',content:systemPrompts[mode]},
     {role:'user',content:text}
    ],
    temperature:0.3
   })
  });
  const data=await res.json();
  if(data.error) throw new Error(data.error.message);
  const out=data.choices[0].message.content.trim();
  $('#outputText').textContent=out;
  $('#badge').textContent=`🤖 ChatGPT • ${mode}`;
  toast('✅ ترجمة ذكية تمت');
 }catch(e){
  $('#outputText').textContent='خطأ: '+e.message+'\n\nسيتم استخدام الترجمة الاحتياطية...';
  // fallback to MyMemory
  try{
   const r=await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
   const j=await r.json(); $('#outputText').textContent=j.responseData.translatedText;
  }catch{}
 }finally{btn.disabled=false; btn.textContent='✦ ترجمة بذكاء ChatGPT'}
}

function setMode(m){mode=m;toast('النمط: '+m); if($('#inputText').value) aiTranslate();}

$('#translateBtn').onclick=aiTranslate;
$('#swapBtn').onclick=()=>{[from,to]=[to,from];$('#fromLang').textContent=from==='ar'?'🇸🇦 عربي':'🇬🇧 English';$('#toLang').textContent=to==='en'?'🇬🇧 إنكليزي':'🇸🇦 عربي';const a=$('#inputText').value;const b=$('#outputText').textContent;$('#inputText').value=b;$('#outputText').textContent=a;}
$('#keyBtn').onclick=()=>$('#keyModal').classList.remove('hidden');
$('#closeKey').onclick=()=>$('#keyModal').classList.add('hidden');
$('#saveKey').onclick=()=>{const k=$('#apiKeyInput').value.trim(); if(k){localStorage.setItem('openai_key',k);toast('تم حفظ المفتاح');$('#keyModal').classList.add('hidden')}else toast('أدخل المفتاح')};
$('#speakBtn').onclick=()=>{const u=new SpeechSynthesisUtterance($('#outputText').textContent);u.lang=to==='en'?'en-US':'ar-SA';speechSynthesis.speak(u)};
$('#micBtn').onclick=()=>{const SR=window.webkitSpeechRecognition||window.SpeechRecognition; if(!SR)return; const rec=new SR();rec.lang=from==='ar'?'ar-SA':'en-US';rec.start(); rec.onresult=e=>{$('#inputText').value=e.results[0][0].transcript; aiTranslate()}};
$('#inputText').oninput=()=>$('#charCount').textContent=`${$('#inputText').value.length}/5000`;
if(localStorage.getItem('lf_theme')==='dark')document.body.classList.add('dark');
$('#themeBtn').onclick=()=>{document.body.classList.toggle('dark')};

window.setMode=setMode;
