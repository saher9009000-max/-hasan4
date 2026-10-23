// ===== إعداد PDF.js =====
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// ===== عناصر =====
const $ = id => document.getElementById(id);
const sourceText = $('sourceText'), outputText = $('outputText');
const sourceLang = $('sourceLang'), targetLang = $('targetLang');
const translateBtn = $('translateBtn'), swapBtn = $('swapBtn');
const micBtn = $('micBtn'), importBtn = $('importBtn'), fileInput = $('fileInput');
const speakBtn = $('speakBtn'), copyBtn = $('copyBtn'), saveBtn = $('saveBtn'), clearBtn = $('clearBtn');
const charCount = $('charCount'), historyList = $('historyList'), clearHistoryBtn = $('clearHistory');
const themeToggle = $('themeToggle'), toast = $('toast');
const settingsBtn = $('settingsBtn'), settingsModal = $('settingsModal');
const authBtn = $('authBtn'), authModal = $('authModal');
const engineBadge = $('engineBadge');
const fileProgress = $('fileProgress'), progressFill = $('progressFill'), progressText = $('progressText');

let currentTranslation = '';
const LANG_NAMES = {
  ar: 'العربية', en: 'English', fr: 'Français', es: 'Español', de: 'Deutsch',
  tr: 'Türkçe', it: 'Italiano', ru: 'Русский', zh: '中文', ja: '日本語',
  ko: '한국어', hi: 'हिन्दी', ur: 'اردو', fa: 'فارسی', pt: 'Português',
  nl: 'Nederlands', pl: 'Polski', sv: 'Svenska', he: 'עברית', id: 'Bahasa', auto: 'تلقائي'
};
const SPEECH_LANG = {
  ar: 'ar-SA', en: 'en-US', fr: 'fr-FR', es: 'es-ES', de: 'de-DE',
  tr: 'tr-TR', it: 'it-IT', ru: 'ru-RU', zh: 'zh-CN', ja: 'ja-JP',
  ko: 'ko-KR', hi: 'hi-IN', ur: 'ur-PK', fa: 'fa-IR', pt: 'pt-PT',
  nl: 'nl-NL', pl: 'pl-PL', sv: 'sv-SE', he: 'he-IL', id: 'id-ID'
};

// ===== الحالة العامة =====
const state = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  engine: localStorage.getItem('engine') || 'mymemory',
  apiKey: localStorage.getItem('apiKey') || ''
};

// ===== Toast =====
function showToast(msg, color = '#6366f1') {
  toast.textContent = msg;
  toast.style.background = color;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== Theme =====
(function initTheme() {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
  }
})();
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ===== عدّاد الأحرف =====
sourceText.addEventListener('input', () => {
  const len = sourceText.value.length;
  charCount.textContent = `${len} / 5000`;
  if (len > 5000) {
    sourceText.value = sourceText.value.slice(0, 5000);
    charCount.textContent = '5000 / 5000';
  }
});

// ===== محرك الترجمة (موحّد) =====
async function translateText() {
  const text = sourceText.value.trim();
  if (!text) return showToast('⚠️ يرجى إدخال نص للترجمة', '#f59e0b');

  let from = sourceLang.value === 'auto' ? 'auto' : sourceLang.value;
  const to = targetLang.value;

  if (from === to && from !== 'auto') {
    outputText.textContent = text;
    currentTranslation = text;
    return;
  }
  if (from === 'auto') from = 'en'; // fallback

  translateBtn.classList.add('loading');
  translateBtn.querySelector('span').textContent = 'جارٍ الترجمة...';
  outputText.textContent = '⏳ جارٍ الترجمة...';

  try {
    let translated = '';
    switch (state.engine) {
      case 'openai':
        translated = await translateWithOpenAI(text, from, to);
        break;
      case 'deepl':
        translated = await translateWithDeepL(text, from, to);
        break;
      default:
        translated = await translateWithMyMemory(text, from, to);
    }

    if (!translated) throw new Error('empty');
    outputText.textContent = translated;
    currentTranslation = translated;
    addToHistory(text, translated, from, to);
    showToast('✅ تمت الترجمة', '#10b981');
  } catch (err) {
    console.error(err);
    outputText.textContent = '❌ فشلت الترجمة. تحقق من المفتاح أو الاتصال.';
    showToast('❌ فشلت الترجمة', '#ef4444');
  } finally {
    translateBtn.classList.remove('loading');
    translateBtn.querySelector('span').textContent = 'ترجم الآن';
  }
}

// MyMemory
async function translateWithMyMemory(text, from, to) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.responseData?.translatedText) throw new Error('no data');
  const txt = document.createElement('textarea');
  txt.innerHTML = data.responseData.translatedText;
  return txt.value;
}

// OpenAI
async function translateWithOpenAI(text, from, to) {
  if
