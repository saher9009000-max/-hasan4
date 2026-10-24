// 1. قاموس اللغات
const languages = {
    auto: "🔍 اكتشاف تلقائي", ar: "🇸🇦 العربية", en: "🇺🇸 الإنجليزية", fr: "🇫🇷 الفرنسية",
    es: "🇪🇸 الإسبانية", de: "🇩🇪 الألمانية", it: "🇮🇹 الإيطالية", pt: "🇵🇹 البرتغالية",
    ru: "🇷🇺 الروسية", zh: "🇨🇳 الصينية", ja: "🇯🇵 اليابانية", ko: "🇰🇷 الكورية",
    tr: "🇹🇷 التركية", hi: "🇮🇳 الهندية", ur: "🇵🇰 الأردية", fa: "🇮🇷 الفارسية",
    nl: "🇳🇱 الهولندية", pl: "🇵🇱 البولندية", sv: "🇸🇪 السويدية", el: "🇬🇷 اليونانية",
    he: "🇮🇱 العبرية", th: "🇹🇭 التايلاندية", vi: "🇻🇳 الفيتنامية", id: "🇮🇩 الإندونيسية"
};

// 2. عناصر DOM
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
const aiToggle = document.getElementById('aiToggle');

// السجل والإعدادات والنماذج
const historyBtn = document.getElementById('historyBtn');
const historyModal = document.getElementById('historyModal');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const uxModeToggle = document.getElementById('uxModeToggle');
const apiEndpoint = document.getElementById('apiEndpoint');
const apiKey = document.getElementById('apiKey');
const pasteKeyBtn = document.getElementById('pasteKeyBtn');
const testConnectionBtn = document.getElementById('testConnectionBtn');

// النماذج
const modelsBtn = document.getElementById('modelsBtn');
const modelsModal = document.getElementById('modelsModal');
const modelsList = document.getElementById('modelsList');
const refreshModelsBtn = document.getElementById('refreshModelsBtn');
const currentModelName = document.getElementById('currentModelName');

const closeBtns = document.querySelectorAll('.close-btn');

// 3. تعبئة اللغات
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

// 4. نظام الثيمات
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
        if (color === 'purple') {
            document.body.removeAttribute('data-color');
        } else {
            document.body.setAttribute('data-color', color);
        }
        localStorage.setItem('themeColor', color);
    });
});
const savedColor = localStorage.getItem('themeColor');
if (savedColor && savedColor !== 'purple') {
    document.body.setAttribute('data-color', savedColor);
}

// 5. تبديل اللغات
swapBtn.addEventListener('click', () => {
    const temp = sourceLang.value;
    sourceLang.value = targetLang.value;
    targetLang.value = temp === 'auto' ? 'en' : temp;
});

// 6. أدوات النص
sourceText.addEventListener('input', () => {
    charCount.textContent = sourceText.value.length;
});

clearBtn.addEventListener('click', () => {
    sourceText.value = '';
    targetText.value = '';
    charCount.textContent = '0';
    statusEl.textContent = '';
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        sourceText.value = event.target.result;
        charCount.textContent = sourceText.value.length;
        showToast('تم استيراد الملف');
    };
    reader.readAsText(file);
});

copyBtn.addEventListener('click', () => {
    if (!targetText.value) return;
    navigator.clipboard.writeText(targetText.value);
    showToast('تم النسخ!');
});

// 7. الترجمة الصوتية
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
        recognition.lang = sourceLang.value === 'auto' ? 'ar-SA' : sourceLang.value;
        recognition.start();
        voiceBtn.classList.add('recording');
        voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
        statusEl.textContent = 'جاري الاستماع...';
    });
    recognition.onresult = (event) => {
        sourceText.value += event.results[0][0].transcript + ' ';
        charCount.textContent = sourceText.value.length;
    };
    recognition.onend = () => {
        voiceBtn.classList.remove('recording');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        statusEl.textContent = '';
    };
} else {
    voiceBtn.style.display = 'none';
}

// 8. الاستماع
function speak(text, lang) {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
}
speakSource.addEventListener('click', () => speak(sourceText.value, sourceLang.value === 'auto' ? 'ar' : sourceLang.value));
speakTarget.addEventListener('click', () => speak(targetText.value, targetLang.value));

// ========== 9. إعدادات API والنماذج ==========

// حفظ واسترجاع إعدادات الـ API
if (localStorage.getItem('apiEndpoint')) apiEndpoint.value = localStorage.getItem('apiEndpoint');
if (localStorage.getItem('apiKey')) apiKey.value = localStorage.getItem('apiKey');

apiEndpoint.addEventListener('change', () => localStorage.setItem('apiEndpoint', apiEndpoint.value));
apiKey.addEventListener('change', () => localStorage.setItem('apiKey', apiKey.value));

// لصق المفتاح بسهولة
pasteKeyBtn.addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        apiKey.value = text;
        localStorage.setItem('apiKey', text);
        showToast('تم لصق المفتاح بنجاح');
    } catch (err) {
        showToast('فشل اللصق، يرجى اللصق يدوياً');
    }
});

// اختبار الاتصال بالـ API
testConnectionBtn.addEventListener('click', async () => {
    const endpoint = apiEndpoint.value.trim();
    const key = apiKey.value.trim();

    if (!endpoint || !key) {
        showToast('يرجى إدخال رابط الـ API والمفتاح أولاً');
        return;
    }

    testConnectionBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الاختبار...';
    testConnectionBtn.disabled = true;

    try {
        // محاولة جلب النماذج كاختبار للاتصال
        const response = await fetch(`${endpoint}/models`, {
            headers: { 'Authorization': `Bearer ${key}` }
        });

        if (response.ok) {
            showToast('✅ تم الاتصال بنجاح!');
        } else {
            showToast('❌ فشل الاتصال، تأكد من صحة المفتاح والرابط');
        }
    } catch (error) {
        showToast('❌ حدث خطأ أثناء الاتصال، تحقق من الرابط');
    } finally {
        testConnectionBtn.innerHTML = '<i class="fas fa-wifi"></i> اختبار الاتصال';
        testConnectionBtn.disabled = false;
    }
});

// فتح نافذة النماذج
modelsBtn.addEventListener('click', () => {
    modelsModal.classList.add('show');
    loadModels();
});

// تحديث النماذج
refreshModelsBtn.addEventListener('click', () => {
    loadModels();
});

// جلب النماذج من الـ API
async function loadModels() {
    const endpoint = apiEndpoint.value.trim();
    const key = apiKey.value.trim();

    if (!endpoint || !key) {
        modelsList.innerHTML = '<p class="empty-msg">يرجى إدخال إعدادات الـ API أولاً من زر الإعدادات.</p>';
        return;
    }

    modelsList.innerHTML = '<p class="empty-msg"><i class="fas fa-spinner fa-spin"></i> جاري تحميل النماذج...</p>';

    try {
        const response = await fetch(`${endpoint}/models`, {
            headers: { 'Authorization': `Bearer ${key}` }
        });

        if (!response.ok) throw new Error('فشل جلب النماذج');

        const data = await response.json();
        const models = data.data || data; // دعم تنسيقات مختلفة

        if (!models || models.length === 0) {
            modelsList.innerHTML = '<p class="empty-msg">لا توجد نماذج متاحة.</p>';
            return;
        }

        modelsList.innerHTML = '';
        const currentModel = localStorage.getItem('selectedModel') || '';

        models.forEach(model => {
            const modelId = model.id || model.name;
            const div = document.createElement('div');
            div.className = `model-item ${modelId === currentModel ? 'selected' : ''}`;
            div.innerHTML = `
                <span class="m-name">${modelId}</span>
                <i class="fas fa-check m-check"></i>
            `;
            div.addEventListener('click', () => {
                selectModel(modelId);
            });
            modelsList.appendChild(div);
        });

        if (currentModel) {
            currentModelName.textContent = currentModel;
        }

    } catch (error) {
        modelsList.innerHTML = '<p class="empty-msg">حدث خطأ أثناء جلب النماذج. تأكد من صحة الرابط والمفتاح.</p>';
    }
}

// اختيار نموذج
function selectModel(modelId) {
    localStorage.setItem('selectedModel', modelId);
    currentModelName.textContent = modelId;
    showToast(`تم اختيار النموذج: ${modelId}`);
    modelsModal.classList.remove('show');
    
    // تحديث واجهة النماذج
    document.querySelectorAll('.model-item').forEach(item => {
        item.classList.remove('selected');
        if (item.querySelector('.m-name').textContent === modelId) {
            item.classList.add('selected');
        }
    });
}

// استرجاع النموذج المحدد عند التحميل
const savedModel = localStorage.getItem('selectedModel');
if (savedModel) {
    currentModelName.textContent = savedModel;
}

// ========== 10. دالة الترجمة الذكية ==========
async function doTranslate() {
    const text = sourceText.value.trim();
    if (!text) { showToast('اكتب نصاً أولاً'); return; }

    let from = sourceLang.value;
    const to = targetLang.value;
    if (from === to) { showToast('اللغتان متطابقتان'); return; }
    if (from === 'auto') from = 'ar';

    statusEl.textContent = 'جاري الترجمة...';
    statusEl.className = 'status';
    translateBtn.disabled = true;

    const isAI = aiToggle.checked;
    translateBtn.innerHTML = isAI ? '<i class="fas fa-brain fa-spin"></i> جاري التفكير...' : '<i class="fas fa-spinner fa-spin"></i> جاري الترجمة...';

    try {
        let translatedText = "";

        if (isAI) {
            // الترجمة عبر API الخارجي إذا تم تفعيل الذكاء الاصطناعي
            const endpoint = localStorage.getItem('apiEndpoint');
            const key = localStorage.getItem('apiKey');
            const model = localStorage.getItem('selectedModel');

            if (endpoint && key) {
                // استخدام API مخصص (مثل OpenAI أو غيرها)
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${key}`
                    },
                    body: JSON.stringify({
                        model: model || "gpt-3.5-turbo",
                        messages: [
                            { role: "system", content: `You are a professional translator. Translate the following text from ${from} to ${to}. Return only the translation.` },
                            { role: "user", content: text }
                        ]
                    })
                });

                const data = await response.json();
                
                // استخراج النص بناءً على تنسيق OpenAI
                if (data.choices && data.choices[0] && data.choices[0].message) {
                    translatedText = data.choices[0].message.content;
                } else {
                    throw new Error('تنسيق رد غير متوقع');
                }
            } else {
                // إذا لم يتم إعداد API، نستخدم الترجمة المجانية مع تأخير
                await new Promise(r => setTimeout(r, 1000));
                const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
                const response = await fetch(url);
                const data = await response.json();
                translatedText = data.responseData.translatedText;
            }
        } else {
            // الترجمة العادية (MyMemory)
            const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.responseData && data.responseData.translatedText) {
                translatedText = data.responseData.translatedText;
            } else {
                throw new Error('فشل');
            }
        }

        targetText.value = translatedText.trim();
        statusEl.textContent = isAI ? 'تمت الترجمة الذكية' : 'تمت الترجمة';
        statusEl.classList.add('success');
        saveToHistory(text, translatedText.trim(), from, to);

    } catch (error) {
        console.error(error);
        statusEl.textContent = 'حدث خطأ (تحقق من إعدادات API)';
        statusEl.classList.add('error');
    } finally {
        translateBtn.disabled = false;
        translateBtn.innerHTML = '<i class="fas fa-language"></i> ترجم الآن';
    }
}
translateBtn.addEventListener('click', doTranslate);

// ========== 11. سجل الترجمات ==========
function saveToHistory(src, tgt, from, to) {
    let history = JSON.parse(localStorage.getItem('translationHistory')) || [];
    history.unshift({ src, tgt, from, to, date: new Date().toLocaleString('ar-EG') });
    if (history.length > 20) history.pop();
    localStorage.setItem('translationHistory', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('translationHistory')) || [];
    if (history.length === 0) {
        historyList.innerHTML = '<p class="empty-msg">لا توجد ترجمات سابقة.</p>';
        return;
    }
    historyList.innerHTML = history.map((item, index) => `
        <div class="history-item" onclick="loadHistoryItem(${index})">
            <div class="h-langs">${languages[item.from] || item.from} ➔ ${languages[item.to] || item.to}</div>
            <div class="h-source">${item.src}</div>
            <div class="h-target">${item.tgt}</div>
        </div>
    `).join('');
}

window.loadHistoryItem = function(index) {
    const history = JSON.parse(localStorage.getItem('translationHistory')) || [];
    const item = history[index];
    if (item) {
        sourceText.value = item.src;
        targetText.value = item.tgt;
        charCount.textContent = item.src.length;
        historyModal.classList.remove('show');
        showToast('تم استرجاع الترجمة');
    }
}

clearHistoryBtn.addEventListener('click', () => {
    localStorage.removeItem('translationHistory');
    renderHistory();
    showToast('تم مسح السجل');
});

// ========== 12. فتح وإغلاق النوافذ ==========
historyBtn.addEventListener('click', () => { renderHistory(); historyModal.classList.add('show'); });
settingsBtn.addEventListener('click', () => settingsModal.classList.add('show'));

closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        historyModal.classList.remove('show');
        settingsModal.classList.remove('show');
        modelsModal.classList.remove('show');
    });
});

window.addEventListener('click', (e) => {
    if (e.target === historyModal) historyModal.classList.remove('show');
    if (e.target === settingsModal) settingsModal.classList.remove('show');
    if (e.target === modelsModal) modelsModal.classList.remove('show');
});

// ========== 13. وضع تجربة المستخدم ==========
const uxMode = localStorage.getItem('uxMode') === 'true';
uxModeToggle.checked = uxMode;

uxModeToggle.addEventListener('change', () => {
    localStorage.setItem('uxMode', uxModeToggle.checked);
    if (uxModeToggle.checked) {
        showToast('تم تفعيل وضع تجربة المستخدم!');
    } else {
        showToast('تم إيقاف وضع تجربة المستخدم.');
    }
});

if (uxMode) {
    setTimeout(() => {
        showToast('👋 مرحباً بك! يمكنك الآن إعداد API من زر الإعدادات (الثلاث نقاط).');
    }, 1500);
}

// ========== 14. الإشعارات ==========
let toastTimer;
function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}
