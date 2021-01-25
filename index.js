//configure environment variables
require('dotenv').config()         
//bring express to app
const express = require('express');
const axios = require('axios')
const API_KEY = process.env.API_KEY;            
const db = require('./models');
const app = express();
//bring in session
const session = require('express-session')
// bring in passport
const passport = require('./config/ppConfig.js')
// bring in flash
const flash = require('connect-flash')
const isLoggedIn = require('./middleware/isLoggedIn.js')

//middleware to create different html files
app.set('view engine', 'ejs');     
//enable layouts
app.use(require('express-ejs-layouts'));      
//grab form content
app.use(express.urlencoded({ extended: false}));      
//session middleware
app.use(session({          
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))
//passport middleware
app.use(passport.initialize())
app.use(passport.session())
//flash middleware
app.use(flash())
//custom middleware
app.use((req, res, next)=>{
    //before every route, attach the flash messages and current user to res.locals
    res.locals.alerts = req.flash()
    res.locals.currentUser = req.user
    next() // tells express to move on to the next piece of middleware
})
app.use(require('morgan')('dev'));
// bring in auth to controllers
app.use('/auth', require('./controllers/auth.js'));     
//home page 
app.use('/watchlist', require('./controllers/watchlist'))
app.get('/', (req, res) => {     
   res.render('home')
})
//profile page
app.get('/profile', isLoggedIn, (req, res) => {       
    res.render('profile')
})



app.get('/results', (req, res) => {
  console.log(req.query)
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${req.query.searchBar}`)
    .then(response => {
      let movies = response.data
      console.log("MOVIERESPONSE", response.data)
      res.render('results', {movie: movies.results});
  });
  })
  
app.get('/results/:id', (req, res) => {
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${req.params.id}`)
    .then(response => {
      let movie = response.data
      res.render('show', {movie: movie})
    });
  })

// app.get('/faves', (req, res) => {
//   db.fave.findAll().then(faves => {
//     res.render('faves.ejs', {movies: faves})
//   })
// })

 
app.get('*', (req, res) => {
    res.render('./404')
})

const server = app.listen(process.env.PORT, () => {
    console.log(`auth app running on port ${process.env.PORT}` );
  });

  module.exports = server