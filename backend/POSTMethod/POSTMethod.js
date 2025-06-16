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
        case '/settime':
            User.settime(req.body.time)
            break;
        case '/setuserinfo':
            console.log(req.body.user.name);
            
            User.setname(req.body.user.name)
            User.settime(req.body.user.time)
            User.setrumors(req.body.user.rumors)
            User.setday(req.body.user.day)
            User.skills = req.body.user.skills
            User.setprofessionformulation(req.body.user.professionformulation)
            User.notes = req.body.user.notes
            User.workers = req.body.user.workers
            User.invadersattemps = req.body.user.invadersattemps
            User.updateinventory(req.body.user.inventory)
            User.setmoney(req.body.user.inventory)
            User.productionArray = req.body.user.productionArray

            break;
        case '/setmoney':
            req.body.money != User.money && User.setmoney(req.body.money)
            break;
        case '/setday':
            User.setday(req.body.day)
            break;
        case '/addnewnote':
            User.addnewnote(req.body.note)
            break;
        case '/updateskill':
            User.updateskill(req.body.skill, req.body.value)
            break;
        case '/addnewworker':
            User.addnewworker(req.body.worker)
            break;
        case '/deletemyworker':
            User.deletemyworker(req.body.worker)
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