const GetAllEmoji = require("./GETMethods/getemoji")
const getMistral = require("./GETMethods/getmistral")
const motivation = require( '../data/motivation.json')
const demotivation = require( '../data/demotivation.json')


function GETmethod(req, res) {
    switch (req.path) {
        case '/getdata':
          res.json({ answer: GetAllEmoji() })  
            break;
        case '/getmotivation':
          res.json({ answer: motivation })  
            break;
        case '/getdemotivation':
          res.json({ answer: demotivation })  
            break;

    }
}

module.exports = GETmethod