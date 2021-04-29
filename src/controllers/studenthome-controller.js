const database = require("../dao/database")
const log = require("tracer").console()

module.exports = {

    create: (req, res, next) => {
        log.info("studenthome.create called")
        const home = req.body;
        database.add(home, (err, result) => {
            if (err) {
                next(err)
            }
            if (result) {
                res.status(200).json({ status: "succes", result: result})
            }
        })
    },

    getAll: (req, res, next) => {
        log.info("studenthome.getAll called")
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
        log.info("studenthome.info called")
        const homeId = req.params.homeId
        database.info(homeId, (err, result) => {
            if (err) {
                next(err)
            }
            if (result) {
                res.status(200).json({ status: "succes", result: result})
            }
        })
    },

    update: (req, res, next) => {
        log.info("studenthome.update called")
        const homeId = req.params.homeId
        const home = req.body
        database.update(homeId, home,(err, result) => {
            if (err) {
                next(err)
            }
            if (result) {
                res.status(200).json({ status: "succes", result: result})
            }
        })
    },

    delete: (req, res, next) => {
        log.info("studenthome.delete called")
        const homeId = req.params.homeId
        database.delete(homeId, (err, result) => {
            if (err) {
                next(err)
            }
            if (result) {
                res.status(200).json({ status: "succes", result: result})
            }
        })
    },

    addStudent: (req, res, next) => {
        log.info("studenthome.addStudent called")
        const homeId = req.params.homeId
        const student = req.body
        database.addStudent(homeId, student, (err, result) => {
            if (err) {
                next(err)
            }
            if (result) {
                res.status(200).json({ status: "succes", result: result})
            }
        })
    }


}