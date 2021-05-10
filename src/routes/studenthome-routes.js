const express = require("express")
const studenthousecontroller = require("../controllers/studenthome-controller")
const router = express.Router()

router.use(function timeLog(req, res, next) {
    console.log("Time: ", Date.now())
    next()
})

router.post("/studenthome", studenthousecontroller.validateHome, studenthousecontroller.create) // maak studentenhuis
router.get("/studenthome", studenthousecontroller.getAll) // overzicht studenthuizen
router.get("/studenthome/:homeId", studenthousecontroller.info) // details van studenthuis
router.put("/studenthome/:homeId", studenthousecontroller.validateHome, studenthousecontroller.update) // update studenthuis
router.delete("/studenthome/:homeId", studenthousecontroller.delete) // verwijder studenthuis
router.put("/studenthome/:homeId/user", studenthousecontroller.addStudent) // voeg student toe aan studenthuis

module.exports = router;

