const User = require('../../data/userdata.js');
const promts = require('../../data/promts.json');
const getRandom = require('../../GETMethod/GETMethods/getRandom.js');
const mistralModule = require('@mistralai/mistralai');
const Mistral = mistralModule.Mistral;

const apiKey = 'kXXdvcu0SGA6XHrcvyki2KvN2dbTj79O';
console.log('API Key:', apiKey);

const client = new Mistral({ apiKey: apiKey });

async function getMistralapi(startpromt, promt) {
    console.log('get Mistral');

    if (!apiKey) {
        console.error('API key is not set');
    }

    try {
        const chatResponse = await client.chat.complete({
            model: 'mistral-large-latest',
            messages: [{ role: 'user', content: startpromt + promt }],
        });

        return chatResponse.choices[0].message.content;
    } catch (error) {
        console.error('Error in getMistralapi:', error);
        throw error;
    }
}

async function getMistral(startpromt, promt, res) {
    
    try {
        let MistralRes = await getMistralapi(startpromt, promt);
        console.log("ANSWER: ", MistralRes);

        switch (startpromt) {
            case promts.emoji:
                User.setprofessionformulation(MistralRes);
                break;

            case promts.steps:
                MistralRes = {
                    title: MistralRes.split(',')[0],
                    steps: MistralRes.split(',').slice(1).join(','),
                    price: getRandom(40, 120),
                    ingredients: await getMistralapi(promts.getmaterials, MistralRes.split(',')[0])
                };
                User.addnewnote(MistralRes);
                break;

            case promts.examplename:
                User.setname(MistralRes);
                break;
        }

        res.json({ answer: MistralRes });
    } catch (error) {
        console.error('Error:', error);
        res.json({ answer: "Кажется, боги не удовлетворены таким раскладом, попробуйте еще раз." });
    }
}

module.exports = getMistral;
