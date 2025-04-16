const express = require('express')

const cors = require('cors')
const app = express()

const emoji = require("emoji-api");
app.use(cors())


var unirest = require('unirest');

var req = unirest('GET', 'https://api.gen-api.ru/api/v1/networks/deepseek-v3')
    .headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer sk-7LXDsHJDuuOgEuCUBL0VHhbBNiadtID9ZZU8s30TPnXYMpSC22cO81TxpvqL'
    })

    .send(JSON.stringify({
        "callback_url": null,
        "messages": [
            {
                "role": "user",
                "content": "Дай пару советов по улучшению продуктивности."
            }
        ]
    }))

    console.log(req.json().send());
    
let api_key = "sk-7LXDsHJDuuOgEuCUBL0VHhbBNiadtID9ZZU8s30TPnXYMpSC22cO81TxpvqL"


app.get('/getdata', (req, res) => {
    let result = emoji.all().filter(v => v.group != 'Flags' && v.subGroup != 'family')
    result = result.map(v => ({ emoji: v.emoji, name: v.name }))
    res.json({ answer: result })
})

app.listen(3001, () => console.log('server is running'))
