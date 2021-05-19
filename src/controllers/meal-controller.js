const log = require("tracer").console();
const assert = require("assert");
const config = require("../dao/config");
const logger = config.logger;
const pool = require("../dao/database");

module.exports = {
  validateMeal(req, res, next) {
    logger.info("validate meal");
    logger.info(req.body);

    try {
      const { name, descr, available, price, allergies, ingredients } =
        req.body;
      assert(typeof name === "string", "name is missing!");
      assert(typeof descr === "string", "description is missing!");
      assert(typeof available === "string", "date available is missing!");
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
    logger.info("meal.create called");
    const meal = req.body;
    let { name, descr, available, price, allergies, ingredients } = meal;

    const userid = req.userId;
    const homeid = req.params.homeId;

    var datenow = new Date().toLocaleString();

    var parsedDate = Date.parse(available);
    dateavailable = new Date(parsedDate);
    logger.info(dateavailable);

    datenow = new Date().toISOString().slice(0, 19).replace("T", " ");

    logger.info(datenow);
    logger.info(dateavailable);

    let sqlQuery =
      "INSERT INTO `meal` (`Name`, `Description`, `Ingredients`, `Allergies`, `CreatedOn`, `OfferedOn`, `Price`, `UserID`, `StudenthomeID`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    logger.debug("createMeal", "sqlQuery =", sqlQuery);

    pool.getConnection(function (err, connection) {
      if (err) {
        logger.error("createMeal", err);
        res.status(400).json({
          message: "createMeal failed getting connection!",
          error: err,
        });
      }
      if (connection) {
        // Use the connection
        connection.query(
          sqlQuery,
          [
            name,
            descr,
            ingredients,
            allergies,
            datenow,
            dateavailable,
            price,
            userid,
            homeid,
          ],
          (error, results, fields) => {
            // When done with the connection, release it.
            connection.release();
            // Handle error after the release.
            if (error) {
              logger.error("createMeal", error.toString());
              res.status(400).json({
                message: "createMeal failed calling query",
                error: error.toString(),
              });
            }
            if (results) {
              logger.trace("results: ", results);
              res.status(200).json({
                result: {
                  id: results.insertId,
                  ...meal,
                },
              });
            }
          }
        );
      }
    });
  },

  update: (req, res, next) => {
    logger.info("meal.update called");
    const mealid = req.params.mealId;
    const userid = req.userId;
    const homeid = req.params.homeId;
    logger.debug(
      "update",
      "mealid =",
      mealid,
      "homeid: ",
      homeid,
      "userid =",
      userid
    );
    const meal = req.body;
    let {
      Name,
      Description,
      Ingredients,
      Allergies,
      CreatedOn,
      OfferedOn,
      Price,
    } = meal;
    // get connection
    pool.getConnection(function (err, connection) {
      // if error
      if (err) {
        res.status(400).json({
          message: "update failed!",
          error: err,
        });
      }
      // use connection
      let sqlQuery =
        "UPDATE meal SET Name = ?, Description = ?, Ingredients = ?, Allergies = ?, CreatedOn = ?, OfferedOn = ?, Price = ? WHERE ID = " +
        mealid +
        " AND UserID = " +
        userid +
        " AND StudenthomeID = " +
        homeid;
      connection.query(
        sqlQuery,
        [
          Name,
          Description,
          Ingredients,
          Allergies,
          CreatedOn,
          OfferedOn,
          Price,
        ],
        (error, results, fields) => {
          connection.release();
          if (error) {
            res.status(400).json({
              message: "Could not update item",
              error: error,
            });
          }
          if (results) {
            // if nothing changed error
            if (results.affectedRows === 0) {
              logger.trace("item was NOT updated");
              res.status(401).json({
                result: {
                  error:
                    "Item not found or you do not have access to this item",
                },
              });
              // if everything is succesfull the home is updated
            } else {
              logger.trace("item was updated");
              res.status(200).json({
                result: "successfully updated item",
              });
            }
          }
        }
      );
    });
  },

  getAll: (req, res, next) => {
    logger.info("meal.getAll called");
    const homeid = req.params.homeId;
    let sqlQuery = "SELECT * from meal WHERE StudenthomeID = " + homeid;
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
    logger.info("meal.info called");
    const id = req.params.homeId;
    const mealid = req.params.mealId;

    logger.info(
      "Get aangeroepen op /api/studenthome/" + id + "/meal/" + mealid
    );

    let sqlQuery =
      "SELECT * FROM meal WHERE ID = " + mealid + " AND StudenthomeID = " + id;
    logger.debug("getById", "sqlQuery =", sqlQuery);

    pool.getConnection(function (err, connection) {
      if (err) {
        res.status(400).json({
          message: "GetById failed!",
          error: err,
        });
      }
      if (connection) {
        connection.query(sqlQuery, (error, results, fields) => {
          connection.release();
          if (error) {
            res.status(400).json({
              message: "GetById failed!",
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
            if (mappedResults.length === 0) {
              res.status(404).json({
                error: "no meals with this ID are found",
              });
            } else {
              res.status(200).json({
                result: mappedResults,
              });
            }
          }
        });
      }
    });
  },

  delete: (req, res, next) => {
    logger.info("meal.delete called");
    const homeid = req.params.homeId;
    const userid = req.userId;
    const mealid = req.params.mealId;
    logger.debug(
      "update",
      "mealid =",
      mealid,
      "homeid: ",
      homeid,
      "userid =",
      userid
    );

    // get connection
    pool.getConnection(function (err, connection) {
      // if error
      if (err) {
        res.status(400).json({
          message: "delete failed!",
          error: err,
        });
      }
      // Use the connection
      let sqlQuery =
        "DELETE FROM meal WHERE ID = ? AND StudenthomeID = ? AND UserID = ?";
      connection.query(
        sqlQuery,
        [mealid, homeid, userid],
        (error, results, fields) => {
          // When done with the connection, release it.
          connection.release();
          // Handle error after the release.
          if (error) {
            res.status(400).json({
              message: "Could not delete item",
              error: error,
            });
          }
          if (results) {
            if (results.affectedRows === 0) {
              logger.trace("item was NOT deleted");
              res.status(401).json({
                result: {
                  error:
                    "Item not found or you do not have access to this item",
                },
              });
            } else {
              logger.trace("item was deleted");
              res.status(200).json({
                result: "successfully deleted item",
              });
            }
          }
        }
      );
    });
  },
};
