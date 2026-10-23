/* ============================================================
   LinguaAI — الترجمة الاحترافية
   ============================================================ */

// ===== قائمة اللغات (50+) =====
const LANGUAGES = [
  { code: 'auto', name: 'اكتشاف تلقائي', flag: '🔍', speech: null },
  { code: 'ar', name: 'العربية',       flag: '🇸🇦', speech: 'ar-SA' },
  { code: 'en', name: 'English',       flag: '🇺🇸', speech: 'en-US' },
  { code: 'fr', name: 'Français',      flag: '🇫🇷', speech: 'fr-FR' },
  { code: 'es', name: 'Español',       flag: '🇪🇸', speech: 'es-ES' },
  { code: 'de', name: 'Deutsch',       flag: '🇩🇪', speech: 'de-DE' },
  { code: 'tr', name: 'Türkçe',        flag: '🇹🇷', speech: 'tr-TR' },
  { code: 'it', name: 'Italiano',      flag: '🇮🇹', speech: 'it-IT' },
  { code: 'ru', name: 'Русский',       flag: '🇷🇺', speech: 'ru-RU' },
  { code: 'zh', name: '中文',           flag: '🇨🇳', speech: 'zh-CN' },
  { code: 'ja', name: '日本語',          flag: '🇯🇵', speech: 'ja-JP' },
  { code: 'ko', name: '한국어',          flag: '🇰🇷', speech: 'ko-KR' },
  { code: 'hi', name: 'हिन्दी',          flag: '🇮🇳', speech: 'hi-IN' },
  { code: 'ur', name: 'اردو',          flag: '🇵🇰', speech: 'ur-PK' },
  { code: 'fa', name: 'فارسی',          flag: '🇮🇷', speech: 'fa-IR' },
  { code: 'pt', name: 'Português',     flag: '🇵🇹', speech: 'pt-PT' },
  { code: 'nl', name: 'Nederlands',    flag: '🇳🇱', speech: 'nl-NL' },
  { code: 'pl', name: 'Polski',        flag: '🇵🇱', speech: 'pl-PL' },
  { code: 'sv', name: 'Svenska',       flag: '🇸🇪', speech: 'sv-SE' },
  { code: 'he', name: 'עברית',          flag: '🇮🇱', speech: 'he-IL' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩', speech: 'id-ID' },
  { code: 'th', name: 'ไทย',           flag: '🇹🇭', speech: 'th-TH' },
  { code: 'vi', name: 'Tiếng Việt',    flag: '🇻🇳', speech: 'vi-VN' },
  { code: 'uk', name: 'Українська',    flag: '🇺🇦', speech: 'uk-UA' },
  { code: 'ro', name: 'Română',        flag: '🇷🇴', speech: 'ro-RO' },
  { code: 'el', name: 'Ελληνικά',      flag: '🇬🇷', speech: 'el-GR' },
  { code: 'cs', name: 'Čeština',       flag: '🇨🇿', speech: 'cs-CZ' },
  { code: 'da', name: 'Dansk',         flag: '🇩🇰', speech: 'da-DK' },
  { code: 'fi', name: 'Suomi',         flag: '🇫🇮', speech: 'fi-FI' },
  { code: 'no', name: 'Norsk',         flag: '🇳🇴', speech: 'nb-NO' },
  { code: 'hu', name: 'Magyar',        flag: '🇭🇺', speech: 'hu-HU' },
  { code: 'bg', name: 'Български',     flag: '🇧🇬', speech: 'bg-BG' },
  { code: 'sk', name: 'Slovenčina',    flag: '🇸🇰', speech: 'sk-SK' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾', speech: 'ms-MY' },
  { code: 'ta', name: 'தமிழ்',         flag: '🇱🇰', speech: 'ta-IN' },
  { code: 'bn', name: 'বাংলা',          flag: '🇧🇩', speech: 'bn-BD' },
  { code: 'az', name: 'Azərbaycan',    flag: '🇦🇿', speech: 'az-AZ' },
  { code: 'ka', name: 'ქართული',       flag: '🇬🇪', speech: 'ka-GE' },
  { code: 'hy', name: 'Հայերեն',       flag: '🇦🇲', speech: 'hy-AM' },
  { code: 'sq', name: 'Shqip',         flag: '🇦🇱', speech: 'sq-AL' },
  { code: 'sr', name: 'Српски',        flag: '🇷🇸', speech: 'sr-RS' },
  { code: 'hr', name: 'Hrvatski',      flag: '🇭🇷', speech: 'hr-HR' },
  { code: 'lt', name: 'Lietuvių',      flag: '🇱🇹', speech: 'lt-LT' },
  { code: 'lv', name: 'Latviešu',      flag: '🇱🇻', speech: 'lv-LV' },
  { code: 'et', name: 'Eesti',         flag: '🇪🇪', speech: 'et-EE' },
  { code: 'sl', name: 'Slovenščina',   flag: '🇸🇮', speech: 'sl-SI' },
  { code: 'ca', name: 'Català',        flag: '🏴', speech: 'ca-ES' },
  { code: 'af', name: 'Afrikaans',     flag: '🇿🇦', speech: 'af-ZA' },
  { code: 'sw', name: 'Kiswahili',     flag: '🇰🇪', speech: 'sw-KE' },
  { code: 'tl', name: 'Filipino',      flag: '🇵🇭', speech: 'fil-PH' },
];

// ===== اختصارات DOM =====
const $ = (id) => document.getElementById(id);
const sourceLang = $('sourceLang');
const targetLang = $('targetLang');
const sourceText = $('sourceText');
const outputText = $('outputText');
const translateBtn = $('translateBtn');
const swapBtn = $('swapBtn');
const micBtn = $('micBtn');
const importBtn = $('importBtn');
const fileInput = $('fileInput');
const speakBtn = $('speakBtn');
const copyBtn = $('copyBtn');
const saveBtn = $('saveBtn');
const clearBtn = $('clearBtn');
const charCount = $('charCount');
const historyList = $('historyList');
const clearHistoryBtn = $('clearHistory');
const themeToggle = $('themeToggle');
const themeIcon = $('themeIcon');
const toast = $('toast');
const progressWrap = $('progressWrap');
const progressFill = $('progressFill');
const progressText = $('progressText');

// ===== الحالة (الترجمات في الذاكرة فقط — تُمسح عند الخروج) =====
let history = [];      // في الذاكرة — لا يُحفظ
let currentTranslation = '';

// ===== إعداد PDF.js =====
if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

// ===== Toast =====
function showToast(msg, type = 'info') {
  toast.textContent = msg;
  toast.className = 'toast ' + type + ' show';
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 2600);
}

// ===== الوضع الليلي =====
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  document.querySelector('.theme-label').textContent =
    theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الليلي';
}
(function initTheme() {
  const saved = localStorage.getItem('lingua_theme') || 'light';
  applyTheme(saved);
})();
themeToggle.addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('lingua_theme', next);
});

// ===== تعبئة قوائم اللغات =====
function populateLanguages() {
  sourceLang.innerHTML = LANGUAGES.map(l =>
    `<option value="${l.code}">${l.flag} ${l.name}</option>`
  ).join('');

  targetLang.innerHTML = LANGUAGES
    .filter(l => l.code !== 'auto')
    .map(l => `<option value="${l.code}">${l.flag} ${l.name}</option>`)
    .join('');

  // استرجاع الاختيار السابق (تفضيلات الواجهة — مسموح حفظها)
  sourceLang.value = localStorage.getItem('lingua_src') || 'auto';
  targetLang.value = localStorage.getItem('lingua_tgt') || 'en';

  sourceLang.addEventListener('change', () =>
    localStorage.setItem('lingua_src', sourceLang.value));
  targetLang.addEventListener('change', () =>
    localStorage.setItem('lingua_tgt', targetLang.value));
}
populateLanguages();

// ===== عدّاد الأحرف =====
function updateCharCount() {
  const len = sourceText.value.length;
  charCount.textContent = len;
  if (len > 5000) {
    sourceText.value = sourceText.value.slice(0, 5000);
    charCount.textContent = 5000;
  }
}
sourceText.addEventListener('input', updateCharCount);

// ===== تبديل اللغات (حقيقي) =====
swapBtn.addEventListener('click', () => {
  const from = sourceLang.value;
  const to = targetLang.value;
  const sourceContent = sourceText.value;
  const translatedContent = currentTranslation;

  if (from === 'auto') {
    // لا يمكن عكس auto — اضبط لغة المصدر على الهدف، والهدف على لغة منطقية
    sourceLang.value = to;
    targetLang.value = (to === 'en') ? 'ar' : 'en';
    showToast(`تم ضبط اللغة: ${LANGUAGES.find(l => l.code === to).name} ← ${LANGUAGES.find(l => l.code === targetLang.value).name}`);
  } else {
    sourceLang.value = to;
    targetLang.value = from;
    showToast('تم تبديل اللغات');
  }

  // تبديل النصوص أيضاً
  if (translatedContent) {
    sourceText.value = translatedContent;
    outputText.textContent = sourceContent || 'الترجمة ستظهر هنا...';
    outputText.classList.toggle('placeholder', !sourceContent);
    currentTranslation = sourceContent || '';
  }
  updateCharCount();
  localStorage.setItem('lingua_src', sourceLang.value);
  localStorage.setItem('lingua_tgt', targetLang.value);
});

// ===== محرك الترجمة (MyMemory — مجاني وبدون مفتاح) =====
async function translateWithAI(text, from, to) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('network');
  const data = await res.json();

  if (data.responseData && data.responseData.translatedText) {
    // فك ترميز HTML entities
    const tmp = document.createElement('textarea');
    tmp.innerHTML = data.responseData.translatedText;
    return tmp.value;
  }
  throw new Error('no_translation');
}

// ===== الترجمة الرئيسية =====
async function doTranslate() {
  const text = sourceText.value.trim();
  if (!text) {
    showToast('⚠️ يرجى إدخال نص للترجمة', 'warn');
    sourceText.focus();
    return;
  }

  let from = sourceLang.value;
  const to = targetLang.value;

  if (from === 'auto') from = 'en'; // fallback
  if (from === to) {
    outputText.textContent = text;
    outputText.classList.remove('placeholder');
    currentTranslation = text;
    return;
  }

  translateBtn.classList.add('loading');
  translateBtn.querySelector('span').textContent = 'جارٍ الترجمة...';
  outputText.textContent = '... جارٍ الترجمة بالذكاء الاصطناعي';
  outputText.classList.add('placeholder');

  try {
    const translated = await translateWithAI(text, from, to);
    outputText.textContent = translated;
    outputText.classList.remove('placeholder');
    currentTranslation = translated;
    addToHistory(text, translated, from, to);
    showToast('✅ تمت الترجمة بنجاح', 'success');
  } catch (err) {
    console.error(err);
    outputText.textContent = '❌ عذراً، فشلت الترجمة. تحقق من اتصال الإنترنت وحاول مجدداً.';
    outputText.classList.add('placeholder');
    showToast('❌ فشلت الترجمة', 'error');
  } finally {
    translateBtn.classList.remove('loading');
    translateBtn.querySelector('span').textContent = 'ترجم بالذكاء الاصطناعي';
  }
}
translateBtn.addEventListener('click', doTranslate);

// اختصار Ctrl+Enter
sourceText.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'Enter') doTranslate();
});

// ===== ترجمة صوتية (Speech Recognition) =====
let recognition = null;
micBtn.addEventListener('click', () => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    showToast('❌ متصفحك لا يدعم الترجمة الصوتية. جرّب Chrome أو Edge', 'error');
    return;
  }
  if (micBtn.classList.contains('recording')) {
    recognition && recognition.stop();
    return;
  }

  const from = sourceLang.value === 'auto' ? 'ar' : sourceLang.value;
  const speechLang = (LANGUAGES.find(l => l.code === from) || {}).speech || 'ar-SA';

  recognition = new SR();
  recognition.lang = speechLang;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  micBtn.classList.add('recording');
  micBtn.querySelector('span').textContent = 'يستمع...';
  showToast('🎤 تحدّث الآن...', 'info');

  recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    sourceText.value = transcript;
    updateCharCount();
    showToast('✅ تم التعرف على الصوت', 'success');
    setTimeout(doTranslate, 250);
  };
  recognition.onerror = (e) => {
    if (e.error !== 'aborted' && e.error !== 'no-speech')
      showToast('❌ خطأ في الميكروفون: ' + e.error, 'error');
  };
  recognition.onend = () => {
    micBtn.classList.remove('recording');
    micBtn.querySelector('span').textContent = 'صوتي';
  };

  try { recognition.start(); }
  catch (_) { micBtn.classList.remove('recording'); }
});

// ===== استيراد الملفات =====
importBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) handleFile(file);
});

async function handleFile(file) {
  const name = file.name.toLowerCase();
  if (file.size > 5 * 1024 * 1024) {
    showToast('⚠️ حجم الملف كبير (الحد 5 ميجا)', 'warn');
    fileInput.value = '';
    return;
  }

  setProgress(true, 10, 'جارٍ قراءة الملف...');

  try {
    let text = '';
    if (name.endsWith('.txt')) {
      text = await file.text();
    } else if (name.endsWith('.pdf')) {
      if (!window.pdfjsLib) throw new Error('مكتبة PDF غير متاحة');
      text = await readPDF(file);
    } else if (name.endsWith('.docx')) {
      if (!window.mammoth) throw new Error('مكتبة DOCX غير متاحة');
      text = await readDocx(file);
    } else {
      throw new Error('صيغة غير مدعومة (استخدم txt/pdf/docx)');
    }

    text = text.trim().replace(/\s+/g, ' ');
    if (!text) throw new Error('الملف فارغ');

    if (text.length > 5000) {
      text = text.slice(0, 5000);
      showToast('⚠️ تم اقتطاع النص إلى 5000 حرف', 'warn');
    }

    sourceText.value = text;
    updateCharCount();
    showToast('✅ تم استيراد الملف بنجاح', 'success');
  } catch (err) {
    console.error(err);
    showToast('❌ ' + err.message, 'error');
  } finally {
    setProgress(false);
    fileInput.value = '';
  }
}

async function readPDF(file) {
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  let text = '';
  const maxPages = Math.min(pdf.numPages, 15);
  for (let i = 1; i <= maxPages; i++) {
    setProgress(true, 10 + (i / maxPages) * 85, `جارٍ قراءة صفحة ${i}/${maxPages}`);
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(x => x.str).join(' ') + '\n';
    if (text.length > 5000) break;
  }
  return text;
}

async function readDocx(file) {
  const buf = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buf });
  return result.value;
}

function setProgress(visible, percent = 0, label = '') {
  progressWrap.hidden = !visible;
  if (visible) {
    progressFill.style.width = percent + '%';
    progressText.textContent = label;
  } else {
    progressFill.style.width = '0%';
  }
}

// ===== استماع للترجمة =====
speakBtn.addEventListener('click', () => {
  if (!currentTranslation) {
    showToast('⚠️ لا توجد ترجمة للاستماع', 'warn');
    return;
  }
  if (!('speechSynthesis' in window)) {
    showToast('❌ متصفحك لا يدعم النطق', 'error');
    return;
  }
  const to = targetLang.value;
  const speechLang = (LANGUAGES.find(l => l.code === to) || {}).speech || 'ar-SA';
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(currentTranslation);
  utter.lang = speechLang;
  utter.rate = 0.95;
  utter.pitch = 1;
  speechSynthesis.speak(utter);
});

// ===== نسخ =====
copyBtn.addEventListener('click', async () => {
  if (!currentTranslation) {
    showToast('⚠️ لا يوجد نص لنسخه', 'warn');
    return;
  }
  try {
    await navigator.clipboard.writeText(currentTranslation);
    showToast('📋 تم النسخ إلى الحافظة', 'success');
  } catch {
    showToast('❌ فشل النسخ', 'error');
  }
});

// ===== مسح =====
clearBtn.addEventListener('click', () => {
  sourceText.value = '';
  outputText.textContent = 'الترجمة ستظهر هنا...';
  outputText.classList.add('placeholder');
  currentTranslation = '';
  updateCharCount();
  sourceText.focus();
});

// ===== السجل (في الذاكرة — يُمسح عند الخروج) =====
function addToHistory(original, translated, from, to) {
  history.unshift({
    id: Date.now() + Math.random(),
    original,
    translated,
    from,
    to,
    time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
  });
  if (history.length > 30) history.pop();
  renderHistory();
}

function renderHistory() {
  if (history.length === 0) {
    historyList.innerHTML = '<p class="empty-history">لا توجد ترجمات بعد</p>';
    return;
  }
  const langName = (code) => (LANGUAGES.find(l => l.code === code) || {}).name || code;

  historyList.innerHTML = history.map(item => `
    <div class="history-item" data-id="${item.id}">
      <button class="del" title="حذف">×</button>
      <div class="meta">
        <span>${langName(item.from)}</span>
        <span class="arrow">→</span>
        <span>${langName(item.to)}</span>
        <span style="margin-right:auto">${item.time}</span>
      </div>
      <div class="original">${escapeHtml(item.original)}</div>
      <div class="translated">${escapeHtml(item.translated)}</div>
    </div>
  `).join('');

  // مستمعات الحذف
  historyList.querySelectorAll('.del').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseFloat(e.target.closest('.history-item').dataset.id);
      history = history.filter(h => h.id !== id);
      renderHistory();
    });
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

saveBtn.addEventListener('click', () => {
  if (!currentTranslation) {
    showToast('⚠️ لا توجد ترجمة للحفظ', 'warn');
    return;
  }
  addToHistory(sourceText.value.trim(), currentTranslation, sourceLang.value, targetLang.value);
  showToast('💾 تم الحفظ في السجل', 'success');
});

clearHistoryBtn.addEventListener('click', () => {
  if (!history.length) return;
  if (confirm('هل تريد مسح كل السجل؟')) {
    history = [];
    renderHistory();
    showToast('🗑️ تم مسح السجل', 'success');
  }
});

// ===== تهيئة أولية =====
outputText.classList.add('placeholder');
updateCharCount();
setTimeout(() => showToast('👋 مرحباً بك في LinguaAI', 'info'), 400);
