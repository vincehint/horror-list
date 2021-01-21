let express = require('express');
let router = express.Router();
const db = require('../models');


router.get('/signup', (req, res) => {
    res.render('auth/signup')
});

router.post('/signup', (req, res) => {
    // find or create a new user
    db.user.findOrCreate({
        where: {
            email: req.body.email
        },
        defaults: {
            name: req.body.name,
            password: req.body.password
        }
    })
    .then(([user, wasCreated])=> {
        if(wasCreated){
            res.send(`Created a new user Profile for ${user.email}`)
        } else {
            res.send('Email already exists! Try logging in???')
        }
    })
});

router.get('/login', (req, res) => {
    res.render('auth/login')
});

router.post('/login', (req, res) => {
    db.user.findOne({
        where: {
            email: req.body.email,
            password: req.body.password
        }
    })
    .then(foundUser => {
        if(foundUser){
            res.send(`Logged in the following user: ${foundUser.name}`)
        }else {
            res.send('hmm can\'t find that one, try signing up?')
        }
    })
    .catch(err => {
        console.log(err)
        res.send('There was an error logging in. Check the console???')
    })
});

router.get('/logout', (req, res) => {
    res.send('You have been logged out.')
});


module.exports = router;