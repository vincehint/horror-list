//configure environment variables
require('dotenv').config()         
//bring express to app
const express = require('express');
const axios = require('axios')
const API_KEY = process.env.API_KEY;            
const db = require('./models');
const app = express();
const methodOverride = require('method-override')
const async = require('async')
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
// bring in auth to controllers
app.use('/auth', require('./controllers/auth.js'));     
//home page 
//app.use('/watchlist', require('./controllers/watchlist'))
app.get('/', (req, res) => {     
   res.render('home')
})
//profile page
app.get('/profile', isLoggedIn, (req, res) => {       
    res.render('profile')
})



app.get('/results', (req, res) => {
  //console.log(req.query)
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${req.query.searchBar}`)
    .then(response => {
      let movies = response.data
      //console.log("MOVIERESPONSE", response.data)
      res.render('results', {movies: movies.results});
  });
  })
  
app.get('/results/:id', (req, res) => {
    axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${API_KEY}`)
    .then(response => {
      let movie = response.data
      //es.send(movie)
      res.render('show', {movie: movie})
    });
  })

app.get('/horrorlist', (req, res) => {
  // db.faves.findAll({
  //   where: {
  //     userId: req.user.id
  //   }
  // }).then(faves => {
  //   console.log(faves)
  //   
  // })
  req.user.getMovies().then((movies) => {
    res.render('horrorlist', {movies: movies})
  })
})
app.post('/horrorlist', (req, res) => {
  // res.send(req.body)
    db.movie.findOrCreate({
      where: {
        apiId: req.body.apiId 
      },
      defaults: {
        title: req.body.title,
        poster_path: req.body.poster_path,
        overview: req.body.overview,
        original_title: req.body.original_title,
        release_date: req.body.release_date,
        original_language: req.body.original_language
      }
    }).then(([movie, wasCreated]) => {
      console.log(`Adding ${movie.title} to ${req.user.name}'s Horror List.`)
      req.user.addMovie(movie)
      res.redirect('/horrorlist')
    })
})

app.get('/movie/:id', (req, res) => {
  axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${API_KEY}`)
  .then(response => {
    let movie = response.data
    //es.send(movie)
    res.render('show', {movie: movie})
  })
  .catch(error => {
    console.log(error)
  })
})

app.delete('/movie/:id', (req, res) => {
  
  db.movie.destroy({
    where: {
      id: req.params.id
    }
  }).then (() => {
    res.redirect('/horror')
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

 
app.get('*', (req, res) => {
    res.render('./404')
})

const server = app.listen(process.env.PORT, () => {
    console.log(`auth app running on port ${process.env.PORT}` );
  });

  module.exports = server