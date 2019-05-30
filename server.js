const app = require('express')();
const bodyParser = require('body-parser')
const moment = require('moment');
const jsonParser = bodyParser.json();
const { validateDate } = require('./utilities')


function dateMiddleware(req, res, next) {
    let date;
    let selector = {
        POST: 'body',
        GET: 'query'
    }
    console.log(req.method)
    if(selector[req.method]){
        req.name = req[selector[req.method]].name
        req.lastname = req[selector[req.method]].lastname
        date = moment(req[selector[req.method]].birthday);
    }

    // if (req.query && req.query.birthday) {
    //     req.name = req.query.name;
    //     req.lastname = req.query.lastname;
    //     date = moment(req.query.birthday);
    // }

    // if(req.body && req.body.birthday){
    //     req.name = req.body.name;
    //     req.lastname = req.body.lastname;
    //     date = moment(req.body.birthday);
    // }

    req.validDate = validateDate(date);
    req.currentDate = moment();
    req.date = date;
    next();
}

function sendMsgToUser(req, res){
    if (req.validDate && req.name && req.lastname) {
        if (req.isYourBirthday) {
            res.end(`Hello ${req.name} ${req.lastname} happy birthday!`);
        } else {
            res.end(`Hello ${req.name}. You have ${req.daysForBirthday} days until your birthday!`);
        }
    } else {
        res.end(`Please include name, lastname, birthday(DD-MM-YYYY) as query parameters in the url`);
    }
    res.end();
}

function brithdayMiddleware(req, res, next) {
    if (!req.validDate) return next();
    const nextBirthday = moment()
    .year(req.currentDate.year())
    .month(req.date.month())
    .date(req.date.date());
    
    const daysForBirthday = nextBirthday.diff(req.currentDate, 'days');
    
    if (daysForBirthday < 0) {
        nextBirthday.add(1, 'year');
    }
    req.daysForBirthday = nextBirthday.diff(req.currentDate, 'days');
    req.isYourBirthday = +req.daysForBirthday === 0
    return next();
}

app.get('/', dateMiddleware, brithdayMiddleware, sendMsgToUser);
app.post('/', jsonParser, dateMiddleware, brithdayMiddleware, sendMsgToUser );

app.listen(8765);