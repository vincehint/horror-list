let express = require('express');
let router = express.Router();
const db = require('../models');
const passport = require('../config/ppConfig.js')

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
            passport.authenticate('local', {
                successRedirect: '/',
                succesFlash: 'Account created and user logged in!'
            })(req, res)
           // res.send(`Created a new user Profile for ${user.email}`)
        } else {
            req.flash('error', 'An account with that email already exists, did you mean to log in?')
            res.redirect('/auth/login')
        }
    })
    .catch(err=>{
        req.flash('error', err.message)
        res.redirect('/auth/signup')
    })
});

router.get('/login', (req, res) => {
    res.render('auth/login')
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/login',
    successRedirect: '/',
    successFlash: 'You are now logged in :)',
    failureFlash: 'Invalid email or password :('
}))

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
});


module.exports = router;