// 1. قاموس اللغات الكامل
const languages = {
    auto: "🔍 اكتشاف تلقائي", ar: "🇸🇦 العربية", en: "🇺🇸 الإنجليزية", fr: "🇫🇷 الفرنسية",
    es: "🇪🇸 الإسبانية", de: "🇩🇪 الألمانية", it: "🇮🇹 الإيطالية", pt: "🇵🇹 البرتغالية",
    ru: "🇷🇺 الروسية", zh: "🇨🇳 الصينية", ja: "🇯🇵 اليابانية", ko: "🇰🇷 الكورية",
    tr: "🇹🇷 التركية", hi: "🇮🇳 الهندية", ur: "🇵🇰 الأردية", fa: "🇮🇷 الفارسية",
    nl: "🇳🇱 الهولندية", pl: "🇵🇱 البولندية", sv: "🇸🇪 السويدية", el: "🇬🇷 اليونانية",
    he: "🇮🇱 العبرية", th: "🇹🇭 التايلاندية", vi: "🇻🇳 الفيتنامية", id: "🇮🇩 الإندونيسية"
};

// 2. جلب عناصر DOM
const sourceLang = document.getElementById('sourceLang');
const targetLang = document.getElementById('targetLang');
const sourceText = document.getElementById('sourceText');
const targetText = document.getElementById('targetText');
const translateBtn = document.getElementById('translateBtn');
const swapBtn = document.getElementById('swapBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const voiceBtn = document.getElementById('voiceBtn');
const speakSource = document.getElementById('speakSource');
const speakTarget = document.getElementById('speakTarget');
const fileInput = document.getElementById('fileInput');
const charCount = document.getElementById('charCount');
const statusEl = document.getElementById('status');
const themeToggle = document.getElementById('themeToggle');
const toast = document.getElementById('toast');

// 3. تعبئة قوائم اللغات
function populateLanguages() {
    for (const [code, name] of Object.entries(languages)) {
        if (code !== 'auto') {
            sourceLang.add(new Option(name, code));
            targetLang.add(new Option(name, code));
        }
    }
    sourceLang.value = 'ar';
    targetLang.value = 'en';
}
populateLanguages();

// 4. تبديل الوضع الليلي (Dark Mode)
themeToggle.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    if (isDark) {
        document.body.removeAttribute('data-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    } else {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    }
});

// استرجاع الوضع الليلي عند إعادة تحميل الصفحة
if (localStorage.getItem('theme') === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

// 5. تبديل اللغات (Swap)
swapBtn.addEventListener('click', () => {
    const temp = sourceLang.value;
    sourceLang.value = targetLang.value;
    targetLang.value = temp === 'auto' ? 'en' : temp; // إذا كان auto نجعله إنجليزي
});

// 6. عد حروف النص
sourceText.addEventListener('input', () => {
    charCount.textContent = sourceText.value.length;
});

// 7. مسح النص
clearBtn.addEventListener('click', () => {
    sourceText.value = '';
    targetText.value = '';
    charCount.textContent = '0';
    statusEl.textContent = '';
});

// 8. استيراد ملف TXT
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        sourceText.value = event.target.result;
        charCount.textContent = sourceText.value.length;
        showToast('تم استيراد الملف بنجاح');
    };
    reader.readAsText(file);
});

// 9. نسخ الترجمة
copyBtn.addEventListener('click', () => {
    if (!targetText.value) return;
    navigator.clipboard.writeText(targetText.value);
    showToast('تم نسخ الترجمة!');
});

// 10. الترجمة الصوتية (Speech to Text)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    voiceBtn.addEventListener('click', () => {
        if (voiceBtn.classList.contains('recording')) {
            recognition.stop();
            return;
        }
        // ضبط لغة التعرف حسب اللغة المختارة
        recognition.lang = sourceLang.value === 'auto' ? 'ar-SA' : sourceLang.value;
        recognition.start();
        voiceBtn.classList.add('recording');
        voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
        statusEl.textContent = 'جاري الاستماع...';
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        sourceText.value += transcript + ' ';
        charCount.textContent = sourceText.value.length;
    };

    recognition.onend = () => {
        voiceBtn.classList.remove('recording');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        statusEl.textContent = '';
    };

    recognition.onerror = () => {
        voiceBtn.classList.remove('recording');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        showToast('حدث خطأ في الميكروفون');
    };
} else {
    voiceBtn.style.display = 'none'; // إخفاء الزر إذا كان المتصفح لا يدعمه
}

// 11. الاستماع للنص (Text to Speech)
function speak(text, lang) {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
}

speakSource.addEventListener('click', () => {
    const lang = sourceLang.value === 'auto' ? 'ar' : sourceLang.value;
    speak(sourceText.value, lang);
});

speakTarget.addEventListener('click', () => {
    speak(targetText.value, targetLang.value);
});

// 12. الترجمة عبر API (MyMemory - مجاني)
async function doTranslate() {
    const text = sourceText.value.trim();
    if (!text) {
        showToast('الرجاء كتابة نص للترجمة');
        return;
    }

    let from = sourceLang.value;
    const to = targetLang.value;

    if (from === to) {
        showToast('اللغتان متطابقتان');
        return;
    }

    // جلب اللغة تلقائياً إذا اختار المستخدم Auto
    if (from === 'auto') from = 'ar'; // افتراضي كبداية

    statusEl.textContent = 'جاري الترجمة...';
    statusEl.className = 'status';
    translateBtn.disabled = true;
    translateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الترجمة...';

    try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.responseData && data.responseData.translatedText) {
            targetText.value = data.responseData.translatedText;
            statusEl.textContent = 'تمت الترجمة بنجاح';
            statusEl.classList.add('success');
        } else {
            throw new Error('فشل في الترجمة');
        }
    } catch (error) {
        statusEl.textContent = 'حدث خطأ أثناء الترجمة';
        statusEl.classList.add('error');
        targetText.value = '';
    } finally {
        translateBtn.disabled = false;
        translateBtn.innerHTML = '<i class="fas fa-language"></i> ترجم الآن';
    }
}

// ربط زر الترجمة بالحدث
translateBtn.addEventListener('click', doTranslate);

// الترجمة عند الضغط على Enter + Ctrl
sourceText.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') doTranslate();
});

// 13. دالة الإشعارات
let toastTimer;
function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}