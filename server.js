const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.all("*", (req, res, next) => {
  const reqMethod = req.method
  const reqUrl = req.originalUrl
  console.log("Request requested: "  + reqMethod + " " + reqUrl)
  next()
})

app.get('/', (req, res) => {
  let result = {
    name : "Jimmy"
  }
  res.status(418)
  res.json(result)
})

app.get('/info', (req, res) => {
  let result = {
    naam : "Boris Pouw",
    studentnr : 2116083,
    beschrijving: "Dit is de backend van een app om eten te delen",
    url: "N/A"
  }
  res.status(200).json(result)
})

//error message voor verkeerde urls
app.all("*", (req, res) => {
  const error = {
    message: "Endpoint does not exist"
  }
  res.status(400);
  res.json(error)
})

//error handler
app.use("*", (error, req, res, next) => {
  res.status(500).json({error: error})
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = server;