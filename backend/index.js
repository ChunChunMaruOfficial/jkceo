const express = require('express')

const cors = require('cors')
const app = express()

const GETmethod = require('./GETMethod/GETMethod.js')
const POSTmethod = require('./POSTMethod/POSTMethod.js')

app.use(express.json());

app.use(cors())

app.use((req, res) => {
    switch (req.method) {
        case "GET":
            GETmethod(req, res)
            break;
        case "POST":            
            POSTmethod(req, res)
            break;
        default:
            break;
    }
})

app.listen(3001, () => console.log('server is running'))
