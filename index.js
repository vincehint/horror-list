//configure environment variables
require('dotenv').config()         
//bring express to app
let express = require('express');            
//let db = require('./models');
let app = express();
//bring in session
const session = require('express-session')
// bring in passport
const passport = require('./config/ppConfig.js')
// bring in flash
const flash = require('connect-flash')
const isLoggedIn = require('./middleware/isLoggedIn.js')
const API_KEY = process.env.API_KEY;
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
// bring in auth to controllers
app.use('/auth', require('./controllers/auth.js'));     
//home page
app.get('/', (req, res) => {     
   res.render('home')
})
//profile page
app.get('/profile', isLoggedIn, (req, res) => {       
    res.render('profile.ejs')
})

app.get('*', (req, res) => {
    res.render('./404.ejs')
})

app.get('/results', (req, res) => {
    axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=b5e71871c61ba9cafb3c1f7fcf1243ec&with_genres=27`)
    .then(response => {
      console.log(response)
      console.log(req, res)
      res.render('results', {movies: response.data.Search});
  });
  })
  
  app.get('/results/:id', (req, res) => {
    axios.get(`https://api.themoviedb.org/3/movie/550?api_key=${API_KEY}&i=${req.params.id}&with_genres=27`)
    .then(response => {
      res.render('show', {movie: response.data})
    });
  })


app.listen(process.env.PORT, () => {
    console.log(`auth app running on port ${process.env.PORT}` );
  });