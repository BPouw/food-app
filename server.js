const express = require('express')
const log = require("tracer").console()
const app = express()
const port = process.env.PORT || 3000

const mealroutes = require("./src/routes/meal-routes")
const homeroutes = require("./src/routes/studenthome-routes")

app.use(express.json())

app.all("*", (req, res, next) => {
  const reqMethod = req.method
  const reqUrl = req.originalUrl
  console.log("Request requested: "  + reqMethod + " " + reqUrl)
  next()
})

app.use("/api", mealroutes, homeroutes)

app.get('/info', (req, res) => {
  log.info("info aangeroepen")
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

module.exports = app;