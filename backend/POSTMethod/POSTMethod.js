const getMistral = require("./POSTMethods/getmistral")
const User = require('../data/userdata.js')

function POSTmethod(req, res) {
    switch (req.path) {
        /*---------------- Mistral ----------------*/
        case '/getwinningtext':
            getMistral('emoji', req.body.promt, res)
            break;
        case '/getstory':
            getMistral('getstory', req.body.worker, res)
            break;
        case '/setname':
            User.setname(req.body.name)
            break;
        case '/setmoney':
            req.body.money != User.money && User.setmoney(req.body.money)
            break;
        case '/addnewnote':
            User.addnewnote(req.body.note)
            break;
        case '/addnewworker':
            User.addnewworker(req.body.worker)
            break;
        case '/deletecurrentnote':
            User.deletecurrentnote(req.body.note)
            break;

    }
}

module.exports = POSTmethod