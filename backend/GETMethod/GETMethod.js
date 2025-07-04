const GetAllEmoji = require("./GETMethods/getemoji")
const getLLM = require("../POSTMethod/POSTMethods/getLLM.js")

const motivation = require('../data/race/motivation.json')
const demotivation = require('../data/race/demotivation.json')

const User = require('../data/userdata.js')
const promts = require('../data/promts.json')

const refusal = require('../data/providers/refusal.json')
const agreement = require('../data/providers/agreement.json')
const offers = require('../data/providers/offers.json')
const deal = require('../data/providers/deal.json')
const breakdeal = require('../data/providers/breakdeal.json')
const concessions = require('../data/providers/concessions.json')
const notenoughmoney = require('../data/providers/notenoughmoney.json')

const sellerrefusal = require('../data/buyer/sellerrefusal.json')
const sellerlucky = require('../data/buyer/sellerlucky.json')
const wrongproduct = require('../data/buyer/wrongproduct.json')
const noanswer = require('../data/buyer/noanswer.json')

const newperson = require('../data/start/newperson.json')
const ownerisback = require('../data/start/ownerisback.json')
const newpersonbefore = require('../data/start/newpersonbefore.json')
 
const fate = require('../data/slots/fate.json')
const choise = require('../data/slots/choise.json')

const hate = require('../data/invaders/hating.json')
const pride = require('../data/invaders/pride.json')
const getRandom = require("./GETMethods/getRandom.js")

function GETmethod(req, res) {
  switch (req.path) {

    case '/getstartstates':
      res.json({ inventory: User.inventory, day: User.day, productionArray: User.productionArray, seconds: User.time, skills: User.skills, money: User.money })
      break;

    /*---------------- LLM ----------------*/
    case '/getexamplename':
      getLLM(promts.examplename, User.professionformulation, res)
      break;
    case '/getsteps':
      getLLM(promts.steps, User.professionformulation, res)
      break;
    case '/getworkers':
      getLLM(promts.getworkers, '', res)
      break;
    case '/getmaterialannouncement':
      getLLM(promts.getmaterialannouncement, '', res)
      break;

    /*---------------- User ----------------*/
    case '/getnotes':
      res.json({ notes: User.notes })
      break;

    case '/getday':
      res.json({ day: User.day })
      break;

    case '/getskills':
      res.json({ skills: User.skills })
      break;

    case '/getmoney':
      res.json({ money: User.money })
      break;

    case '/gettime':
      res.json({ seconds: User.time })
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

    case '/getproductionArray':
      res.json({ productionArray: User.productionArray })
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

    case '/getstart':
      res.json({ newperson: newperson[getRandom(0, newperson.length)], ownerisback: ownerisback[getRandom(0, ownerisback.length)], newpersonbefore: newpersonbefore[getRandom(0, newpersonbefore.length)] })
      break;
    case '/getslots':
      res.json({ fate: fate[getRandom(0, fate.length)], choise: choise[getRandom(0, choise.length)] })
      break;
    case '/getinvaders':
      res.json({ hate: hate, pride: pride })
      break;

    /*---------------- API ----------------*/

    case '/getdata':
      res.json({ answer: GetAllEmoji() })
      break;
  }
}

module.exports = GETmethod