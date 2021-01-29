//configure environment variables
require('dotenv').config()         
//bring express to app
const express = require('express');
//axios is how we search databases
const axios = require('axios')
//api key is our personal key to be able to access the database
const API_KEY = process.env.API_KEY;     
// lets us use models to be able to store things from the database       
const db = require('./models');
// lets us use express in our project
const app = express();
// Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it
const methodOverride = require('method-override')

//const async = require('async')
//bring in session
const session = require('express-session')
// bring in passport
const passport = require('./config/ppConfig.js')
// bring in flash
const flash = require('connect-flash')
// allows  us to use isLoggedIn middleware that checks to see if a user is logged in in order to view a page
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
// an instance of methodOverride
app.use(methodOverride("_method"))
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
   
//home page 
//app.use('/watchlist', require('./controllers/watchlist'))
app.get('/', (req, res) => {     
   res.render('home')
})
//profile page
app.get('/profile', isLoggedIn, (req, res) => {       
    res.render('profile')
})



app.get('/results', (req, res) => {  //path for the results page from the search bar
  //console.log(req.query)
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${req.query.searchBar}`)
    .then(response => {
      let movies = response.data 
      //console.log("MOVIERESPONSE", response.data)
      res.render('results', {movies: movies.results});
  });
  })
// below creates a path for the show page of a movie by searching the id.
app.get('/results/:id', (req, res) => {
    axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${API_KEY}`)
    .then(response => {
      let movie = response.data
      //es.send(movie)
      res.render('show', {movie: movie}) //renders the movie details from the database movies
    });
  })


app.get('/movie/:id', (req, res) => { //this pulls up a show page for a movie based on the id stored by searching the title
  axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${API_KEY}`)
  .then(response => {
    let movie = response.data
    //es.send(movie)
    res.render('show', {movie: movie}) //renders the show page on the screen for the movie.
  })
  .catch(error => {
    console.log(error) //shows us errors if the page crashes.
  })
})

app.delete('/movie/:id', (req, res) => {  //the route to delete a movie from the web page.
  
  db.movie.destroy({  //the actual delete funtion
    where: {
      id: req.params.id  //which movie to delete
    }
  }).then (() => {
    res.redirect('/horrorlist') //redirects back to horror list page minus movie deleted
  })
 })

//  app.get('/watchlist', (req, res) => {
//   //  req.user.getMovies().then((movies) => {
//   //    res.render('watchlist', {movies: movies})
//   //  })
//     db.watchlist.findAll({
//       where:{
//         userId: req.user.id
//       }
//     }).then(watchlist => {
//       //res.s(watchlist)
//       let movies= async() => {
//         await watchlist.forEach(entry => {
//         db.movie.findOne({
//           where: {
//             id: entry.movieId
//           }
//         }).then(movie => {
//           console.log(movie)
//           return movie
//         })
//       }).then(movies => {
//         res.send(movies)
//       })
//     }
//     console.log(movies())
//     })
//  })
//  app.post('/watchlist', (req, res) => {
//    db.movie.findOrCreate({
//      where: {
//        apiId: req.body.movieId
//      },
//      defaults: {
//        title: req.body.title,
//        poster_path: req.body.poster_path,
//        overview: req.body.overview,
//        original_title: req.body.original_title,
//        release_date: req.body.release_date,
//        original_language: req.body.original_language
//      }
//    }).then(([movie, wasCreated]) => {
//      console.log(`Adding ${movie.title} to ${req.user.name}'s watchlist.`)
//      db.watchlist.create({
//        userId: req.user.id,
//        movieId: movie.id
//      }).then(()=> {
//      res.redirect('/watchlist')
//     })
//    })
//  })

//  app.get('/movie/:id', (req, res) => {
//    axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${API_KEY}`)
//    .then(response => {
//      let movie = response.data
//      res.render('show', {movie: movie})
//    })
//    .catch(error => {
//      console.log(error)
//    })
//  })

//  app.delete('/movie/:id', (req, res) => {
//    db.movie.destroy({
//      where: {
//        id: req.params.id  
//      }
//    }).then (() => {
//      res.redirect('back')
//    })
//  })
// bring in auth to controllers
app.use('/auth', require('./controllers/auth.js')); 
app.use('/horrorlist', require('./controllers/horrorlist.js'));
 
app.get('*', (req, res) => {  //renders the 404 page when we can't reach a page.
    res.render('./404')
})

 

const server = app.listen(process.env.PORT, () => {   //sets the site to the server so we can use it
    console.log(`auth app running on port ${process.env.PORT}` );
  });

  module.exports = server