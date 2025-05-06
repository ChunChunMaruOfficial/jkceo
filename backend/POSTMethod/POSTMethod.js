const getMistral = require("./POSTMethods/getmistral")
const User = require('../data/userdata.js')

function POSTmethod(req, res) {
    switch (req.path) {
        case '/getwinningtext':
            getMistral('emoji', req.body.promt, res)
            break;
        case '/setname':
            User.setname(req.body.name)
            break;
        case '/addnewnote':
            User.addnewnote(req.body.note)
            break;
        case '/deletecurrentnote':
            User.deletecurrentnote(req.body.note)
            break;
        case '/getstory':
            getMistral('getstory', req.body.worker, res)
            break;
    }
}

module.exports = POSTmethod