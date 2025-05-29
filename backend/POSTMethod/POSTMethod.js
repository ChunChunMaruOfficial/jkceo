const getMistral = require("./POSTMethods/getmistral")
const User = require('../data/userdata.js')
const promts = require('../data/promts.json')


function POSTmethod(req, res) {
    switch (req.path) {
        /*---------------- Mistral ----------------*/
        case '/getwinningtext':
            getMistral(promts.emoji, req.body.promt, res)
            break;
        case '/getstory':
            getMistral(promts.getstory, req.body.worker, res)
            break;
        case '/getorder':
            getMistral(promts.getorder, req.body.count + ' таких фраз в одно предложение, разделенных через точку, даже если стоит дркгой знак, поле него ты ставишь точку. описание моего дела: ' + User.professionformulation, res)
            break;
        case '/getmaterials':
            getMistral(promts.getmaterials, req.body.product, res)
            break;

        /*---------------- User ----------------*/
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
        case '/updateworkerstat':
            User.updateworkerstat(req.body.index, req.body.worker)
            break;
        case '/updateinventory':
            User.updateinventory(req.body.inventory)
            break;
        case '/removefrominventory':
            User.removefrominventory(req.body.item)
            break;

    }
}

module.exports = POSTmethod