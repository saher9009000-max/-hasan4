// === عناصر DOM ===
const $ = id => document.getElementById(id);
const dom = {
    src: $('sourceLang'), tgt: $('targetLang'), input: $('inputText'),
    output: $('outputText'), count: $('charCount'), btn: $('translateBtn'),
    swap: $('swapBtn'), clear: $('clearBtn'), copy: $('copyBtn'),
    speak: $('speakBtn'), mic: $('micBtn'), theme: $('themeToggle'),
    history: $('historyList'), clearHistory: $('clearHistoryBtn'),
    toast: $('toast'), status: $('statusText')
};

// === قائمة اللغات (أكثر من 100 لغة) ===
const languages = {
    'auto': '🌐 كشف تلقائي', 'ar': '🇸🇦 العربية', 'en': '🇺🇸 الإنجليزية', 'fr': '🇫🇷 الفرنسية',
    'es': '🇪🇸 الإسبانية', 'de': '🇩🇪 الألمانية', 'it': '🇮🇹 الإيطالية', 'ru': '🇷🇺 الروسية',
    'zh': '🇨🇳 الصينية', 'ja': '🇯🇵 اليابانية', 'ko': '🇰🇷 الكورية', 'pt': '🇵🇹 البرتغالية',
    'tr': '🇹🇷 التركية', 'nl': '🇳🇱 الهولندية', 'pl': '🇵🇱 البولندية', 'sv': '🇸🇪 السويدية',
    'da': '🇩🇰 الدنماركية', 'no': '🇳🇴 النرويجية', 'fi': '🇫🇮 الفنلندية', 'cs': '🇨🇿 التشيكية',
    'hu': '🇭🇺 المجرية', 'ro': '🇷🇴 الرومانية', 'el': '🇬🇷 اليونانية', 'he': '🇮🇱 العبرية',
    'hi': '🇮🇳 الهندية', 'ur': '🇵🇰 الأردية', 'fa': '🇮🇷 الفارسية', 'bn': '🇧🇩 البنغالية',
    'ta': '🇮🇳 التاميلية', 'te': '🇮🇳 التيلوغوية', 'ml': '🇮🇳 المالايالامية', 'th': '🇹🇭 التايلاندية',
    'vi': '🇻🇳 الفيتنامية', 'id': '🇮🇩 الإندونيسية', 'ms': '🇲🇾 الماليزية', 'tl': '🇵🇭 الفلبينية',
    'uk': '🇺🇦 الأوكرانية', 'bg': '🇧🇬 البلغارية', 'hr': '🇭🇷 الكرواتية', 'sk': '🇸🇰 السلوفاكية',
    'sl': '🇸🇮 السلوفينية', 'sr': '🇷🇸 الصربية', 'lt': '🇱🇹 الليتوانية', 'lv': '🇱🇻 اللاتفية',
    'et': '🇪🇪 الإستونية', 'af': '🇿🇦 الأفريكانية', 'sq': '🇦🇱 الألبانية', 'am': '🇪🇹 الأمهرية',
    'hy': '🇦🇲 الأرمنية', 'az': '🇦🇿 الأذربيجانية', 'eu': '🇪🇸 الباسكية', 'be': '🇧🇾 البيلاروسية',
    'bs': '🇧🇦 البوسنية', 'ca': '🇪🇸 الكاتالونية', 'ceb': '🇵🇭 السيبيونية', 'ny': '🇲🇼 الشيشيوا',
    'co': '🇫🇷 الكورسيكية', 'eo': '🌍 الإسبرانتو', 'fy': '🇳🇱 الفريزية', 'gl': '🇪🇸 الغاليسية',
    'ka': '🇬🇪 الجورجية', 'gu': '🇮🇳 الغوجاراتية', 'ht': '🇭🇹 الكريولية', 'ha': '🇳🇬 الهوسا',
    'haw': '🇺🇸 الهاوائية', 'hmn': '🇱🇦 الهمونغ', 'is': '🇮🇸 الأيسلندية', 'ig': '🇳🇬 الإيجبو',
    'ga': '🇮🇪 الأيرلندية', 'jv': '🇮🇩 الجاوية', 'kn': '🇮🇳 الكانادية', 'kk': '🇰🇿 الكازاخية',
    'km': '🇰🇭 الخميرية', 'rw': '🇷🇼 الكينيارواندا', 'ku': '🇹🇷 الكردية', 'ky': '🇰🇬 القرغيزية',
    'lo': '🇱🇦 اللاوية', 'la': '🏛️ اللاتينية', 'lb': '🇱🇺 اللوكسمبورغية', 'mk': '🇲🇰 المقدونية',
    'mg': '🇲🇬 الملغاشية', 'mt': '🇲🇹 المالطية', 'mi': '🇳🇿 الماورية', 'mr': '🇮🇳 الماراثية',
    'mn': '🇲🇳 المنغولية', 'my': '🇲🇲 البورمية', 'ne': '🇳🇵 النيبالية', 'or': '🇮🇳 الأورية',
    'ps': '🇦🇫 الباشتو', 'pa': '🇮🇳 البنجابية', 'sm': '🇼🇸 الساموية', 'gd': '🏴󠁧󠁢󠁳󠁣󠁴󠁿 الغيلية',
    'st': '🇱🇸 السوتو', 'sn': '🇿🇼 الشونا', 'sd': '🇵🇰 السندية', 'si': '🇱🇰 السنهالية',
    'so': '🇸🇴 الصومالية', 'su': '🇮🇩 السوندانية', 'sw': '🇰🇪 السواحيلية', 'tg': '🇹🇯 الطاجيكية',
    'tt': '🇷🇺 التتارية', 'tk': '🇹🇲 التركمانية', 'ug': '🇨🇳 الأويغورية', 'uz': '🇺🇿 الأوزبكية',
    'cy': '🏴󠁧󠁢󠁷󠁬󠁳󠁿 الويلزية', 'xh': '🇿🇦 الخوسا', 'yi': '🇮🇱 اليديشية', 'yo': '🇳🇬 اليوروبا', 'zu': '🇿🇦 الزولو'
};

// تعبئة القوائم
function populate() {
    for (const [code, name] of Object.entries(languages)) {
        dom.src.add(new Option(name, code));
        dom.tgt.add(new Option(name, code));
    }
    dom.src.value = 'auto';
    dom.tgt.value = 'en';
}
populate();

// === نظام الإشعارات (Toast) ===
function showToast(msg) {
    dom.toast.textContent = msg;
    dom.toast.classList.add('show');
    setTimeout(() => dom.toast.classList.remove('show'), 3000);
}

// === الوضع الداكن (Dark Mode) ===
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    dom.theme.innerHTML = '<i class="fas fa-sun"></i>';
}
dom.theme.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        dom.theme.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        localStorage.setItem('theme', 'light');
        dom.theme.innerHTML = '<i class="fas fa-moon"></i>';
    }
});

// === دالة الترجمة (API حقيقي) ===
async function translateText(text, from, to) {
    if (from === 'auto') from = 'ar'; // افتراضي إذا كان الكشف التلقائي
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
        return data.responseData.translatedText;
    }
    throw new Error('فشل الاتصال بخادم الترجمة');
}

// === زر الترجمة ===
dom.btn.addEventListener('click', async () => {
    const text = dom.input.value.trim();
    if (!text) return showToast('⚠️ يرجى كتابة نص أولاً');
    if (dom.src.value === dom.tgt.value) return showToast('⚠️ اللغتان متطابقتان');

    dom.btn.disabled = true;
    dom.btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الترجمة...';
    dom.output.value = '';

    try {
        const translated = await translateText(text, dom.src.value, dom.tgt.value);
        dom.output.value = translated;
        showToast('✅ تمت الترجمة بنجاح');
        saveToHistory(text, translated, dom.src.value, dom.tgt.value);
    } catch (error) {
        showToast('❌ خطأ: ' + error.message);
    } finally {
        dom.btn.disabled = false;
        dom.btn.innerHTML = '<i class="fas fa-robot"></i> ترجم بالذكاء الاصطناعي';
    }
});

// === عداد الأحرف ===
dom.input.addEventListener('input', () => {
    dom.count.textContent = `${dom.input.value.length} / 5000`;
});

// === تبديل اللغات ===
dom.swap.addEventListener('click', () => {
    if (dom.src.value === 'auto') return showToast('⚠️ لا يمكن تبديل الكشف التلقائي');
    [dom.src.value, dom.tgt.value] = [dom.tgt.value, dom.src.value];
    [dom.input.value, dom.output.value] = [dom.output.value, dom.input.value];
});

// === مسح النص ===
dom.clear.addEventListener('click', () => {
    dom.input.value = ''; dom.output.value = ''; dom.count.textContent = '0 / 5000';
});

// === نسخ الترجمة ===
dom.copy.addEventListener('click', () => {
    if (!dom.output.value) return;
    navigator.clipboard.writeText(dom.output.value);
    showToast('📋 تم نسخ الترجمة');
});

// === النطق الصوتي (AI Voice) ===
dom.speak.addEventListener('click', () => {
    if (!dom.output.value) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(dom.output.value);
    utterance.lang = dom.tgt.value === 'auto' ? 'ar-SA' : dom.tgt.value;
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
});

// === الترجمة الصوتية (Speech Recognition) ===
let recognition;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => {
        dom.mic.classList.add('recording');
        showToast('🎙️ جاري الاستماع...');
    };
    recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        dom.input.value = transcript;
        dom.count.textContent = `${transcript.length} / 5000`;
        dom.mic.classList.remove('recording');
        
        // ترجمة تلقائية بعد التعرف على الصوت
        dom.btn.click();
    };
    recognition.onerror = () => {
        dom.mic.classList.remove('recording');
        showToast('❌ لم يتم التعرف على الصوت');
    };
    recognition.onend = () => dom.mic.classList.remove('recording');
}

dom.mic.addEventListener('click', () => {
    if (!recognition) return showToast('⚠️ متصفحك لا يدعم الإدخال الصوتي');
    recognition.lang = dom.src.value === 'auto' ? 'ar-SA' : dom.src.value;
    recognition.start();
});

// === سجل الترجمة (History) ===
function getHistory() {
    return JSON.parse(localStorage.getItem('translationHistory')) || [];
}
function saveToHistory(original, translated, from, to) {
    const history = getHistory();
    history.unshift({ original, translated, from, to, time: Date.now() });
    // الاحتفاظ بآخر 10 ترجمات فقط
    localStorage.setItem('translationHistory', JSON.stringify(history.slice(0, 10)));
    renderHistory();
}
function renderHistory() {
    const history = getHistory();
    if (history.length === 0) {
        dom.history.innerHTML = '<p class="empty-history">لا يوجد سجل ترجمة بعد.</p>';
        return;
    }
    dom.history.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="langs">${languages[item.from]} ➔ ${languages[item.to]}</div>
            <div class="original">${item.original.substring(0, 50)}${item.original.length > 50 ? '...' : ''}</div>
            <div class="translated">${item.translated}</div>
        </div>
    `).join('');
}
dom.clearHistory.addEventListener('click', () => {
    localStorage.removeItem('translationHistory');
    renderHistory();
    showToast('🗑️ تم مسح السجل');
});

// تحميل السجل عند فتح الصفحة
renderHistory();
