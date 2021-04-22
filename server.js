const express = require('express')
const app = express()
const port = process.env.PORT || 3000

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
  res.status(200)
  res.json(result)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})