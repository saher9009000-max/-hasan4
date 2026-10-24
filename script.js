// 1. قاموس اللغات
const languages = {
    auto: "🔍 اكتشاف تلقائي", ar: "🇸🇦 العربية", en: "🇺🇸 الإنجليزية", fr: "🇫🇷 الفرنسية",
    es: "🇪🇸 الإسبانية", de: "🇩🇪 الألمانية", it: "🇮🇹 الإيطالية", pt: "🇵🇹 البرتغالية",
    ru: "🇷🇺 الروسية", zh: "🇨🇳 الصينية", ja: "🇯🇵 اليابانية", ko: "🇰🇷 الكورية",
    tr: "🇹🇷 التركية", hi: "🇮🇳 الهندية", ur: "🇵🇰 الأردية", fa: "🇮🇷 الفارسية"
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

// النماذج والإعدادات (ثلاث نقاط)
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const apiKeyInput = document.getElementById('apiKeyInput');
const apiUrlInput = document.getElementById('apiUrlInput');
const connectionSelect = document.getElementById('connectionSelect');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');

const modelsBtn = document.getElementById('modelsBtn');
const refreshModelsBtn = document.getElementById('refreshModelsBtn');
const modelsModal = document.getElementById('modelsModal');
const modelsList = document.getElementById('modelsList');
const currentModelBadge = document.getElementById('currentModelBadge');

// السجل
const historyBtn = document.getElementById('historyBtn');
const historyModal = document.getElementById('historyModal');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const closeBtns = document.querySelectorAll('.close-btn');

let selectedModel = localStorage.getItem('selectedModel') || 'الافتراضي (MyMemory)';
currentModelBadge.textContent = selectedModel;

// استرجاع الإعدادات المحفوظة
apiKeyInput.value = localStorage.getItem('apiKey') || '';
apiUrlInput.value = localStorage.getItem('apiUrl') || '';
connectionSelect.value = localStorage.getItem('connectionType') || 'direct';

// حفظ الإعدادات
saveSettingsBtn.addEventListener('click', () => {
    localStorage.setItem('apiKey', apiKeyInput.value.trim());
    localStorage.setItem('apiUrl', apiUrlInput.value.trim());
    localStorage.setItem('connectionType', connectionSelect.value);
    settingsModal.classList.remove('show');
    showToast('تم حفظ الإعدادات بنجاح');
});

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
        if (color === 'purple') document.body.removeAttribute('data-color');
        else document.body.setAttribute('data-color', color);
        localStorage.setItem('themeColor', color);
    });
});
const savedColor = localStorage.getItem('themeColor');
if (savedColor && savedColor !== 'purple') document.body.setAttribute('data-color', savedColor);

// 5. إدارة النماذج (Models)
async function fetchModels() {
    modelsModal.classList.add('show');
    modelsList.innerHTML = '<p class="empty-msg">جاري جلب النماذج...</p>';
    
    // قائمة افتراضية أو جلب من الـ API إذا وُجد رابط ومفتاح
    let models = [
        { id: 'default-mymemory', name: 'الافتراضي (MyMemory API)' },
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini (ذكاء اصطناعي فائق)' },
        { id: 'gpt-4o', name: 'GPT-4o (عالي الدقة والاحترافية)' },
        { id: 'claude-3-haiku', name: 'Claude 3 Haiku (سريع وخفيف)' }
    ];

    try {
        const apiKey = localStorage.getItem('apiKey');
        const apiUrl = localStorage.getItem('apiUrl');
        if (apiUrl && apiKey) {
            // محاكاة جلب النماذج من السيرفر المخصص للمستخدم
            const response = await fetch(`${apiUrl}/models`, {
                headers: { 'Authorization': `Bearer ${apiKey}` }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.models) models = data.models;
            }
        }
    } catch (e) {
        console.log('استخدام النماذج المحلية البديلة');
    }

    modelsList.innerHTML = models.map(m => `
        <div class="model-item" onclick="selectModel('${m.name}')">
            <strong><i class="fas fa-robot"></i> ${m.name}</strong>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-top:3px;">المعرف: ${m.id}</p>
        </div>
    `).join('');
}

function selectModel(modelName) {
    selectedModel = modelName;
    localStorage.setItem('selectedModel', modelName);
    currentModelBadge.textContent = modelName;
    modelsModal.classList.remove('show');
    showToast(`تم اختيار النموذج: ${modelName}`);
}

modelsBtn.addEventListener('click', fetchModels);
refreshModelsBtn.addEventListener('click', () => {
    showToast('جاري تحديث النماذج...');
    fetchModels();
});

// 6. ترجمة النصوص باستخدام النموذج المحدد
async function doTranslate() {
    const text = sourceText.value.trim();
    if (!text) { showToast('اكتب نصاً أولاً'); return; }

    let from = sourceLang.value;
    const to = targetLang.value;
    if (from === to) { showToast('اللغتان متطابقتان'); return; }
    if (from === 'auto') from = 'ar';

    statusEl.textContent = 'جاري الترجمة...';
    translateBtn.disabled = true;
    translateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الترجمة عبر النموذج...';

    try {
        let translatedText = "";
        const apiKey = localStorage.getItem('apiKey');
        const apiUrl = localStorage.getItem('apiUrl');

        // إذا كان المستخدم قد حدد API خاص ورابط وموديل غير افتراضي
        if (apiUrl && apiKey && selectedModel !== 'الافتراضي (MyMemory API)') {
            const response = await fetch(`${apiUrl}/translate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({ text, from, to, model: selectedModel })
            });
            if (response.ok) {
                const data = await response.json();
                translatedText = data.translatedText || data.result;
            } else {
                throw new Error('فشل الاتصال بالنموذج المخصص');
            }
        } else {
            // الترجمة الافتراضية المجانية عبر MyMemory
            const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.responseData) {
                translatedText = data.responseData.translatedText;
            } else {
                throw new Error('فشل');
            }
        }

        targetText.value = translatedText;
        statusEl.textContent = 'تمت الترجمة بنجاح';
        statusEl.classList.add('success');
        saveToHistory(text, translatedText, from, to);
    } catch (error) {
        statusEl.textContent = 'حدث خطأ في الترجمة';
        statusEl.classList.add('error');
        showToast('تأكد من صحة رابط المفتاح والـ API');
    } finally {
        translateBtn.disabled = false;
        translateBtn.innerHTML = '<i class="fas fa-language"></i> ترجم الآن';
    }
}
translateBtn.addEventListener('click', doTranslate);

// أدوات إضافية (نسخ، مسح، صوت، سجل)
sourceText.addEventListener('input', () => { charCount.textContent = sourceText.value.length; });
clearBtn.addEventListener('click', () => { sourceText.value = ''; targetText.value = ''; charCount.textContent = '0'; statusEl.textContent = ''; });
copyBtn.addEventListener('click', () => { if (!targetText.value) return; navigator.clipboard.writeText(targetText.value); showToast('تم النسخ!'); });
swapBtn.addEventListener('click', () => { const temp = sourceLang.value; sourceLang.value = targetLang.value; targetLang.value = temp === 'auto' ? 'en' : temp; });

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// السجل
function saveToHistory(src, tgt, from, to) {
    let history = JSON.parse(localStorage.getItem('translationHistory')) || [];
    history.unshift({ src, tgt, from, to, date: new Date().toLocaleString('ar-EG') });
    if (history.length > 20) history.pop();
    localStorage.setItem('translationHistory', JSON.stringify(history));
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

function loadHistoryItem(index) {
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

// فتح وإغلاق النوافذ
settingsBtn.addEventListener('click', () => settingsModal.classList.add('show'));
historyBtn.addEventListener('click', () => { renderHistory(); historyModal.classList.add('show'); });
closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        settingsModal.classList.remove('show');
        modelsModal.classList.remove('show');
        historyModal.classList.remove('show');
    });
});
window.addEventListener('click', (e) => {
    if (e.target === settingsModal) settingsModal.classList.remove('show');
    if (e.target === modelsModal) modelsModal.classList.remove('show');
    if (e.target === historyModal) historyModal.classList.remove('show');
});
