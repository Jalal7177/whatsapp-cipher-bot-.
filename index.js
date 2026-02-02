const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// إعداد البوت مع خيارات التشغيل للاستضافات المجانية
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        handleSIGTERM: false,
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ],
    }
});

// قائمة التشفير الخاصة بك
const cipher = {
    'أ': '1', 'ب': '2', 'ت': '3', 'ث': '4', 'ج': '5', 'ح': '6', 'خ': '7', 'د': '8',
    'ذ': '9', 'ر': '10', 'ز': '11', 'س': '12', 'ش': '13', 'ص': '14', 'ض': '15',
    'ط': '16', 'ظ': '17', 'ع': '18', 'غ': '19', 'ف': '20', 'ق': '21', 'ك': '22',
    'ل': '23', 'م': '24', 'ن': '25', 'ه': '26', 'و': '27', 'ي': '0', ' ': ' '
};

// عكس القائمة لفك التشفير
const deCipher = Object.fromEntries(Object.entries(cipher).map(([k, v]) => [v, k]));

// توليد كود الـ QR في السجلات (Logs)
client.on('qr', (qr) => {
    console.log('--- امسح الكود أدناه لربط البوت ---');
    qrcode.generate(qr, {small: true});
});

// رسالة عند نجاح التشغيل
client.on('ready', () => {
    console.log('✅ تم تشغيل البوت بنجاح وهو الآن جاهز للعمل!');
});

// معالجة الرسائل (تشفير وفك تشفير)
client.on('message', async msg => {
    const text = msg.body.trim();

    // التحقق إذا كانت الرسالة أرقاماً (لفك التشفير) أو نصاً (للتشفير)
    // نستخدم regex للتأكد من أن الرسالة تحتوي على أرقام وفواصل فقط
    const isNumbers = /^[0-9-\s]+$/.test(text);

    if (!isNumbers) {
        // حالة التشفير: تحويل النص إلى أرقام
        let result = text.split('').map(char => cipher[char] || char).join('-');
        msg.reply(`القفل 🔒:\n${result}`);
    } else {
        // حالة فك التشفير: تحويل الأرقام إلى نص
        // نقوم بالتقسيم بناءً على الشرطة '-'
        let result = text.split('-').map(num => deCipher[num.trim()] || num).join('');
        msg.reply(`المفتاح 🔑:\n${result}`);
    }
});

// تشغيل البوت
client.initialize();
