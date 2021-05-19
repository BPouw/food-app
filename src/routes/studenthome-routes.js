const express = require("express");
const studenthousecontroller = require("../controllers/studenthome-controller");
const usercontroller = require("../controllers/user-controller");
const router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

router.post(
  "/studenthome",
  usercontroller.validateToken,
  studenthousecontroller.validateHome,
  studenthousecontroller.create
); // maak studentenhuis
router.get("/studenthome", studenthousecontroller.getAll); // overzicht studenthuizen
router.get("/studenthome/:homeId", studenthousecontroller.info); // details van studenthuis
router.put(
  "/studenthome/:homeId",
  usercontroller.validateToken,
  studenthousecontroller.validateHome,
  studenthousecontroller.update
); // update studenthuis
router.delete(
  "/studenthome/:homeId",
  usercontroller.validateToken,
  studenthousecontroller.delete
); // verwijder studenthuis

module.exports = router;
