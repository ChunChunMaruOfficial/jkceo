const User = require('../../data/userdata.js');
const promts = require('../../data/promts.json');
const overflow = require('../../data/providers/overflow.json');
const getRandom = require('../../GETMethod/GETMethods/getRandom.js');
const axios = require("axios")

async function getLLMapi(startpromt, promt) {
    console.log('get Gemma');

    try {

        const chatResponse = await axios.post('http://localhost:1234/v1/chat/completions', {
            model: "google/gemma-3-12b",

            messages: [
                 { role: "system", content: startpromt.system },
                { role: "user", content: startpromt.user + promt }
            ],

            temperature: 0.7,
            max_tokens: -1,
            stream: false
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return chatResponse.data.choices[0].message.content;
    } catch (error) {
        console.error('Error in getLLMapi:', error);
        throw error;
    }
}

async function getLLM(startpromt, promt, res) {

    try {
        let LLMRes = await getLLMapi(startpromt, promt);
        console.log("ANSWER: ", LLMRes);

        switch (startpromt) {
            case promts.emoji:
                User.setprofessionformulation(LLMRes);
                break;

            case promts.steps:
                const ingredients = await getLLMapi(promts.getmaterials, LLMRes.split(',')[0])
                LLMRes = {
                    title: LLMRes.split(',')[0],
                    steps: LLMRes.split(',').slice(1).map(v => v.trim()),
                    price: getRandom(40, 120),
                    ingredients: ingredients.split(',')
                };
                User.addnewnote(LLMRes);
                break;

            case promts.examplename:
                User.setname(LLMRes);
                break;

            case promts.getmaterialannouncement:
                LLMRes = LLMRes.endsWith('.') || LLMRes.endsWith(';') ? LLMRes.slice(0, -1) : LLMRes
                LLMRes = LLMRes.split(';').map((v) => {
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
                    const changednumbers = [...new Array(noteswithingredients.length)].map(() => (getRandom(0, LLMRes.length - 1))) //массив с индексами для ингредиентов из заметок
                    noteswithingredients.forEach((v, i) => { LLMRes[changednumbers[i]].materials = v.ingredients.map(v => { return { name: v, count: getRandom(5, 15) } }); LLMRes[changednumbers[i]].text = overflow[getRandom(0, overflow.length - 1)] })

                }

        }
        console.log(LLMRes);
        res.json({ answer: LLMRes });
    }
    catch (error) {
        console.error('Error:', error);
        res.json({ answer: "serverError" });
    }
}

module.exports = getLLM;
