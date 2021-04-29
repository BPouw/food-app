const express = require("express")
const studenthousecontroller = require("../controllers/studenthome-controller")
const router = express.Router()

router.use(function timeLog(req, res, next) {
    console.log("Time: ", Date.now())
    next()
})

router.post("/api/studenthome", studenthousecontroller.) // maak studentenhuis
router.get("/api/studenthome?name=:name&city=:city", studenthousecontroller.) // overzicht studenthuizen
router.get("/api/studenthome/:homeId", studenthousecontroller.) // details van studenthuis
router.put("/api/studenthome/:homeId", studenthousecontroller.) // update studenthuis
router.delete("/api/studenthome/:homeId", studenthousecontroller.) // verwijder studenthuis
router.put("/api/studenthome/:homeId/user", studenthousecontroller.) // voeg student toe aan studenthuis

module.exports = router;

