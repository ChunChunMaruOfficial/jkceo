const mistralModule = require('@mistralai/mistralai');
const Mistral = mistralModule.Mistral;

// Вставьте ваш API ключ напрямую в код
const apiKey = 'kXXdvcu0SGA6XHrcvyki2KvN2dbTj79O';
console.log('API Key:', apiKey); // Проверка, что API ключ загружен

const client = new Mistral({ apiKey: apiKey });

async function getMistral() {
    console.log('get a try');
    if (!apiKey) {
        console.error('API key is not set');
        return;
    }
    try {
        const chatResponse = await client.chat.complete({
            model: 'mistral-large-latest',
            messages: [{ role: 'user', content: 'Я дам тебе 3 эмодзи, а ты должен описать довольно кратко и простым текстом в одно предложение (без эмодзи в скобках) мою модель бизнеса. Первый смайлик — это то, что я продаю, второй — это то, кому я продаю, третий — способ монетизации (то, как со мной расплачиваются за товар). Прими во внимание, что все это должно быть в сеттинге античности. Эмодзи: 🚈👾🪒' }],
        });
        console.log('Chat:', chatResponse.choices[0].message.content);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Вызов функции
getMistral();

module.exports = getMistral;
