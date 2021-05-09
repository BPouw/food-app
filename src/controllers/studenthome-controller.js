const database = require("../dao/home-database")
const assert = require("assert")
const log = require("tracer").console()

module.exports = {

    validateHome(req, res, next) {
        console.log("validate home");
        console.log(req.body);
        try {
          const { name, street, housenr, zipcode, city, phonenr } = req.body;
          assert(typeof name === "string", "name is missing!");
          assert(typeof street === "string", "street is missing!");
          assert(typeof housenr === "number", "housenumber is missing!");
          assert(typeof zipcode === "string", "zipcode is missing!");
          assert(typeof city === "string", "city is missing!");
          assert(typeof phonenr === "string", "phone number is missing!");
          console.log("House data is valid");
          next();
        } catch (err) {
          console.log("Home data is invalid: ", err.message);
          next({ message: err.message, errCode: 400 });
        }
      },

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
        database.getById(homeId, (err, result) => {
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