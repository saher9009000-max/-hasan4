document.addEventListener('DOMContentLoaded', () => {
    // ==================== العناصر ====================
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const apiBtn = document.getElementById('apiBtn');
    const apiModal = document.getElementById('apiModal');
    const closeApi = document.querySelector('.api-close');
    const saveApiBtn = document.getElementById('saveApiBtn');
    const apiKeyInput = document.getElementById('apiKeyInput');
    
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.querySelector('.close-btn');
    const versionDisplay = document.getElementById('versionDisplay');
    
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const historyList = document.getElementById('historyList');
    
    const sourceLang = document.getElementById('sourceLang');
    const targetLang = document.getElementById('targetLang');
    const swapLang = document.getElementById('swapLang');
    
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const translateBtn = document.getElementById('translateBtn');
    
    const fileInput = document.getElementById('fileInput');
    const voiceBtn = document.getElementById('voiceBtn');

    // ==================== 1. الوضع الداكن ====================
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // ==================== 2. مفتاح API ====================
    // تحميل المفتاح المحفوظ
    const savedKey = localStorage.getItem('google_translate_api_key');
    if (savedKey) apiKeyInput.value = savedKey;

    apiBtn.addEventListener('click', () => apiModal.classList.remove('hidden'));
    closeApi.addEventListener('click', () => apiModal.classList.add('hidden'));
    
    saveApiBtn.addEventListener('click', () => {
        localStorage.setItem('google_translate_api_key', apiKeyInput.value.trim());
        alert('تم حفظ مفتاح API بنجاح!');
        apiModal.classList.add('hidden');
    });

    // ==================== 3. تبديل اللغات (أكثر من 100 لغة) ====================
    // قائمة مبسطة لأشهر اللغات (يمكنك توسيعها برمجياً)
    const languages = [
        { code: 'ar', name: 'العربية' }, { code: 'en', name: 'الإنجليزية' },
        { code: 'fr', name: 'الفرنسية' }, { code: 'es', name: 'الإسبانية' },
        { code: 'de', name: 'الألمانية' }, { code: 'zh', name: 'الصينية' },
        { code: 'ja', name: 'اليابانية' }, { code: 'ru', name: 'الروسية' },
        { code: 'tr', name: 'التركية' }, { code: 'it', name: 'الإيطالية' },
        { code: 'pt', name: 'البرتغالية' }, { code: 'hi', name: 'الهندية' },
        { code: 'ko', name: 'الكورية' }, { code: 'nl', name: 'الهولندية' },
        { code: 'pl', name: 'البولندية' }, { code: 'sv', name: 'السويدية' },
        // ... أضف المزيد حسب الحاجة
    ];

    function populateLanguages() {
        languages.forEach(lang => {
            const opt1 = new Option(lang.name, lang.code);
            const opt2 = new Option(lang.name, lang.code);
            sourceLang.add(opt1);
            targetLang.add(opt2);
        });
        // تعيين القيم الافتراضية
        sourceLang.value = 'auto'; // خيار الكشف التلقائي
        targetLang.value = 'en';
    }
    populateLanguages();

    swapLang.addEventListener('click', () => {
        if (sourceLang.value === 'auto') {
            alert('لا يمكن تبديل الكشف التلقائي. الرجاء اختيار لغة محددة.');
            return;
        }
        const temp = sourceLang.value;
        sourceLang.value = targetLang.value;
        targetLang.value = temp;
    });

    // ==================== 4. استيراد الملفات ====================
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            inputText.value = event.target.result;
        };
        reader.readAsText(file);
        // ملاحظة: لملفات PDF/Docx تحتاج لمكتبات خارجية مثل pdf.js
    });

    // ==================== 5. الترجمة الصوتية ====================
    let recognition;
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        voiceBtn.addEventListener('click', () => {
            if (voiceBtn.classList.contains('listening')) {
                recognition.stop();
                return;
            }
            // تحديد لغة التعرف بناءً على اللغة المصدر
            recognition.lang = sourceLang.value === 'auto' ? 'ar-SA' : sourceLang.value;
            recognition.start();
            voiceBtn.classList.add('listening');
            voiceBtn.textContent = '🔴 جاري الاستماع...';
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            inputText.value += transcript;
        };

        recognition.onend = () => {
            voiceBtn.classList.remove('listening');
            voiceBtn.textContent = '🎤 صوت';
        };
        
        recognition.onerror = () => {
            voiceBtn.classList.remove('listening');
            voiceBtn.textContent = '🎤 صوت';
        };
    } else {
        voiceBtn.disabled = true;
        voiceBtn.title = 'المتصفح لا يدعم التعرف على الصوت';
    }

    // ==================== 6. وظيفة الترجمة (محاكاة) ====================
    // ملاحظة: هنا تحتاج لاستدعاء API حقيقي. الكود التالي يوضح المنطق فقط.
    translateBtn.addEventListener('click', async () => {
        const text = inputText.value.trim();
        if (!text) return alert('الرجاء إدخال نص للترجمة');
        
        const apiKey = localStorage.getItem('google_translate_api_key');
        if (!apiKey) {
            alert('الرجاء إدخال مفتاح API أولاً من زر المفتاح 🔑');
            return;
        }

        translateBtn.textContent = 'جاري الترجمة...';
        translateBtn.disabled = true;

        try {
            // مثال حقيقي (يتطلب تفعيل Cloud Translation API في Google Cloud):
            /*
            const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
                method: 'POST',
                body: JSON.stringify({
                    q: text,
                    target: targetLang.value,
                    source: sourceLang.value === 'auto' ? undefined : sourceLang.value,
                    format: 'text'
                })
            });
            const data = await response.json();
            const translated = data.data.translations[0].translatedText;
            */
            
            // محاكاة الترجمة للعرض (استبدلها بالكود أعلاه)
            await new Promise(r => setTimeout(r, 800)); 
            const translated = `[ترجمة تجريبية] ${text.split(' ').reverse().join(' ')}`;
            
            outputText.value = translated;
            
            // إضافة إلى السجل
            addToHistory(text, translated);
            
        } catch (error) {
            alert('حدث خطأ أثناء الترجمة: ' + error.message);
        } finally {
            translateBtn.textContent = 'ترجم الآن';
            translateBtn.disabled = false;
        }
    });

    // ==================== 7. الإعدادات (رقم الإصدار) ====================
    const APP_VERSION = 'v1.2.0'; // يمكنك تغييره هنا
    versionDisplay.textContent = APP_VERSION;

    settingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));
    closeSettings.addEventListener('click', () => settingsModal.classList.add('hidden'));

    // ==================== 8. مسح السجل ====================
    function addToHistory(original, translated) {
        const li = document.createElement('li');
        const shortOrig = original.length > 30 ? original.substring(0, 30) + '...' : original;
        li.textContent = `${shortOrig} ➔ ${translated}`;
        historyList.prepend(li);
        // حفظ في التخزين المحلي
        saveHistoryToStorage();
    }

    function saveHistoryToStorage() {
        const items = Array.from(historyList.children).map(li => li.textContent);
        localStorage.setItem('translation_history', JSON.stringify(items));
    }

    function loadHistoryFromStorage() {
        const saved = localStorage.getItem('translation_history');
        if (saved) {
            const items = JSON.parse(saved);
            items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                historyList.appendChild(li);
            });
        }
    }
    loadHistoryFromStorage();

    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('هل أنت متأكد من مسح السجل بالكامل؟')) {
            historyList.innerHTML = '';
            localStorage.removeItem('translation_history');
        }
    });

    // إغلاق النوافذ المنبثقة عند النقر خارجها
    window.addEventListener('click', (e) => {
        if (e.target === apiModal) apiModal.classList.add('hidden');
        if (e.target === settingsModal) settingsModal.classList.add('hidden');
    });
});
