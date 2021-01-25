let express = require('express')
const axios = require('axios')
const API_KEY = process.env.API_KEY;  
let router = express.Router()

router.get('/results', (req, res) => {
    axios.get(`https://api.themoviedb.org/3/movie/550?api_key=${API_KEY}&s=${req.query.searchBar}&with_genres=27`)
    .then(response => {
      console.log(res)
      res.render('results', {movies: response.data.Search});
  });
  })

router.get('/results/:id', (req, res) => {
    axios.get(`https://api.themoviedb.org/3/movie/550?api_key=${API_KEY}&i=${req.params.id}&with_genres=27`)
    .then(response => {
      res.render('show', {movie: response.data})
    });
  })

module.exports = router