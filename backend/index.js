const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())

app.get('/getdata', (req, res) => {
    res.json({ answer: 'heloo nigga'})
})

app.listen(3001, () => console.log('server is running'))
