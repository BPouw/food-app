const express = require("express")
const studenthousecontroller = require("../controllers/studenthome-controller")
const router = express.Router()

router.use(function timeLog(req, res, next) {
    console.log("Time: ", Date.now())
    next()
})

router.post("/api/studenthome", studenthousecontroller.create) // maak studentenhuis
router.get("/api/studenthome?name=:name&city=:city", studenthousecontroller.getAll) // overzicht studenthuizen
router.get("/api/studenthome/:homeId", studenthousecontroller.info) // details van studenthuis
router.put("/api/studenthome/:homeId", studenthousecontroller.update) // update studenthuis
router.delete("/api/studenthome/:homeId", studenthousecontroller.delete) // verwijder studenthuis
router.put("/api/studenthome/:homeId/user", studenthousecontroller.addStudent) // voeg student toe aan studenthuis

module.exports = router;

