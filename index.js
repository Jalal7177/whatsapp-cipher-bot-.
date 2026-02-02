const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
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

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
    console.log('امسح الكود لتشغيل البوت:');
});

client.on('ready', () => {
    console.log('البوت جاهز للعمل!');
});

client.on('message', async msg => {
    const text = msg.body;

    if (isNaN(text.replace(/\s/g, ''))) {
        // إذا كان المدخل نصاً -> تشفير
        let result = text.split('').map(char => cipher[char] || char).join('-');
        msg.reply(`القفل 🔒:\n${result}`);
    } else {
        // إذا كان المدخل أرقاماً -> فك تشفير
        let result = text.split('-').map(num => deCipher[num.trim()] || num).join('');
        msg.reply(`المفتاح 🔑:\n${result}`);
    }
});

client.initialize();
