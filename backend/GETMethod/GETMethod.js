const GetAllEmoji = require("./GETMethods/getemoji")
const getMistral = require("../POSTMethod/POSTMethods/getmistral")

const motivation = require('../data/motivation.json')
const demotivation = require('../data/demotivation.json')

const User = require('../data/userdata.js')

const refusal = require('../data/refusal.json')
const agreement = require('../data/agreement.json')
const offers = require('../data/offers.json')
const deal = require('../data/deal.json')
const breakdeal = require('../data/breakdeal.json')
const concessions = require('../data/concessions.json')
const notenoughmoney = require('../data/notenoughmoney.json')
const sellerrefusal = require('../data/sellerrefusal.json')
const sellerlucky = require('../data/sellerlucky.json')
const wrongproduct = require('../data/wrongproduct.json')
const noanswer = require('../data/noanswer.json')

function GETmethod(req, res) {
  switch (req.path) {

    /*---------------- Mistral ----------------*/
    case '/getexamplename':
      getMistral('examplename', User.professionformulation, res)
      break;
    case '/getsteps':
      getMistral('steps', User.professionformulation, res)
      break;
    case '/getworkers':
      getMistral('getworkers', '', res)
      break;
    case '/getmaterials':
      getMistral('getmaterials', User.professionformulation, res)
      break;
    case '/getmaterialannouncement':
      getMistral('getmaterialannouncement', '', res)
      break;
      
    /*---------------- User ----------------*/
    case '/getnotes':
      res.json({ notes: User.notes })
      break;
    case '/getmoney':
      res.json({ money: User.money })
      break;
    case '/getinventory':
      res.json({ inventory: User.inventory })
      break;
    case '/getprofessionformulation':
      res.json({ answer: User.professionformulation })
      break;
    case '/getmyworkers':
      res.json({ workers: User.workers })
      break;

    /*---------------- JSON ----------------*/
    case '/getmessages':
      res.json({ refusal: refusal, agreement: agreement, offers: offers, deal: deal, breakdeal: breakdeal, concessions: concessions, notenoughmoney: notenoughmoney })
      break;
    case '/getmotivation':
      res.json({ answer: motivation })
      break;
    case '/getdemotivation':
      res.json({ answer: demotivation })
      break;
    case '/getselleranswers':
      res.json({ refuse: sellerrefusal, lucky: sellerlucky, wrong: wrongproduct, noanswer: noanswer })
      break;

    case '/getdata':
      res.json({ answer: GetAllEmoji() })
      break;
  }
}

module.exports = GETmethod