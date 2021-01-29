const express = require('express')
const router = express.Router()
let db = require('../models')
// below creates a path for a users horror list
router.get('/', (req, res) => {
    // db.faves.findAll({
    //   where: {
    //     userId: req.user.id
    //   }
    // }).then(faves => {
    //   console.log(faves)
    //   
    // })
    req.user.getMovies().then((movies) => {
      res.render('horrorlist', {movies: movies})  //renders the horror list page with a users movies
    })
  })
  router.post('/', (req, res) => { //This adds or finds a movie in a users database so that we don't add the same movie twice.
    // res.send(req.body)
      db.movie.findOrCreate({
        where: {
          apiId: req.body.apiId //find a movie from the database based on the title/id that was in the search form
        },
        defaults: {  // These are the pieces of info we will be using throughout the site on the movie we're storing
          title: req.body.title,  //movie title
          poster_path: req.body.poster_path,  //poster for movie
          overview: req.body.overview,  // what the movie is about
          original_title: req.body.original_title, //the original (probably weird) title
          release_date: req.body.release_date, // when the movie was released
          original_language: req.body.original_language //what the original language in the film was
        }
      }).then(([movie, wasCreated]) => {
        console.log(`Adding ${movie.title} to ${req.user.name}'s Horror List.`)
        req.user.addMovie(movie) //actually adds the movie to the database
        res.redirect('/horrorlist')  //redirects to the horror list with the save movie included.
      })
  })

  module.exports = router

