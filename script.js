// ==========================================
// 1. بيانات ثابتة (اللغات)
// ==========================================
const languages = {
    auto: "🔍 اكتشاف تلقائي", ar: "🇸🇦 العربية", en: "🇺🇸 الإنجليزية", fr: "🇫🇷 الفرنسية",
    es: "🇪🇸 الإسبانية", de: "🇩🇪 الألمانية", it: "🇮🇹 الإيطالية", pt: "🇵🇹 البرتغالية",
    ru: "🇷🇺 الروسية", zh: "🇨🇳 الصينية", ja: "🇯🇵 اليابانية", ko: "🇰🇷 الكورية",
    tr: "🇹🇷 التركية", hi: "🇮🇳 الهندية", ur: "🇵🇰 الأردية", fa: "🇮🇷 الفارسية",
    nl: "🇳🇱 الهولندية", pl: "🇵🇱 البولندية", sv: "🇸🇪 السويدية", el: "🇬🇷 اليونانية",
    he: "🇮🇱 العبرية", th: "🇹🇭 التايلاندية", vi: "🇻🇳 الفيتنامية", id: "🇮🇩 الإندونيسية"
};

// ==========================================
// 2. عناصر DOM
// ==========================================
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

// ==========================================
// 3. تعبئة اللغات
// ==========================================
Object.keys(languages).forEach(code => {
    if (code !== 'auto') {
        sourceLang.add(new Option(languages[code], code));
        targetLang.add(new Option(languages[code], code));
    }
});
sourceLang.value = 'ar'; targetLang.value = 'en';

// ==========================================
// 4. إعدادات المظهر (الوضع الليلي والألوان)
// ==========================================
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
if (localStorage.getItem('theme') === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

document.querySelectorAll('.color-circle').forEach(circle => {
    circle.addEventListener('click', () => {
        const color = circle.getAttribute('data-color');
        if (color === 'purple') document.body.removeAttribute('data-color');
        else document.body.setAttribute('data-color', color);
        localStorage.setItem('themeColor', color);
    });
});
const savedColor = localStorage.getItem('themeColor');
if (savedColor && savedColor !== 'purple') document.body.setAttribute('data-color', savedColor);

// ==========================================
// 5. أدوات النص والوظائف الأساسية
// ==========================================
swapBtn.addEventListener('click', () => {
    const temp = sourceLang.value;
    sourceLang.value = targetLang.value === 'auto' ? 'en' : targetLang.value;
    targetLang.value = temp;
});

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

// الترجمة الصوتية (الميكروفون)
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

// الاستماع النصي (Text to Speech)
speakSource.addEventListener('click', () => speak(sourceText.value, sourceLang.value === 'auto' ? 'ar' : sourceLang.value));
speakTarget.addEventListener('click', () => speak(targetText.value, targetLang.value));
function speak(text, lang) {
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    window.speechSynthesis.speak(u);
}

// ==========================================
// 6. إدارة إعدادات API (الحفظ والاسترجاع)
// ==========================================
if (localStorage.getItem('apiEndpoint')) apiEndpoint.value = localStorage.getItem('apiEndpoint');
if (localStorage.getItem('apiKey')) apiKey.value = localStorage.getItem('apiKey');
if (localStorage.getItem('selectedModel')) currentModelName.textContent = localStorage.getItem('selectedModel');

apiEndpoint.addEventListener('change', () => localStorage.setItem('apiEndpoint', apiEndpoint.value));
apiKey.addEventListener('change', () => localStorage.setItem('apiKey', apiKey.value));

// زر اللصق
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

// ==========================================
// 7. اختبار الاتصال (يفحص الرابط والمفتاح)
// ==========================================
testConnectionBtn.addEventListener('click', async () => {
    let ep = apiEndpoint.value.trim();
    const key = apiKey.value.trim();
    if (!ep || !key) { showToast('أدخل الرابط والمفتاح أولاً'); return; }
    
    // إزالة اللاحقة إن وجدت لجلب النماذج بشكل صحيح
    ep = ep.replace(/\/chat\/completions\/?$/, '').replace(/\/$/, '');

    testConnectionBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الاختبار...';
    testConnectionBtn.disabled = true;
    
    try {
        const res = await fetch(`${ep}/models`, { headers: { 'Authorization': `Bearer ${key}` } });
        if (res.ok) {
            showToast('✅ الاتصال ناجح! المفتاح يعمل.');
            // حفظ الرابط الأساسي بعد إزالة اللاحقة
            apiEndpoint.value = ep;
            localStorage.setItem('apiEndpoint', ep);
        } else {
            const err = await res.json();
            showToast(`❌ فشل: ${err.error?.message || 'تأكد من المفتاح'}`);
        }
    } catch (e) {
        showToast('❌ خطأ في الشبكة أو الرابط غير صحيح.');
    } finally {
        testConnectionBtn.innerHTML = '<i class="fas fa-wifi"></i> اختبار الاتصال';
        testConnectionBtn.disabled = false;
    }
});

// ==========================================
// 8. جلب النماذج ديناميكياً (Dynamic Fetching)
// ==========================================
modelsBtn.addEventListener('click', () => { modelsModal.classList.add('show'); loadModels(); });
refreshModelsBtn.addEventListener('click', loadModels);

async function loadModels() {
    let ep = apiEndpoint.value.trim();
    const key = apiKey.value.trim();
    
    if (!ep || !key) { 
        modelsList.innerHTML = '<p class="empty-msg">يرجى إدخال إعدادات API من زر الإعدادات أولاً.</p>'; 
        return; 
    }

    ep = ep.replace(/\/chat\/completions\/?$/, '').replace(/\/$/, '');
    modelsList.innerHTML = '<p class="empty-msg"><i class="fas fa-spinner fa-spin"></i> جاري تحميل النماذج...</p>';

    try {
        const res = await fetch(`${ep}/models`, { headers: { 'Authorization': `Bearer ${key}` } });
        if (!res.ok) throw new Error('فشل جلب النماذج');
        
        const data = await res.json();
        const models = data.data || data; // دعم Groq, OpenAI, OpenRouter
        
        if (!models || models.length === 0) {
            modelsList.innerHTML = '<p class="empty-msg">لا توجد نماذج متاحة لهذا الحساب.</p>';
            return;
        }

        modelsList.innerHTML = '';
        const current = localStorage.getItem('selectedModel') || '';

        models.forEach(m => {
            const id = m.id || m.name;
            const div = document.createElement('div');
            div.className = `model-item ${id === current ? 'selected' : ''}`;
            div.innerHTML = `<span>${id}</span><i class="fas fa-check m-check"></i>`;
            div.onclick = () => {
                localStorage.setItem('selectedModel', id);
                currentModelName.textContent = id;
                showToast(`تم اختيار: ${id}`);
                modelsModal.classList.remove('show');
            };
            modelsList.appendChild(div);
        });
        
        if (current) currentModelName.textContent = current;

    } catch (e) {
        modelsList.innerHTML = '<p class="empty-msg">فشل جلب النماذج. تأكد من الرابط والمفتاح.</p>';
    }
}

// ==========================================
// 9. دالة الترجمة (تدعم الـ API المخصص)
// ==========================================
async function doTranslate() {
    const text = sourceText.value.trim();
    if (!text) { showToast('اكتب نصاً أولاً'); return; }

    let from = sourceLang.value, to = targetLang.value;
    if (from === to) { showToast('اللغتان متطابقتان'); return; }
    if (from === 'auto') from = 'ar';

    const isAI = aiToggle.checked;
    statusEl.textContent = isAI ? 'جاري التفكير...' : 'جاري الترجمة...'; 
    statusEl.className = 'status';
    translateBtn.disabled = true;
    translateBtn.innerHTML = isAI ? '<i class="fas fa-brain fa-spin"></i> جاري التفكير...' : '<i class="fas fa-spinner fa-spin"></i> جاري الترجمة...';

    try {
        let translatedText = "";

        if (isAI) {
            let ep = apiEndpoint.value.trim();
            const key = apiKey.value.trim();
            const model = localStorage.getItem('selectedModel');

            if (!ep || !key) throw new Error('يرجى إعداد API من الإعدادات');
            if (!model) throw new Error('يرجى اختيار نموذج من زر النماذج');

            // التأكد من أن الرابط ينتهي بـ /chat/completions
            ep = ep.replace(/\/chat\/completions\/?$/, '').replace(/\/$/, '');
            const fullUrl = `${ep}/chat/completions`;

            const res = await fetch(fullUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${key}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: "system", content: `You are a professional translator. Translate the following text from ${from} to ${to}. Return only the translated text, nothing else.` },
                        { role: "user", content: text }
                    ],
                    temperature: 0.3
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error?.message || 'فشل الاتصال بالـ API');
            
            if (data.choices && data.choices[0] && data.choices[0].message) {
                translatedText = data.choices[0].message.content;
            } else {
                throw new Error('تنسيق رد غير متوقع من الـ API');
            }

        } else {
            // الترجمة المجانية (MyMemory)
            const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
            const data = await res.json();
            if (data.responseData && data.responseData.translatedText) {
                translatedText = data.responseData.translatedText;
            } else {
                throw new Error('فشل الاتصال بمترجم MyMemory المجاني');
            }
        }

        targetText.value = translatedText.trim();
        statusEl.textContent = 'تمت الترجمة بنجاح';
        statusEl.classList.add('success');
        saveToHistory(text, translatedText.trim(), from, to);

    } catch (error) {
        console.error(error);
        statusEl.textContent = 'حدث خطأ';
        statusEl.classList.add('error');
        showToast('خطأ: ' + error.message);
    } finally {
        translateBtn.disabled = false;
        translateBtn.innerHTML = '<i class="fas fa-language"></i> ترجم الآن';
    }
}
translateBtn.addEventListener('click', doTranslate);

// ==========================================
// 10. السجل والنوافذ
// ==========================================
function saveToHistory(src, tgt, from, to) {
    let hist = JSON.parse(localStorage.getItem('translationHistory')) || [];
    hist.unshift({ src, tgt, from, to });
    if (hist.length > 20) hist.pop();
    localStorage.setItem('translationHistory', JSON.stringify(hist));
    renderHistory();
}

function renderHistory() {
    const hist = JSON.parse(localStorage.getItem('translationHistory')) || [];
    if (!hist.length) { historyList.innerHTML = '<p class="empty-msg">لا توجد ترجمات.</p>'; return; }
    historyList.innerHTML = hist.map((item, i) => `
        <div class="history-item" onclick="window.loadHistory(${i})">
            <div class="h-langs">${languages[item.from] || item.from} ➔ ${languages[item.to] || item.to}</div>
            <div>${item.src}</div>
            <div class="h-target">${item.tgt}</div>
        </div>
    `).join('');
}

window.loadHistory = (i) => {
    const hist = JSON.parse(localStorage.getItem('translationHistory')) || [];
    if (hist[i]) {
        sourceText.value = hist[i].src;
        targetText.value = hist[i].tgt;
        charCount.textContent = hist[i].src.length;
        historyModal.classList.remove('show');
    }
};

clearHistoryBtn.addEventListener('click', () => { localStorage.removeItem('translationHistory'); renderHistory(); });
historyBtn.addEventListener('click', () => { renderHistory(); historyModal.classList.add('show'); });
settingsBtn.addEventListener('click', () => settingsModal.classList.add('show'));
closeBtns.forEach(b => b.addEventListener('click', () => {
    historyModal.classList.remove('show');
    settingsModal.classList.remove('show');
    modelsModal.classList.remove('show');
}));
window.addEventListener('click', e => {
    if (e.target.classList.contains('modal')) e.target.classList.remove('show');
});

// ==========================================
// 11. وضع تجربة المستخدم والإشعارات
// ==========================================
uxModeToggle.checked = localStorage.getItem('uxMode') === 'true';
uxModeToggle.addEventListener('change', () => {
    localStorage.setItem('uxMode', uxModeToggle.checked);
    showToast(uxModeToggle.checked ? 'تم تفعيل وضع التجربة' : 'تم الإيقاف');
});

let toastTimer;
function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}
