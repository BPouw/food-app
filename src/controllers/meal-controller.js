const log = require("tracer").console();
const assert = require("assert");
const config = require("../dao/config");
const logger = config.logger;
const pool = require("../dao/database");

module.exports = {
  validateMeal(req, res, next) {
    console.log("validate meal");
    console.log(req.body);
    try {
      const { name, descr, available, price, allergies, ingredients } =
        req.body;
      assert(typeof name === "string", "name is missing!");
      assert(typeof descr === "string", "description is missing!");
      assert(typeof available === "date", "date available is missing!");
      assert(typeof price === "number", "price is missing!");
      assert(typeof allergies === "string", "allergy information is missing!");
      assert(typeof ingredients === "string", "ingredients are missing!");
      console.log("Meal data is valid");
      next();
    } catch (err) {
      console.log("Meal data is invalid: ", err.message);
      next({ message: err.message, errCode: 400 });
    }
  },

  create: (req, res, next) => {
    log.info("meal.create called");
    const meal = req.body;
    database.add(meal, (err, result) => {
      if (err) {
        next(err);
      }
      if (result) {
        res.status(200).json({ status: "succes", result: result });
      }
    });
  },

  update: (req, res, next) => {
    log.info("meal.update called");
    const meal = req.body;
    const id = req.params.mealId;
    database.add(meal, id, (err, result) => {
      if (err) {
        next(err);
      }
      if (result) {
        res.status(200).json({ status: "succes", result: result });
      }
    });
  },

  getAll: (req, res, next) => {
    log.info("meal.getAll called");
    let sqlQuery = "SELECT * from meal";
    logger.debug("getAll", "sqlQuery =", sqlQuery);

    pool.getConnection(function (err, connection) {
      if (err) {
        res.status(400).json({
          message: "GetAll failed!",
          error: err,
        });
      }
      if (connection) {
        connection.query(sqlQuery, (error, results, fields) => {
          connection.release();
          if (error) {
            res.status(400).json({
              message: "GetAll failed!",
              error: error,
            });
          }
          if (results) {
            logger.trace("results: ", results);
            const mappedResults = results.map((item) => {
              return {
                ...item,
              };
            });
            res.status(200).json({
              result: mappedResults,
            });
          }
        });
      }
    });
  },

  info: (req, res, next) => {
    log.info("meal.info called");
    const id = req.params.mealId;
    database.info(id, (err, result) => {
      if (err) {
        next(err);
      }
      if (result) {
        res.status(200).json({ status: "succes", result: result });
      }
    });
  },

  delete: (req, res, next) => {
    log.info("meal.delete called");
    const id = req.params.mealId;
    database.delete(id, (err, result) => {
      if (err) {
        next(err);
      }
      if (result) {
        res.status(200).json({ status: "succes", result: result });
      }
    });
  },
};
