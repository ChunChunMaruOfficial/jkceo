const express = require('express')

const cors = require('cors')
const app = express()

const emoji = require("emoji-api");
app.use(cors())

app.get('/getdata', (req, res) => {
    let result = emoji.all().filter(v => v.group != 'Flags' && v.subGroup != 'family')
    result = result.map(v => ({ emoji: v.emoji, name: v.name }))
    res.json({ answer: result })
})

app.listen(3001, () => console.log('server is running'))
