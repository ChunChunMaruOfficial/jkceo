const User = require('../../data/userdata.js');
const promts = require('../../data/promts.json');
const overflow = require('../../data/providers/overflow.json');
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
                const ingredients = await getMistralapi(promts.getmaterials, MistralRes.split(',')[0])
                MistralRes = {
                    title: MistralRes.split(',')[0],
                    steps: MistralRes.split(',').slice(1).map(v => v.trim()),
                    price: getRandom(40, 120),
                    ingredients: ingredients.split(',')
                };
                User.addnewnote(MistralRes);
                break;

            case promts.examplename:
                User.setname(MistralRes);
                break;

            case promts.getmaterialannouncement:
                MistralRes = MistralRes.endsWith('.') || MistralRes.endsWith(';') ? MistralRes.slice(0, -1) : MistralRes
                MistralRes = MistralRes.split(';').map((v) => {
                    const middleraw = v.split('.')
                    materials = middleraw[middleraw.length - 3].split(',').map(v1 => {
                        const match = v1.match(/^([^(]+)\((\d+)\)$/)
                        if (match) {
                            return { name: match[1].trim(), count: Number(match[2]) }
                        }
                    })
                    return {
                        name: middleraw[middleraw.length - 2].trim(),
                        materials: materials,
                        text: middleraw.slice(0, -3).join('.').trim(),
                        date: getRandom(3, 10),
                        imgsrc: getRandom(0, 2) ? `/m/${getRandom(1, 11)}` : `/f/${getRandom(1, 8)}`,
                        price: Number(middleraw[middleraw.length - 1].trim()) / 10
                    }
                })


                if (User.notes.length > 0) {
                    const noteswithingredients = User.notes.filter(v => v.ingredients) //заметки с ингредиентами
                    const changednumbers = [...new Array(noteswithingredients.length)].map(() => (getRandom(0, MistralRes.length - 1))) //массив с индексами для ингредиентов из заметок
                    noteswithingredients.forEach((v, i) => {MistralRes[changednumbers[i]].materials = v.ingredients.map(v => { return { name: v, count: getRandom(5, 15) } }); MistralRes[changednumbers[i]].text = overflow[getRandom(0, overflow.length - 1)] })

                }
                
        }
        console.log(MistralRes);
        res.json({ answer: MistralRes });
    }
    catch (error) {
        console.error('Error:', error);
        res.json({ answer: "serverError" });
    }
}

module.exports = getMistral;
