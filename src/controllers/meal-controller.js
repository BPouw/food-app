const database = require("../dao/meal-database")
const log = require("tracer").console()

module.exports = {
    create: (req, res, next) => {
        log.info("meal.create called")
        const meal = req.body;
        database.add(meal, (err, result) => {
            if (err) {
                next(err)
            }
            if (result) {
                res.status(200).json({ status: "succes", result: result})
            }
        })
    },

    update: (req, res, next) => {
        log.info("meal.update called")
        const meal = req.body;
        const id = req.params.mealId
        database.add(meal, id, (err, result) => {
            if (err) {
                next(err)
            }
            if (result) {
                res.status(200).json({ status: "succes", result: result})
            }
        })
    },

    update: (req, res, next) => {
        log.info("meal.update called")
        const meal = req.body;
        const id = req.params.mealId
        database.add(meal, id, (err, result) => {
            if (err) {
                next(err)
            }
            if (result) {
                res.status(200).json({ status: "succes", result: result})
            }
        })
    },

    getAll: (req, res, next) => {
        log.info("meal.getAll called")
        database.getAll((err, result) => {
            if (err) {
                next(err)
            }
            if (result) {
                res.status(200).json({ status: "succes", result: result})
            }
        })    
    },

    info: (req, res, next) => {
        log.info("meal.info called") 
        const id = req.params.mealId
        database.info(id, (err, result) => {
            if (err) {
                next(err)
            }
            if (result) {
                res.status(200).json({ status: "succes", result: result})
            }
        })
        
    },
    
    delete: (req, res, next) => {
        log.info("meal.delete called")
        const id = req.params.mealId
        database.delete(id, (err, result) => {
            if (err) {
                next(err)
            }
            if (result) {
                res.status(200).json({ status: "succes", result: result})
            }
        })
    }
}