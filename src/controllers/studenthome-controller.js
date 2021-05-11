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
          assert(zipcode.length == 6, "zipcode wrong format");
          assert(typeof zipcode === "string", "zipcode is missing!");
          assert(typeof city === "string", "city is missing!");
          assert(typeof phonenr === "string", "phone number is missing!");
          assert(phonenr.length == 10, "phone number wrong format"); 

          // checking for dupes
          var isFound = false;
          var QueryItem = database.db.filter(x => x.street == street && x.housenr == housenr)
          if (QueryItem.length > 0) {
              console.log(QueryItem)
              console.log("Je bent in de if statement")
              isFound = true;
          }

          assert(isFound == false, "Address is already registered, talk to your roommates")

          console.log("House data is valid");
          next();
        } catch (err) {
          console.log("Home data is invalid: ", err.message);
          next({ message: err.message, errCode: 400 });
        }
      },

      validateHomeForUpdate(req, res, next) {
        console.log("validate home");
        console.log(req.body);
        try {
          const { name, street, housenr, zipcode, city, phonenr } = req.body;
          assert(typeof name === "string", "name is missing!");
          assert(typeof street === "string", "street is missing!");
          assert(typeof housenr === "number", "housenumber is missing!");
          assert(zipcode.length == 6, "zipcode wrong format");
          assert(typeof zipcode === "string", "zipcode is missing!");
          assert(typeof city === "string", "city is missing!");
          assert(typeof phonenr === "string", "phone number is missing!");
          assert(phonenr.length == 10, "phone number wrong format"); 

          // checking for dupes
          var isFound = false;
          var QueryItem = database.db.filter(x => x.street == street && x.housenr == housenr)
          if (QueryItem.length > 0) {
              isFound = true;
          }

          assert(isFound == true, "Address doesn't exist")

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
        console.log(req.query)
        let city = req.query.city
        let name = req.query.name
        database.getAll(name, city, (err, result) => {
            if (err) {
                next(err)
            }
            if (result) {
                console.log(result)
                if (result.length == 0) {
                    res.status(404).json({ status: "no items found"})
                } else {
                    res.status(200).json({ status: "succes", result: result})
                }
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
                console.log(result)
                if (result.length > 0) {
                    res.status(200).json({ status: "succes", result: result})
                } else {
                    res.status(404).json({ status: "no items found"})
                }
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
                if (result.length == 0) {
                    res.status(404).json({ status: "No home with this ID"})
                } else {
                    res.status(200).json({ status: "succes", result: result})
                }

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