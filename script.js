/* ============================================================
   ترجم Pro — التطبيق الكامل
   ============================================================ */

/* ===== 1) قائمة اللغات (30+) ===== */
const LANGUAGES = [
  { code:'ar', name:'العربية',    flag:'🇸🇦' },
  { code:'en', name:'English',    flag:'🇬🇧' },
  { code:'fr', name:'Français',   flag:'🇫🇷' },
  { code:'es', name:'Español',    flag:'🇪🇸' },
  { code:'de', name:'Deutsch',    flag:'🇩🇪' },
  { code:'it', name:'Italiano',   flag:'🇮🇹' },
  { code:'pt', name:'Português',  flag:'🇵🇹' },
  { code:'ru', name:'Русский',    flag:'🇷🇺' },
  { code:'zh', name:'中文',        flag:'🇨🇳' },
  { code:'ja', name:'日本語',      flag:'🇯🇵' },
  { code:'ko', name:'한국어',       flag:'🇰🇷' },
  { code:'tr', name:'Türkçe',     flag:'🇹🇷' },
  { code:'fa', name:'فارسی',      flag:'🇮🇷' },
  { code:'ur', name:'اردو',       flag:'🇵🇰' },
  { code:'hi', name:'हिन्दी',       flag:'🇮🇳' },
  { code:'bn', name:'বাংলা',       flag:'🇧🇩' },
  { code:'id', name:'Indonesia',  flag:'🇮🇩' },
  { code:'ms', name:'Melayu',     flag:'🇲🇾' },
  { code:'th', name:'ไทย',        flag:'🇹🇭' },
  { code:'vi', name:'Tiếng Việt', flag:'🇻🇳' },
  { code:'nl', name:'Nederlands', flag:'🇳🇱' },
  { code:'pl', name:'Polski',     flag:'🇵🇱' },
  { code:'sv', name:'Svenska',    flag:'🇸🇪' },
  { code:'no', name:'Norsk',      flag:'🇳🇴' },
  { code:'da', name:'Dansk',      flag:'🇩🇰' },
  { code:'fi', name:'Suomi',      flag:'🇫🇮' },
  { code:'el', name:'Ελληνικά',   flag:'🇬🇷' },
  { code:'he', name:'עברית',      flag:'🇮🇱' },
  { code:'uk', name:'Українська', flag:'🇺🇦' },
  { code:'ro', name:'Română',     flag:'🇷🇴' },
  { code:'cs', name:'Čeština',    flag:'🇨🇿' },
  { code:'hu', name:'Magyar',     flag:'🇭🇺' },
];

/* ===== 2) الحالة العامة ===== */
const state = {
  from: 'ar',
  to:   'en',
  apiKey: localStorage.getItem('ai_key') || '',
  provider: localStorage.getItem('ai_provider') || 'openai',
  model: localStorage.getItem('ai_model') || 'gpt-4o-mini',
  langPickerTarget: 'from',
  recognition: null,
  isRecording: false,
};

/* ===== 3) اختصارات ===== */
const $ = id => document.getElementById(id);
const inputText  = $('input-text');
const outputText = $('output-text');
const charCount  = $('char-count');
const aiStatus   = $('ai-status');

/* ===== 4) Toast ===== */
function toast(msg, ms = 2200) {
  const el = $('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), ms);
}

/* ===== 5) تحديث واجهة اللغة ===== */
function updateLangUI() {
  const from = LANGUAGES.find(l => l.code === state.from);
  const to   = LANGUAGES.find(l => l.code === state.to);
  $('lang-from-btn').querySelector('.lang-flag').textContent = from.flag;
  $('lang-from-name').textContent = from.name;
  $('lang-to-btn').querySelector('.lang-flag').textContent = to.flag;
  $('lang-to-name').textContent = to.name;
}

/* ===== 6) عداد الأحرف ===== */
inputText.addEventListener('input', () => {
  charCount.textContent = `${inputText.value.length} / 5000`;
  if (inputText.value.length > 5000) {
    inputText.value = inputText.value.slice(0, 5000);
  }
});

/* ===== 7) تبديل اللغة ===== */
$('swap-btn').addEventListener('click', () => {
  [state.from, state.to] = [state.to, state.from];
  updateLangUI();
  toast('⇄ تم التبديل');
});

/* ===== 8) فتح منتقي اللغة ===== */
function openLangPicker(target) {
  state.langPickerTarget = target;
  $('lang-modal-title').textContent =
    target === 'from' ? 'لغة النص الأصلي' : 'لغة الترجمة';
  renderLangList('');
  $('lang-search').value = '';
  $('lang-modal').classList.add('open');
}

function renderLangList(filter) {
  const list = $('lang-list');
  const current = state.langPickerTarget === 'from' ? state.from : state.to;
  list.innerHTML = LANGUAGES
    .filter(l =>
      l.name.toLowerCase().includes(filter.toLowerCase()) ||
      l.code.includes(filter.toLowerCase())
    )
    .map(l => `
      <div class="lang-item ${l.code === current ? 'active' : ''}" data-code="${l.code}">
        <span class="lang-item-flag">${l.flag}</span>
        <span>${l.name}</span>
      </div>
    `).join('');

  list.querySelectorAll('.lang-item').forEach(item => {
    item.addEventListener('click', () => {
      const code = item.dataset.code;
      if (state.langPickerTarget === 'from') state.from = code;
      else state.to = code;
      updateLangUI();
      $('lang-modal').classList.remove('open');
      toast('✅ تم تغيير اللغة');
    });
  });
}

$('lang-from-btn').addEventListener('click', () => openLangPicker('from'));
$('lang-to-btn').addEventListener('click',   () => openLangPicker('to'));
$('lang-close').addEventListener('click',    () => $('lang-modal').classList.remove('open'));
$('lang-search').addEventListener('input',    e => renderLangList(e.target.value));

/* ===== 9) ترجمة سريعة (MyMemory API مجاني) ===== */
async function translateBasic() {
  const text = inputText.value.trim();
  if (!text) return toast('⚠️ اكتب نصاً أولاً');

  setAIStatus('busy', '⏳ جاري الترجمة...');
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${state.from}|${state.to}`
    );
    const data = await res.json();
    if (data.responseStatus === 200) {
      setOutput(data.responseData.translatedText);
      setAIStatus('ok', '✅ تمت الترجمة');
    } else {
      throw new Error('فشل');
    }
  } catch (e) {
    setAIStatus('', '❌ فشل الاتصال');
    toast('تعذر الترجمة السريعة');
  }
}

$('btn-translate-basic').addEventListener('click', translateBasic);

/* ===== 10) ترجمة بالذكاء الاصطناعي ===== */
async function translateAI() {
  const text = inputText.value.trim();
  if (!text) return toast('⚠️ اكتب نصاً أولاً');
  if (!state.apiKey) {
    toast('⚠️ أدخل مفتاح API في الإعدادات');
    $('settings-modal').classList.add('open');
    return;
  }

  setAIStatus('busy', '🤖 الذكاء الاصطناعي يعمل...');
  try {
    let translated = '';

    if (state.provider === 'openai') {
      translated = await translateOpenAI(text);
    } else if (state.provider === 'gemini') {
      translated = await translateGemini(text);
    } else if (state.provider === 'deepl') {
      translated = await translateDeepL(text);
    }

    setOutput(translated);
    setAIStatus('ok', '✅ ترجمة احترافية');
  } catch (e) {
    console.error(e);
    setAIStatus('', '❌ ' + e.message);
    toast('فشلت الترجمة: ' + e.message);
  }
}

$('btn-translate-ai').addEventListener('click', translateAI);

function getFromName() { return LANGUAGES.find(l => l.code === state.from).name; }
function getToName()   { return LANGUAGES.find(l => l.code === state.to).name; }

async function translateOpenAI(text) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method:'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${state.apiKey}`,
    },
    body: JSON.stringify({
      model: state.model,
      messages: [
        { role:'system', content:`أنت مترجم محترف. ترجم النص من ${getFromName()} إلى ${getToName()} بدقة عالية مع الحفاظ على الأسلوب والمعنى. أعد الترجمة فقط دون شرح.` },
        { role:'user', content:text }
      ],
      temperature: 0.3,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(()=>({}));
    throw new Error(err.error?.message || 'خطأ في OpenAI');
  }
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

async function translateGemini(text) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${state.apiKey}`,
    {
      method:'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `ترجم النص التالي من ${getFromName()} إلى ${getToName()} فقط:\n\n${text}`
          }]
        }]
      }),
    }
  );
  if (!res.ok) throw new Error('خطأ في Gemini');
  const data = await res.json();
  return data.candidates[0].content.parts[0].text.trim();
}

async function translateDeepL(text) {
  const res = await fetch('https://api-free.deepl.com/v2/translate', {
    method:'POST',
    headers: {
      'Content-Type':'application/x-www-form-urlencoded',
      'Authorization': `DeepL-Auth-Key ${state.apiKey}`,
    },
    body: new URLSearchParams({
      text,
      source_lang: state.from.toUpperCase(),
      target_lang: state.to.toUpperCase(),
    }),
  });
  if (!res.ok) throw new Error('خطأ في DeepL');
  const data = await res.json();
  return data.translations[0].text;
}

/* ===== 11) أدوات الإخراج ===== */
function setOutput(text) {
  outputText.innerHTML = '';
  const p = document.createElement('p');
  p.textContent = text;
  outputText.appendChild(p);
}
function setAIStatus(cls, text) {
  aiStatus.className = 'ai-status ' + cls;
  aiStatus.textContent = text;
}

$('btn-copy').addEventListener('click', async () => {
  const text = outputText.textContent.trim();
  if (!text || text.includes('ستظهر الترجمة')) return toast('لا يوجد نص');
  try {
    await navigator.clipboard.writeText(text);
    toast('📋 تم النسخ');
  } catch { toast('تعذر النسخ'); }
});

$('btn-download').addEventListener('click', () => {
  const text = outputText.textContent.trim();
  if (!text || text.includes('ستظهر
