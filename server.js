const express = require("express")
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

app.use("/api", mealroutes)
app.use("/api", homeroutes)

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

// Catch-all route
app.all("*", (req, res, next) => {
  console.log("Catch-all endpoint aangeroepen");
  next({ message: "Endpoint '" + req.url + "' does not exist", errCode: 401 });
});

// Errorhandler
app.use((error, req, res, next) => {
  console.log("Errorhandler called! ", error);
  res.status(error.errCode).json({
    error: "Some error occurred",
    message: error.message,
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;