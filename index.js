require('dotenv').config() //configure environment variables
let express = require('express'); //bring express to app
//let db = require('./models');
let app = express();

app.set('view engine', 'ejs');//middleware to create different html files
app.use(require('express-ejs-layouts'));//enable layouts
app.use(express.urlencoded({ extended: false}));//grab form content
app.use('/auth', require('./controllers/auth.js'));// bring in auth to controllers

//home page
app.get('/', (req, res) => {
    res.render('home.ejs');
})
//profile page
app.get('/profile', (req, res) => {
    res.render('profile.ejs');
})






app.listen(process.env.PORT, () => {
    console.log(`auth app running on port ${process.env.PORT}` );
  });