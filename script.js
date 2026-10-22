// === عناصر DOM ===
const $ = id => document.getElementById(id);
const dom = {
    input: $('inputText'), output: $('outputText'), count: $('charCount'),
    btn: $('translateBtn'), src: $('srcLang'), tgt: $('tgtLang'),
    file: $('fileInput'), importBtn: $('importBtn'),
    progressWrap: $('progressWrap'), progressFill: $('progressFill'), progressPct: $('progressPct')
};

// === قائمة لغات كثيرة (أكثر من 100 لغة) ===
const languages = {
    'auto': 'كشف تلقائي', 'ar': 'العربية', 'en': 'الإنجليزية', 'fr': 'الفرنسية', 'es': 'الإسبانية',
    'de': 'الألمانية', 'it': 'الإيطالية', 'ru': 'الروسية', 'zh': 'الصينية', 'ja': 'اليابانية',
    'ko': 'الكورية', 'pt': 'البرتغالية', 'tr': 'التركية', 'nl': 'الهولندية', 'pl': 'البولندية',
    'sv': 'السويدية', 'da': 'الدنماركية', 'no': 'النرويجية', 'fi': 'الفنلندية', 'cs': 'التشيكية',
    'hu': 'المجرية', 'ro': 'الرومانية', 'el': 'اليونانية', 'he': 'العبرية', 'hi': 'الهندية',
    'ur': 'الأردية', 'fa': 'الفارسية', 'bn': 'البنغالية', 'ta': 'التاميلية', 'te': 'التيلوغوية',
    'ml': 'المالايالامية', 'th': 'التايلاندية', 'vi': 'الفيتنامية', 'id': 'الإندونيسية',
    'ms': 'الماليزية', 'tl': 'الفلبينية', 'uk': 'الأوكرانية', 'bg': 'البلغارية', 'hr': 'الكرواتية',
    'sk': 'السلوفاكية', 'sl': 'السلوفينية', 'sr': 'الصربية', 'lt': 'الليتوانية', 'lv': 'اللاتفية',
    'et': 'الإستونية', 'af': 'الأفريكانية', 'sq': 'الألبانية', 'am': 'الأمهرية', 'hy': 'الأرمنية',
    'az': 'الأذربيجانية', 'eu': 'الباسكية', 'be': 'البيلاروسية', 'bs': 'البوسنية', 'ca': 'الكاتالونية',
    'ceb': 'السيبيونية', 'ny': 'الشيشيوا', 'co': 'الكورسيكية', 'eo': 'الإسبرانتو', 'fy': 'الفريزية',
    'gl': 'الغاليسية', 'ka': 'الجورجية', 'gu': 'الغوجاراتية', 'ht': 'الكريولية الهايتية', 'ha': 'الهوسا',
    'haw': 'الهاوائية', 'hmn': 'الهمونغ', 'is': 'الأيسلندية', 'ig': 'الإيجبو', 'ga': 'الأيرلندية',
    'jv': 'الجاوية', 'kn': 'الكانادية', 'kk': 'الكازاخية', 'km': 'الخميرية', 'rw': 'الكينيارواندا',
    'ku': 'الكردية', 'ky': 'القرغيزية', 'lo': 'اللاوية', 'la': 'اللاتينية', 'lb': 'اللوكسمبورغية',
    'mk': 'المقدونية', 'mg': 'الملغاشية', 'mt': 'المالطية', 'mi': 'الماورية', 'mr': 'الماراثية',
    'mn': 'المنغولية', 'my': 'البورمية', 'ne': 'النيبالية', 'or': 'الأورية', 'ps': 'الباشتو',
    'pa': 'البنجابية', 'sm': 'الساموية', 'gd': 'الغيلية الاسكتلندية', 'st': 'السوتو', 'sn': 'الشونا',
    'sd': 'السندية', 'si': 'السنهالية', 'so': 'الصومالية', 'su': 'السوندانية', 'sw': 'السواحيلية',
    'tg': 'الطاجيكية', 'tt': 'التتارية', 'tk': 'التركمانية', 'ug': 'الأويغورية', 'uz': 'الأوزبكية',
    'cy': 'الويلزية', 'xh': 'الخوسا', 'yi': 'اليديشية', 'yo': 'اليوروبا', 'zu': 'الزولو'
};

// تعبئة القوائم المنسدلة
function populateLanguages() {
    for (const [code, name] of Object.entries(languages)) {
        const opt1 = new Option(name, code);
        const opt2 = new Option(name, code);
        dom.src.add(opt1);
        dom.tgt.add(opt2);
    }
    dom.src.value = 'auto'; // الافتراضي
    dom.tgt.value = 'en';   // الافتراضي
}
populateLanguages();

// === دالة الترجمة الذكية (تدعم النصوص الطويلة) ===
async function translateText(text, from, to) {
    // MyMemory يدعم حتى 500 حرف تقريباً لكل طلب، لذا نقسم النص
    const chunkSize = 450;
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.substring(i, i + chunkSize));
    }

    let fullTranslation = '';
    let completed = 0;
    
    // إظهار شريط التقدم
    dom.progressWrap.hidden = false;
    
    for (const chunk of chunks) {
        const src = from === 'auto' ? 'ar' : from; // إذا كان تلقائي، افترض العربية (يمكن تعديله)
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=${src}|${to}`;
        
        try {
            const res = await fetch(url);
            const data = await res.json();
            if (data.responseStatus === 200 && data.responseData?.translatedText) {
                fullTranslation += data.responseData.translatedText + ' ';
            } else {
                fullTranslation += chunk + ' '; // في حال فشل جزء، نضع النص الأصلي
            }
        } catch (e) {
            fullTranslation += chunk + ' ';
        }

        // تحديث شريط التقدم
        completed++;
        const pct = Math.round((completed / chunks.length) * 100);
        dom.progressFill.style.width = pct + '%';
        dom.progressPct.textContent = pct + '%';
    }

    dom.progressWrap.hidden = true;
    return fullTranslation.trim();
}

// === زر الترجمة ===
dom.btn.addEventListener('click', async () => {
    const text = dom.input.value.trim();
    if (!text) return alert('اكتب نصاً أو استورد ملفاً أولاً!');
    
    dom.btn.disabled = true;
    dom.btn.textContent = 'جاري الترجمة...';
    dom.output.value = '';

    try {
        const translated = await translateText(text, dom.src.value, dom.tgt.value);
        dom.output.value = translated;
    } catch (e) {
        alert('حدث خطأ أثناء الترجمة: ' + e.message);
    } finally {
        dom.btn.disabled = false;
        dom.btn.textContent = 'ترجم الآن';
    }
});

// === تحديث عداد الأحرف ===
dom.input.addEventListener('input', () => {
    dom.count.textContent = `${dom.input.value.length} حرف`;
});

// === مسح النص ===
$('clearBtn').addEventListener('click', () => {
    dom.input.value = ''; dom.output.value = ''; dom.count.textContent = '0 حرف';
});

// === تبديل اللغات ===
$('swapBtn').addEventListener('click', () => {
    if (dom.src.value === 'auto') return alert('لا يمكن تبديل الكشف التلقائي');
    [dom.src.value, dom.tgt.value] = [dom.tgt.value, dom.src.value];
    [dom.input.value, dom.output.value] = [dom.output.value, dom.input.value];
});

// === نسخ النص ===
$('copyBtn').addEventListener('click', () => {
    if (!dom.output.value) return;
    navigator.clipboard.writeText(dom.output.value).then(() => alert('تم النسخ!'));
});

// === النطق الصوتي ===
function speak(text, lang) {
    if (!text) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'auto' ? 'ar-SA' : lang;
    speechSynthesis.speak(u);
}
$('speakTgt').addEventListener('click', () => speak(dom.output.value, dom.tgt.value));

// === برمجة زر استيراد الملفات (PDF, Word, TXT) ===
dom.importBtn.addEventListener('click', () => dom.file.click());

dom.file.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    dom.input.value = 'جاري قراءة الملف...';
    dom.input.disabled = true;

    try {
        if (ext === 'txt' || ext === 'srt' || ext === 'md') {
            const text = await file.text();
            dom.input.value = text;
        } 
        else if (ext === 'pdf') {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                fullText += content.items.map(item => item.str).join(' ') + '\n';
            }
            dom.input.value = fullText;
        } 
        else if (ext === 'docx') {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            dom.input.value = result.value;
        } 
        else {
            alert('صيغة الملف غير مدعومة. استخدم TXT أو PDF أو DOCX.');
            dom.input.value = '';
        }
    } catch (error) {
        alert('خطأ في قراءة الملف: ' + error.message);
        dom.input.value = '';
    } finally {
        dom.input.disabled = false;
        dom.count.textContent = `${dom.input.value.length} حرف`;
    }
});
