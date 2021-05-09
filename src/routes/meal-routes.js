const express = require("express")
const mealcontroller = require("../controllers/meal-controller")
const { route } = require("./studenthome-routes")
const router = express.Router()

router.use(function timeLog(req, res, next) {
    console.log("Time: ", Date.now())
    next()
})

router.post("/studenthome/:homeId/meal", mealcontroller.validateMeal, mealcontroller.create) // Create meal
router.put("/studenthome/:homeId/meal/:mealId", mealcontroller.update) // Update meal
router.get("/studenthome/:homeId/meal", mealcontroller.getAll) // get all meals within a home
router.get("/studenthome/:homeId/meal/:mealId", mealcontroller.info) // Info meal
router.delete("/studenthome/:homeId/meal/:mealId", mealcontroller.delete) // Delete meal

module.exports = router;

