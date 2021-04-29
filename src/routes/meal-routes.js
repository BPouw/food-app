const express = require("express")
const mealcontroller = require("../controllers/studenthome-controller")
const { route } = require("./studenthome-routes")
const router = express.Router()

router.use(function timeLog(req, res, next) {
    console.log("Time: ", Date.now())
    next()
})

router.post("/api/studenthome/:homeId/meal", mealcontroller.) // Create meal
router.put("/api/studenthome/:homeId/meal/:mealId", mealcontroller.) // Update meal
router.get("/api/studenthome/:homeId/meal", mealcontroller.) // get all meals within a home
router.get("/api/studenthome/:homeId/meal/:mealId", mealcontroller.) // Info meal
router.delete("/api/studenthome/:homeId/meal/:mealId", mealcontroller.) // Delete meal

module.exports = router;

