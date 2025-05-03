const getMistral = require("./POSTMethods/getmistral")


function POSTmethod(req, res) {
    switch (req.path) {
        case '/getwinningtext':
            getMistral('emoji', req.body.promt, res)
            break;

    }}

    module.exports = POSTmethod