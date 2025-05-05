const User = require('../../data/userdata.js')

const mistralModule = require('@mistralai/mistralai');
const Mistral = mistralModule.Mistral;

const apiKey = 'kXXdvcu0SGA6XHrcvyki2KvN2dbTj79O';
console.log('API Key:', apiKey)

const client = new Mistral({ apiKey: apiKey });

async function getMistral(type, promt, res) {
    console.log('get Mistral');

    let startpromt
    switch (type) {
        case 'emoji':
            startpromt = 'Я дам тебе 3 эмодзи, а ты должен описать довольно кратко и простым текстом в одно предложение (без эмодзи в скобках!!! и от первого лица) мою модель бизнеса. Первый смайлик — это то, что я продаю, второй — это то, кому я продаю, третий — способ монетизации (то, как со мной расплачиваются за товар). Прими во внимание, что все это должно быть в сеттинге античности и максимально сильено соответствовать эмодзи, это самое главное. не обязательно это должно быть чтото адекватное, в том числе и способ монетизации. Эмодзи: '
            break;
        case 'examplename':
            startpromt = 'придумай название из 1-4 слов на русском, которое может быть странным, но не примитивным (ответь только наванием без кавычек) и должно отображать каждое слово в формулировке, можешь с смешением английского и русского языков, для компании, которую можно описать как: '
            break;
        case 'steps':
            startpromt = 'по производимой мною продукции, напиши пошаговый список через запятую того, что я должен делать для получения необходимой продукции с учетом того, что у меня есть все ингредиенты (от 3 до 6 пунктов). просто напиши через запятую, не более (не пиши "ингредиенты:" или чтото в этом роде, мне просто надо пропарсить твой ответ в массив) не принимай во внимание, для кого я произвожу и способ монетизации тоже игнорируй!!!!!!. и сами действия должны быть не сильно сложными, скажем так, это все должно быть по силам одному человеку. вот: '
            break;
        default:
            break;
    }
    if (!apiKey) {
        console.error('API key is not set');
        return;
    }
    try {
        const chatResponse = await client.chat.complete({
            model: 'mistral-large-latest',
            messages: [{ role: 'user', content: startpromt + promt }],
        });

        const MistralRes = chatResponse.choices[0].message.content

        console.log("ANSWER: ", MistralRes);

        switch (type) {
            case 'emoji':
                User.setprofessionformulation(MistralRes)
                break;
            case 'examplename':
                console.log('examplename');
                User.setname(MistralRes)
                break;
        }
        res.json({ answer: MistralRes })

    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = getMistral;
