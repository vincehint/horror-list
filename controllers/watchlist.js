let express = require('express')
let router = express.Router()

router.get('/results', (req, res) => {
    console.log('search results')
})

router.post('/results', (req, res) => {
    res.render('something')
})

module.exports = router