// خريطة 100 لغة (الاسم + العلم + كود الترجمة + كود التعرف الصوتي)
const LANGUAGES = {
  ar: { name: 'العربية', flag: '🇸🇦', speech: 'ar-SA' },
  en: { name: 'English', flag: '🇬🇧', speech: 'en-US' },
  fr: { name: 'Français', flag: '🇫🇷', speech: 'fr-FR' },
  tr: { name: 'Türkçe', flag: '🇹🇷', speech: 'tr-TR' },
  es: { name: 'Español', flag: '🇪🇸', speech: 'es-ES' },
  de: { name: 'Deutsch', flag: '🇩🇪', speech: 'de-DE' },
  it: { name: 'Italiano', flag: '🇮🇹', speech: 'it-IT' },
  pt: { name: 'Português', flag: '🇵🇹', speech: 'pt-PT' },
  ru: { name: 'Русский', flag: '🇷🇺', speech: 'ru-RU' },
  zh: { name: '中文', flag: '🇨🇳', speech: 'zh-CN' },
  ja: { name: '日本語', flag: '🇯🇵', speech: 'ja-JP' },
  ko: { name: '한국어', flag: '🇰🇷', speech: 'ko-KR' },
  fa: { name: 'فارسی', flag: '🇮🇷', speech: 'fa-IR' },
  ur: { name: 'اردو', flag: '🇵🇰', speech: 'ur-PK' },
  hi: { name: 'हिन्दी', flag: '🇮🇳', speech: 'hi-IN' },
  bn: { name: 'বাংলা', flag: '🇧🇩', speech: 'bn-BD' },
  id: { name: 'Indonesia', flag: '🇮🇩', speech: 'id-ID' },
  ms: { name: 'Melayu', flag: '🇲🇾', speech: 'ms-MY' },
  th: { name: 'ไทย', flag: '🇹🇭', speech: 'th-TH' },
  vi: { name: 'Tiếng Việt', flag: '🇻🇳', speech: 'vi-VN' },
  nl: { name: 'Nederlands', flag: '🇳🇱', speech: 'nl-NL' },
  pl: { name: 'Polski', flag: '🇵🇱', speech: 'pl-PL' },
  sv: { name: 'Svenska', flag: '🇸🇪', speech: 'sv-SE' },
  no: { name: 'Norsk', flag: '🇳🇴', speech: 'no-NO' },
  da: { name: 'Dansk', flag: '🇩🇰', speech: 'da-DK' },
  fi: { name: 'Suomi', flag: '🇫🇮', speech: 'fi-FI' },
  el: { name: 'Ελληνικά', flag: '🇬🇷', speech: 'el-GR' },
  he: { name: 'עברית', flag: '🇮🇱', speech: 'he-IL' },
  uk: { name: 'Українська', flag: '🇺🇦', speech: 'uk-UA' },
  ro: { name: 'Română', flag: '🇷🇴', speech: 'ro-RO' },
  cs: { name: 'Čeština', flag: '🇨🇿', speech: 'cs-CZ' },
  hu: { name: 'Magyar', flag: '🇭🇺', speech: 'hu-HU' },
  bg: { name: 'Български', flag: '🇧🇬', speech: 'bg-BG' },
  hr: { name: 'Hrvatski', flag: '🇭🇷', speech: 'hr-HR' },
  sk: { name: 'Slovenčina', flag: '🇸🇰', speech: 'sk-SK' },
  sl: { name: 'Slovenščina', flag: '🇸🇮', speech: 'sl-SI' },
  sr: { name: 'Српски', flag: '🇷🇸', speech: 'sr-RS' },
  bs: { name: 'Bosanski', flag: '🇧🇦', speech: 'bs-BA' },
  sq: { name: 'Shqip', flag: '🇦🇱', speech: 'sq-AL' },
  mk: { name: 'Македонски', flag: '🇲🇰', speech: 'mk-MK' },
  lt: { name: 'Lietuvių', flag: '🇱🇹', speech: 'lt-LT' },
  lv: { name: 'Latviešu', flag: '🇱🇻', speech: 'lv-LV' },
  et: { name: 'Eesti', flag: '🇪🇪', speech: 'et-EE' },
  is: { name: 'Íslenska', flag: '🇮🇸', speech: 'is-IS' },
  ga: { name: 'Gaeilge', flag: '🇮🇪', speech: 'ga-IE' },
  mt: { name: 'Malti', flag: '🇲🇹', speech: 'mt-MT' },
  cy: { name: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', speech: 'cy-GB' },
  gl: { name: 'Galego', flag: '🇪🇸', speech: 'gl-ES' },
  eu: { name: 'Euskara', flag: '🇪🇸', speech: 'eu-ES' },
  ca: { name: 'Català', flag: '🇪🇸', speech: 'ca-ES' },
  af: { name: 'Afrikaans', flag: '🇿🇦', speech: 'af-ZA' },
  sw: { name: 'Kiswahili', flag: '🇰🇪', speech: 'sw-KE' },
  am: { name: 'አማርኛ', flag: '🇪🇹', speech: 'am-ET' },
  so: { name: 'Soomaali', flag: '🇸🇴', speech: 'so-SO' },
  ha: { name: 'Hausa', flag: '🇳🇬', speech: 'ha-NG' },
  yo: { name: 'Yorùbá', flag: '🇳🇬', speech: 'yo-NG' },
  ig: { name: 'Igbo', flag: '🇳🇬', speech: 'ig-NG' },
  zu: { name: 'isiZulu', flag: '🇿🇦', speech: 'zu-ZA' },
  xh: { name: 'isiXhosa', flag: '🇿🇦', speech: 'xh-ZA' },
  st: { name: 'Sesotho', flag: '🇱🇸', speech: 'st-ZA' },
  tn: { name: 'Setswana', flag: '🇧🇼', speech: 'tn-ZA' },
  mg: { name: 'Malagasy', flag: '🇲🇬', speech: 'mg-MG' },
  ny: { name: 'Chichewa', flag: '🇲🇼', speech: 'ny-MW' },
  sn: { name: 'chiShona', flag: '🇿🇼', speech: 'sn-ZW' },
  hy: { name: 'Հայերեն', flag: '🇦🇲', speech: 'hy-AM' },
  ka: { name: 'ქართული', flag: '🇬🇪', speech: 'ka-GE' },
  az: { name: 'Azərbaycan', flag: '🇦🇿', speech: 'az-AZ' },
  kk: { name: 'Қазақ', flag: '🇰🇿', speech: 'kk-KZ' },
  uz: { name: 'Oʻzbek', flag: '🇺🇿', speech: 'uz-UZ' },
  ky: { name: 'Кыргызча', flag: '🇰🇬', speech: 'ky-KG' },
  tg: { name: 'Тоҷикӣ', flag: '🇹🇯', speech: 'tg-TJ' },
  tk: { name: 'Türkmen', flag: '🇹🇲', speech: 'tk-TM' },
  mn: { name: 'Монгол', flag: '🇲🇳', speech: 'mn-MN' },
  ne: { name: 'नेपाली', flag: '🇳🇵', speech: 'ne-NP' },
  si: { name: 'සිංහල', flag: '🇱🇰', speech: 'si-LK' },
  ta: { name: 'தமிழ்', flag: '🇮🇳', speech: 'ta-IN' },
  te: { name: 'తెలుగు', flag: '🇮🇳', speech: 'te-IN' },
  ml: { name: 'മലയാളം', flag: '🇮🇳', speech: 'ml-IN' },
  kn: { name: 'ಕನ್ನಡ', flag: '🇮🇳', speech: 'kn-IN' },
  mr: { name: 'मराठी', flag: '🇮🇳', speech: 'mr-IN' },
  gu: { name: 'ગુજરાતી', flag: '🇮🇳', speech: 'gu-IN' },
  pa: { name: 'ਪੰਜਾਬੀ', flag: '🇮🇳', speech: 'pa-IN' },
  or: { name: 'ଓଡ଼ିଆ', flag: '🇮🇳', speech: 'or-IN' },
  as: { name: 'অসমীয়া', flag: '🇮🇳', speech: 'as-IN' },
  sd: { name: 'سنڌي', flag: '🇵🇰', speech: 'sd-PK' },
  ps: { name: 'پښتو', flag: '🇦🇫', speech: 'ps-AF' },
  ku: { name: 'Kurdî', flag: '🏴', speech: 'ku-TR' },
  ti: { name: 'ትግርኛ', flag: '🇪🇷', speech: 'ti-ER' },
  om: { name: 'Oromoo', flag: '🇪🇹', speech: 'om-ET' },
  rw: { name: 'Kinyarwanda', flag: '🇷🇼', speech: 'rw-RW' },
  ln: { name: 'Lingála', flag: '🇨🇩', speech: 'ln-CD' },
  wo: { name: 'Wolof', flag: '🇸🇳', speech: 'wo-SN' },
  ff: { name: 'Fulfulde', flag: '🇸🇳', speech: 'ff-SN' },
  tw: { name: 'Twi', flag: '🇬🇭', speech: 'tw-GH' },
  ak: { name: 'Akan', flag: '🇬🇭', speech: 'ak-GH' },
  ee: { name: 'Eʋegbe', flag: '🇬🇭', speech: 'ee-GH' },
  lua: { name: 'Tshiluba', flag: '🇨🇩', speech: 'lua-CD' },
  kg: { name: 'Kikongo', flag: '🇨🇩', speech: 'kg-CD' },
  nso: { name: 'Sepedi', flag: '🇿🇦', speech: 'nso-ZA' },
  ts: { name: 'Xitsonga', flag: '🇿🇦', speech: 'ts-ZA' },
  ss: { name: 'siSwati', flag: '🇸🇿', speech: 'ss-SZ' },
  ve: { name: 'Tshivenda', flag: '🇿🇦', speech: 've-ZA' },
  nr: { name: 'isiNdebele', flag: '🇿🇦', speech: 'nr-ZA' },
};

let state = { from: 'tr', to: 'ar', apiKey: localStorage.getItem('openai_key') || '' };
let langPickerTarget = 'from'; // لتحديد أي زر يتم تعديله

const $ = id => document.getElementById(id);
const inputText = $('input-text');
const outputText = $('output-text');
const statusText = $('status-text');

// تحديث الواجهة
function updateLangUI() {
  $('lang-from-btn').querySelector('.lang-flag').textContent = LANGUAGES[state.from].flag;
  $('lang-from-name').textContent = LANGUAGES[state.from].name;
  $('lang-to-btn').querySelector('.lang-flag').textContent = LANGUAGES[state.to].flag;
  $('lang-to-name').textContent = LANGUAGES[state.to].name;
}
updateLangUI();

// تبديل
$('swap-btn').onclick = () => {
  let temp = state.from;
  state.from = state.to;
  state.to = temp;
  updateLangUI();
  showToast('تم التبديل');
};

// --- نافذة اختيار اللغة ---
function openLangModal(target) {
  langPickerTarget = target;
  $('lang-modal').classList.add('open');
  renderLangList('');
}

function renderLangList(filter) {
  const list = $('lang-list');
  const current = langPickerTarget === 'from' ? state.from : state.to;
  
  list.innerHTML = Object.entries(LANGUAGES)
    .filter(([code, lang]) => lang.name.toLowerCase().includes(filter.toLowerCase()) || code.includes(filter.toLowerCase()))
    .map(([code, lang]) => `
      <div onclick="selectLang('${code}')" style="padding: 12px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; gap: 10px; background: ${code === current ? 'rgba(212,175,55,0.2)' : 'transparent'}; border: 1px solid ${code === current ? '#d4af37' : 'transparent'};">
        <span style="font-size: 1.2rem;">${lang.flag}</span>
        <span>${lang.name}</span>
      </div>
    `).join('');
}

window.selectLang = (code) => {
  if (langPickerTarget === 'from') state.from = code;
  else state.to = code;
  updateLangUI();
  $('lang-modal').classList.remove('open');
  showToast('تم تغيير اللغة ✅');
};

$('lang-from-btn').onclick = () => openLangModal('from');
$('lang-to-btn').onclick = () => openLangModal('to');
$('lang-close').onclick = () => $('lang-modal').classList.remove('open');
$('lang-search').oninput = (e) => renderLangList(e.target.value);

// --- الأدوات الأساسية ---
$('btn-clear').onclick = () => {
  inputText.value = '';
  outputText.innerHTML = '<span style="color: #888; font-style: italic;">ستظهر الترجمة هنا...</span>';
  $('char-count').textContent = '0 / 5000';
};

inputText.oninput = () => {
  $('char-count').textContent = `${inputText.value.length} / 5000`;
};

function showToast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// الإعدادات
$('btn-settings').onclick = () => {
  $('api-key').value = state.apiKey;
  $('settings-modal').classList.add('open');
};
$('save-key').onclick = () => {
  state.apiKey = $('api-key').value.trim();
  localStorage.setItem('openai_key', state.apiKey);
  $('settings-modal').classList.remove('open');
  showToast('تم حفظ المفتاح بنجاح ✅');
};

// النسخ والتحميل
$('btn-copy').onclick = () => {
  navigator.clipboard.writeText(outputText.innerText);
  showToast('تم النسخ 📋');
};
$('btn-download').onclick = () => {
  const blob = new Blob([outputText.innerText], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'translation.txt';
  a.click();
};

// --- الترجمة بالذكاء الاصطناعي ---
$('btn-translate').onclick = async () => {
  const text = inputText.value.trim();
  if (!text) return showToast('⚠️ اكتب نصاً أولاً');
  if (!state.apiKey) {
    showToast('⚠️ يرجى إدخال مفتاح OpenAI أولاً');
    $('btn-settings').click();
    return;
  }

  statusText.textContent = '⏳ جاري الترجمة...';
  outputText.innerHTML = '<span style="color: #d4af37;">جاري المعالجة...</span>';

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: `أنت مترجم محترف. قم بترجمة النص التالي من لغة (${LANGUAGES[state.from].name}) إلى لغة (${LANGUAGES[state.to].name}). أخرج الترجمة فقط بدون أي كلام إضافي.` },
          { role: 'user', content: text }
        ]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    outputText.innerHTML = '';
    outputText.textContent = data.choices[0].message.content;
    statusText.textContent = '✅ تمت الترجمة بنجاح';
    
  } catch (error) {
    outputText.innerHTML = '';
    statusText.textContent = '❌ خطأ';
    showToast('فشل الاتصال: ' + error.message);
  }
};

// --- استيراد الملفات ---
$('btn-import').onclick = () => $('file-modal').classList.add('open');
$('file-close').onclick = () => $('file-modal').classList.remove('open');
$('file-input').onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    let text = ev.target.result;
    if (file.name.endsWith('.srt')) {
      text = text.replace(/\d+\n\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}\n/g, '').replace(/<[^>]*>?/gm, '');
    }
    inputText.value = text.trim();
    inputText.dispatchEvent(new Event('input'));
    $('file-modal').classList.remove('open');
    showToast('تم استيراد الملف بنجاح ✅');
  };
  reader.readAsText(file);
};

// --- الترجمة الصوتية ---
let recognition;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    $('voice-status').textContent = 'جاري الاستماع...';
    $('mic-circle').style.background = 'rgba(255, 0, 0, 0.2)';
    $('mic-circle').style.borderColor = 'red';
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    inputText.value = transcript;
    inputText.dispatchEvent(new Event('input'));
    showToast('تم التعرف على الصوت 🎤');
    $('voice-modal').classList.remove('open');
  };

  recognition.onerror = (event) => {
    showToast('خطأ في المايك: ' + event.error);
    $('voice-modal').classList.remove('open');
  };

  recognition.onend = () => {
    $('mic-circle').style.background = 'rgba(212,175,55,0.2)';
    $('mic-circle').style.borderColor = '#d4af37';
  };
}

$('btn-mic').onclick = () => {
  if (!recognition) return showToast('متصفحك لا يدعم الإدخال الصوتي');
  // استخدام كود الصوت الخاص باللغة المحددة
  recognition.lang = LANGUAGES[state.from].speech;
  recognition.start();
  $('voice-modal').classList.add('open');
};

$('voice-close').onclick = () => {
  if (recognition) recognition.stop();
  $('voice-modal').classList.remove('open');
};

// --- الاستماع (Text to Speech) ---
$('btn-speak').onclick = () => {
  const text = outputText.textContent;
  if (!text || text.includes('ستظهر الترجمة')) return showToast('لا يوجد نص');
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANGUAGES[state.to].speech;
  window.speechSynthesis.speak(utterance);
};

// تبديل المظهر
$('btn-theme').onclick = () => {
  document.body.classList.toggle('light');
  document.body.classList.toggle('dark');
};
