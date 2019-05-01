require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const MOVIES = require('./movies-data-small.json')
const cors = require('cors')


const app = express()

app.use(morgan('dev'))
app.use(cors())++
app.use(helmet())



app.use(function validateBearerToken(req, res, next) {
    
   const apiToken = process.env.API_TOKEN
   const authToken = req.get('Authorization')
   console.log('validate bearer token middleware')
 if (!authToken || authToken.split(' ')[1] !== apiToken) {
     return res.status(401).json({ error: 'Unauthorized request' })
  }
   next()
 })



  app.get('/movie',function handleGetMovies(req, res) {
   let response =MOVIES.movies
   if(req.query.genre) {
       response = response.filter(movies => 
            movies.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        )
   }
      if(req.query.country) {
          response= response.filter(movies =>
            movies.country.toLowerCase().includes(req.query.country.toLowerCase())
                                   ) 
      }
      if(req.query.avg_vote) {
          response= response.filter(movies =>
            Number(movies.avg_vote) >= Number(req.query.avg_vote)
                                   ) 
      }
      
 res.json(response)
  })

 

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})