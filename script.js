// ========== البيانات ==========
const languages = {
    auto: "🔍 اكتشاف تلقائي",
    ar: "🇸🇦 العربية", en: "🇺🇸 الإنجليزية", fr: "🇫🇷 الفرنسية",
    es: "🇪🇸 الإسبانية", de: "🇩🇪 الألمانية", it: "🇮🇹 الإيطالية",
    pt: "🇵🇹 البرتغالية", ru: "🇷🇺 الروسية", zh: "🇨🇳 الصينية",
    ja: "🇯🇵 اليابانية", ko: "🇰🇷 الكورية", tr: "🇹🇷 التركية",
    hi: "🇮🇳 الهندية", ur: "🇵🇰 الأردية", fa: "🇮🇷 الفارسية",
    nl: "🇳🇱 الهولندية", pl: "🇵🇱 البولندية", sv: "🇸🇪 السويدية",
    da: "🇩🇰 الدنماركية", fi: "🇫🇮 الفنلندية", no: "🇳🇴 النرويجية",
    el: "🇬🇷 اليونانية", he: "🇮🇱 العبرية", th: "🇹🇭 التايلاندية",
    vi: "🇻🇳 الفيتنامية", id: "🇮🇩 الإندونيسية", ms: "🇲🇾 الماليزية",
    uk: "🇺🇦 الأوكرانية", cs: "🇨🇿 التشيكية", ro: "🇷🇴 الرومانية",
    hu: "🇭🇺 المجرية", bg: "🇧🇬 البلغارية", sk: "🇸🇰 السلوفاكية",
    hr: "🇭🇷 الكرواتية", sr: "🇷🇸 الصربية", sl: "🇸🇮 السلوفينية",
    et: "🇪🇪 الإستونية", lv: "🇱🇻 اللاتفية", lt: "🇱🇹 الليتوانية",
    mt: "🇲🇹 المالطية", ga: "🇮🇪 الأيرلندية", cy: "🏴 الويلزية",
    ca: "🏴 الكتالونية", eu: "🏴 الباسكية", gl: "🏴 الجاليكية",
    af: "🇿🇦 الأفريكانية", sw: "🇰🇪 السواحيلية", am: "🇪🇹 الأمهرية",
    bn: "🇧🇩 البنغالية", ta: "🇮🇳 التاميلية", te: "🇮🇳 التيلوغوية",
    ml: "🇮🇳 المالايالامية", kn: "🇮🇳 الكانادية", gu: "🇮🇳 الغوجاراتية",
    mr: "🇮🇳 الماراثية", pa: "🇮🇳 البنجابية", ne: "🇳🇵 النيبالية",
    si: "🇱🇰 السنهالية", km: "🇰🇭 الخميرية", lo: "🇱🇦 اللاوية",
    my: "🇲🇲 البورمية", ka: "🇬🇪 الجورجية", hy: "🇦🇲 الأرمينية",
    az: "🇦🇿 الأذربيجانية", kk: "🇰🇿 الكازاخية", uz: "🇺🇿 الأوزبكية",
    mn: "🇲🇳 المنغولية", sq: "🇦🇱 الألبانية", mk: "🇲🇰 المقدونية",
    bs: "🇧🇦 البوسنية", is: "🇮🇸 الأيسلندية", lb: "🇱🇺 اللوكسمبورغية"
};

// ========== عناصر DOM ==========
const sourceLang = document.getElementById('sourceLang');
const targetLang = document.getElementById('targetLang');
const sourceText = document.getElementById('sourceText');
const targetText = document.getElementById('targetText');
const translateBtn = document.getElementById('translateBtn');
const swapBtn = document.getElementById('swapBtn');
const clearBtn = document.getElementById('clearBtn');
const pasteBtn = document.getElementById('pasteBtn');
const copyBtn = document.getElementById('copyBtn');
const speakSource = document.getElementById('speakSource');
const speakTarget = document.getElementById('speakTarget');
const shareBtn = document.getElementById('shareBtn');
const charCount = document.getElementById('charCount');
const status = document.getElementById('status');
const toast = document.getElementById('toast');
const themeToggle = document.getElementById('themeToggle');
const historyBtn = document.getElementById('historyBtn');
const historyPanel = document.getElementById('historyPanel');
const historyList = document.getElementById('historyList');
const clearHistory = document.getElementById('clearHistory');
const sourceLabel = document.getElementById('sourceLabel');
const targetLabel = document.getElementById('targetLabel');

// ========== تحميل اللغات ==========
function loadLanguages() {
    Object.entries(languages).forEach(([code, name]) => {
        if (code !== 'auto') {
            sourceLang.innerHTML += `<option value="${code}">${name}</option>`;
            targetLang.innerHTML += `<option value="${code}">${name}</option>`;
        }
    });
    sourceLang.value = 'ar';
    targetLang.value = 'en';
}

// ========== الترجمة ==========
async function translateText() {
    const text = sourceText.value.trim();
    if (!text) {
        showToast('⚠️ الرجاء إدخال نص للترجمة');
        sourceText.focus();
        return;
    }

    const from = sourceLang.value;
    const to = targetLang.value;

    if (from === to && from !== 'auto') {
        showToast('⚠️ اللغتان متطابقتان');
        return;
    }

    setStatus('جاري الترجمة...', 'loading');
    translateBtn.disabled = true;
    translateBtn.innerHTML = '<span class="loading-spinner"></span> جاري الترجمة...';

    try {
        let translated = await translateWithFallback(text, from, to);
        targetText.value = translated;
        setStatus('✓ تمت الترجمة بنجاح', 'success');
        saveToHistory(text, translated, from, to);
        showToast('✅ تمت الترجمة بنجاح');
    } catch (error) {
        console.error(error);
        setStatus('✗ فشلت الترجمة', 'error');
        showToast('❌ حدث خطأ، جرب مرة أخرى');
    } finally {
        translateBtn.disabled = false;
        translateBtn.innerHTML = '<i class="fas fa-language"></i> ترجم الآن';
    }
}

// ========== دوال API ==========
async function translateWithFallback(text, from, to) {
    // المحاولة 1: MyMemory API (مجاني بدون مفتاح)
    try {
        const src = from === 'auto' ? 'auto' : from;
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${src}|${to}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.responseData && data.responseData.translatedText) {
            const result = data.responseData.translatedText;
            if (!result.toLowerCase().includes('mymemory')) return result;
        }
    } catch (e) { console.warn('MyMemory failed:', e); }
