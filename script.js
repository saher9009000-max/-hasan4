// استرجاع الإعدادات المحفوظة أو استخدام قيم افتراضية
let from = localStorage.getItem('lf_from_lang') || 'ar';
let to = localStorage.getItem('lf_to_lang') || 'en';
let mode = localStorage.getItem('lf_mode') || 'friendly';

const $ = s => document.querySelector(s);
const toast = m => {
  const t = $('#toast');
  t.textContent = m;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
};

function getKey() {
  return localStorage.getItem('openai_key') || '';
}

// تحديث اللغات المسجلة في القوائم والأخذ بالحسبان آخر موقع/لغة تم تسجيلها
function initLangs() {
  $('#fromLang').value = from;
  $('#toLang').value = to;
}

function saveLangState() {
  localStorage.setItem('lf_from_lang', from);
  localStorage.setItem('lf_to_lang', to);
}

async function aiTranslate() {
  const text = $('#inputText').value.trim();
  if (!text) {
    toast('يرجى كتابة نص للترجمة');
    return;
  }
  const key = getKey();
  if (!key) {
    $('#keyModal').classList.remove('hidden');
    toast('أدخل مفتاح OpenAI API أولاً');
    return;
  }

  const btn = $('#translateBtn');
  btn.disabled = true;
  btn.textContent = '🤖 جاري الترجمة بالذكاء الاصطناعي...';
  $('#outputText').textContent = '...';

  const systemPrompts = {
    friendly: `You are a professional translator. Translate accurately from language code '${from}' to language code '${to}'. Keep it natural, conversational, and friendly.`,
    formal: `You are a professional business translator. Translate formally and accurately from language code '${from}' to language code '${to}'.`,
    syrian: `You are an expert in Levantine/Syrian Arabic dialect. Translate between '${from}' and '${to}', using natural Syrian expressions where appropriate.`,
    turkish: `You specialize in Turkish translations. Translate naturally and perfectly between '${from}' and '${to}'.`
  };

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompts[mode] || systemPrompts.friendly },
          { role: 'user', content: text }
        ],
        temperature: 0.3
      })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    const out = data.choices[0].message.content.trim();
    $('#outputText').textContent = out;
    $('#badge').textContent = `🤖 ذكاء اصطناعي • ${mode}`;
    toast('✅ تم اكتمال الترجمة');
  } catch (e) {
    $('#outputText').textContent = 'خطأ: ' + e.message + '\n\nجاري استخدام الترجمة الاحتياطية...';
    try {
      const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
      const j = await r.json();
      $('#outputText').textContent = j.responseData.translatedText;
    } catch {
      toast('فشلت الترجمة الاحتياطية أيضاً');
    }
  } finally {
    btn.disabled = false;
    btn.textContent = '✦ ترجمة بذكاء الاصطناعي';
  }
}

function setMode(m) {
  mode = m;
  localStorage.setItem('lf_mode', m);
  toast('تم تغيير النمط إلى: ' + m);
  if ($('#inputText').value) aiTranslate();
}

// الأحداث والتفاعلات
$('#translateBtn').onclick = aiTranslate;

// قائمة تغيير اللغة الأصلية والهدف وحفظها
$('#fromLang').onchange = (e) => {
  from = e.target.value;
  saveLangState();
};

$('#toLang').onchange = (e) => {
  to = e.target.value;
  saveLangState();
};

// زر تبديل اللغات والنصوص
$('#swapBtn').onclick = () => {
  [from, to] = [to, from];
  $('#fromLang').value = from;
  $('#toLang').value = to;
  saveLangState();

  const inputVal = $('#inputText').value;
  const outputVal = $('#outputText').textContent;
  if (outputVal && outputVal !== '...') {
    $('#inputText').value = outputVal;
    $('#outputText').textContent = inputVal;
  }
  toast('تم تبديل اللغات');
};

// الترجمة الصوتية: القراءة والتسجيل
$('#speakBtn').onclick = () => {
  const text = $('#outputText').textContent;
  if (!text || text === '...') return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = to;
  window.speechSynthesis.speak(u);
};

$('#micBtn').onclick = () => {
  const SR = window.webkitSpeechRecognition || window.SpeechRecognition;
  if (!SR) {
    toast('المتصفح لا يدعم التعرف على الصوت');
    return;
  }
  const rec = new SR();
  rec.lang = from === 'ar' ? 'ar-SA' : from;
  toast('🎙️ جاري الاستماع...');
  rec.start();

  rec.onresult = e => {
    $('#inputText').value = e.results[0][0].transcript;
    aiTranslate();
  };

  rec.onerror = () => {
    toast('لم نتمكن من التقاط الصوت، حاول ثانية');
  };
};

// إدارة المفتاح والمظهر
$('#keyBtn').onclick = () => $('#keyModal').classList.remove('hidden');
$('#closeKey').onclick = () => $('#keyModal').classList.add('hidden');
$('#saveKey').onclick = () => {
  const k = $('#apiKeyInput').value.trim();
  if (k) {
    localStorage.setItem('openai_key', k);
    toast('تم حفظ المفتاح بنجاح');
    $('#keyModal').classList.add('hidden');
  } else toast('أدخل المفتاح أولاً');
};

$('#inputText').oninput = () => {
  $('#charCount').textContent = `${$('#inputText').value.length}/5000`;
};

if (localStorage.getItem('lf_theme') === 'dark') {
  document.body.classList.add('dark');
}

$('#themeBtn').onclick = () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('lf_theme', isDark ? 'dark' : 'light');
};

// تهيئة الوضع الأولي
initLangs();
window.setMode = setMode;
