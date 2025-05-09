const GetAllEmoji = require("./GETMethods/getemoji")
const getMistral = require("../POSTMethod/POSTMethods/getmistral")
const motivation = require('../data/motivation.json')
const demotivation = require('../data/demotivation.json')
const User = require('../data/userdata.js')

function GETmethod(req, res) {
  switch (req.path) {
    case '/getdata':
      res.json({ answer: GetAllEmoji() })
      break;
    case '/getexamplename':
      getMistral('examplename', User.professionformulation, res)
      break;
    case '/getprofessionformulation':
      res.json({ answer: User.professionformulation })
      break;
    case '/getmotivation':
      res.json({ answer: motivation })
      break;
    case '/getdemotivation':
      res.json({ answer: demotivation })
      break;
    case '/getsteps':
      getMistral('steps', User.professionformulation, res)
      break;
    case '/getnotes':
      res.json({ notes: User.notes })
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
  }
}

module.exports = GETmethod