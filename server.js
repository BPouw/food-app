const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  let result = {
    name : "Jimmy"
  }
  res.status(418)
  res.json(result)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})