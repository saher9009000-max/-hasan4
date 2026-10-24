// قاموس اللغات
const languages = {
    auto: "🔍 اكتشاف تلقائي", ar: "🇸🇦 العربية", en: "🇺🇸 الإنجليزية", fr: "🇫🇷 الفرنسية",
    es: "🇪🇸 الإسبانية", de: "🇩🇪 الألمانية", it: "🇮🇹 الإيطالية", pt: "🇵🇹 البرتغالية",
    ru: "🇷🇺 الروسية", zh: "🇨🇳 الصينية", ja: "🇯🇵 اليابانية", ko: "🇰🇷 الكورية",
    tr: "🇹🇷 التركية", hi: "🇮🇳 الهندية", ur: "🇵🇰 الأردية", fa: "🇮🇷 الفارسية",
    nl: "🇳🇱 الهولندية", pl: "🇵🇱 البولندية", sv: "🇸🇪 السويدية", el: "🇬🇷 اليونانية",
    he: "🇮🇱 العبرية", th: "🇹🇭 التايلاندية", vi: "🇻🇳 الفيتنامية", id: "🇮🇩 الإندونيسية",
    uk: "🇺🇦 الأوكرانية", ro: "🇷🇴 الرومانية", da: "🇩🇰 الدنماركية", cs: "🇨🇿 التشيكية"
};

// عناصر DOM
const $ = id => document.getElementById(id);
const sourceLang = $('sourceLang'), targetLang = $('targetLang');
const sourceText = $('sourceText'), targetText = $('targetText');
const translateBtn = $('translateBtn'), swapBtn = $('swapBtn');
const clearBtn = $('clearBtn'), copyBtn = $('copyBtn');
const voiceBtn = $('voiceBtn'), speakSource = $('speakSource'), speakTarget = $('speakTarget');
const fileInput = $('fileInput'), charCount = $('charCount'), statusEl = $('status');
const themeToggle = $('themeToggle'), toast = $('toast'), aiToggle = $('aiToggle');
const historyBtn = $('historyBtn'), historyModal = $('historyModal'), historyList = $('historyList'), clearHistoryBtn = $('clearHistoryBtn');
const settingsBtn = $('settingsBtn'), settingsModal = $('settingsModal'), uxModeToggle = $('uxModeToggle');
const apiEndpoint = $('apiEndpoint'), apiKey = $('apiKey'), pasteKeyBtn = $('pasteKeyBtn'), testConnectionBtn = $('testConnectionBtn');
const modelsBtn = $('modelsBtn'), modelsModal = $('modelsModal'), modelsList = $('modelsList'), refreshModelsBtn = $('refreshModelsBtn'), currentModelName = $('currentModelName');
const closeBtns = document.querySelectorAll('.close-btn');

// تعبئة اللغات
Object.keys(languages).forEach(code => {
    if (code !== 'auto') {
        sourceLang.add(new Option(languages[code], code));
        targetLang.add(new Option(languages[code], code));
    }
});
sourceLang.value = 'ar'; targetLang.value = 'en';

// إعدادات الوضع الليلي والألوان
themeToggle.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    document.body.toggleAttribute('data-theme', !isDark);
    if (!isDark) {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.removeAttribute('data-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    }
});
if (localStorage.getItem('theme') === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}
document.querySelectorAll('.color-circle').forEach(c => c.addEventListener('click', () => {
    const color = c.getAttribute('data-color');
    if (color === 'purple') document.body.removeAttribute('data-color');
    else document.body.setAttribute('data-color', color);
    localStorage.setItem('themeColor', color);
}));
const savedColor = localStorage.getItem('themeColor');
if (savedColor && savedColor !== 'purple') document.body.setAttribute('data-color', savedColor);

// تبديل اللغات
swapBtn.addEventListener('click', () => {
    const temp = sourceLang.value;
    sourceLang.value = targetLang.value === 'auto' ? 'en' : targetLang.value;
    targetLang.value = temp;
});

// أحداث النص
sourceText.addEventListener('input', () => charCount.textContent = sourceText.value.length);
clearBtn.addEventListener('click', () => {
    sourceText.value = ''; targetText.value = ''; charCount.textContent = '0'; statusEl.textContent = '';
});
fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { sourceText.value = ev.target.result; charCount.textContent = sourceText.value.length; showToast('تم الاستيراد'); };
    reader.readAsText(file);
});
copyBtn.addEventListener('click', () => {
    if (!targetText.value) return;
    navigator.clipboard.writeText(targetText.value).then(() => showToast('تم النسخ'));
});

// الترجمة الصوتية
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const rec = new SpeechRecognition();
    rec.continuous = false;
    voiceBtn.addEventListener('click', () => {
        if (voiceBtn.classList.contains('recording')) { rec.stop(); return; }
        rec.lang = sourceLang.value === 'auto' ? 'ar-SA' : sourceLang.value;
        rec.start();
        voiceBtn.classList.add('recording');
        voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
        statusEl.textContent = 'جاري الاستماع...';
    });
    rec.onresult = e => { sourceText.value += e.results[0][0].transcript + ' '; charCount.textContent = sourceText.value.length; };
    rec.onend = () => { voiceBtn.classList.remove('recording'); voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>'; statusEl.textContent = ''; };
} else voiceBtn.style.display = 'none';

// الاستماع
speakSource.addEventListener('click', () => speak(sourceText.value, sourceLang.value === 'auto' ? 'ar' : sourceLang.value));
speakTarget.addEventListener('click', () => speak(targetText.value, targetLang.value));
function speak(text, lang) {
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    window.speechSynthesis.speak(u);
}

// إعدادات API
if (localStorage.getItem('apiEndpoint')) apiEndpoint.value = localStorage.getItem('apiEndpoint');
if (localStorage.getItem('apiKey')) apiKey.value = localStorage.getItem('apiKey');
apiEndpoint.addEventListener('change', () => localStorage.setItem('apiEndpoint', apiEndpoint.value));
apiKey.addEventListener('change', () => localStorage.setItem('apiKey', apiKey.value));

// زر اللصق (تم إصلاحه ليعمل حتى لو فشل المتصفح)
pasteKeyBtn.addEventListener('click', async () => {
    try {
        if (!navigator.clipboard) throw new Error('غير مدعوم');
        const text = await navigator.clipboard.readText();
        apiKey.value = text;
        localStorage.setItem('apiKey', text);
        showToast('تم اللصق بنجاح');
    } catch (err) {
        showToast('المتصفح يمنع اللصق التلقائي. يرجى اللصق يدوياً (Ctrl+V).');
        apiKey.focus();
    }
});

// اختبار الاتصال
testConnectionBtn.addEventListener('click', async () => {
    const ep = apiEndpoint.value.trim(), key = apiKey.value.trim();
    if (!ep || !key) { showToast('أدخل الرابط والمفتاح أولاً'); return; }
    testConnectionBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الاختبار...';
    testConnectionBtn.disabled = true;
    try {
        // تحويل الرابط من chat/completions إلى models للاختبار
        const baseEp = ep.replace('/chat/completions', '').replace(/\/$/, '');
        const res = await fetch(`${baseEp}/models`, { headers: { 'Authorization': `Bearer ${key}` } });
        if (res.ok) showToast('✅ الاتصال ناجح! المفتاح يعمل.');
        else showToast('❌ فشل الاتصال. تأكد من صحة المفتاح والرابط.');
    } catch (e) {
        showToast('❌ خطأ في الشبكة أو الرابط غير صحيح.');
    } finally {
        testConnectionBtn.innerHTML = '<i class="fas fa-wifi"></i> اختبار الاتصال';
        testConnectionBtn.disabled = false;
    }
});

// النماذج
modelsBtn.addEventListener('click', () => { modelsModal.classList.add('show'); loadModels(); });
refreshModelsBtn.addEventListener('click', loadModels);
async function loadModels() {
    const ep = apiEndpoint.value.trim(), key = apiKey.value.trim();
    if (!ep || !key) { modelsList.innerHTML = '<p class="empty-msg">أدخل إعدادات API أولاً.</p>'; return; }
    modelsList.innerHTML = '<p class="empty-msg"><i class="fas fa-spinner fa-spin"></i> جاري التحميل...</p>';
    try {
        const baseEp = ep.replace('/chat/completions', '').replace(/\/$/, '');
        const res = await fetch(`${baseEp}/models`, { headers: { 'Authorization': `Bearer ${key}` } });
        if (!res.ok) throw new Error();
        const data = await res.json();
        const models = data.data || data;
        modelsList.innerHTML = '';
        const current = localStorage.getItem('selectedModel') || '';
        models.forEach(m => {
            const id = m.id || m.name;
            const div = document.createElement('div');
            div.className = `model-item ${id === current ? 'selected' : ''}`;
            div.innerHTML = `<span>${id}</span><i class="fas fa-check m-check"></i>`;
            div.onclick = () => {
                localStorage.setItem('selectedModel',