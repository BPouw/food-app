const assert = require("assert");
const log = require("tracer").console();
const config = require("../dao/config");
const logger = config.logger;
const pool = require("../dao/database");

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
      next();
    } catch (err) {
      console.log("Home data is invalid: ", err.message);
      next({ message: err.message, errCode: 400 });
    }
  },

  create: (req, res, next) => {
    log.info("studenthome.create called");
    const home = req.body;

    let { name, street, housenr, zipcode, city, phonenr } = home;

    const userid = req.userId;

    let sqlQuery =
      "INSERT INTO `studenthome` (`Name`, `Address`, `House_Nr`, `UserID`, `Postal_Code`, `Telephone`, `City`) VALUES (?, ?, ?, ?, ?, ?, ?)";
    logger.debug("createHome", "sqlQuery =", sqlQuery);

    pool.getConnection(function (err, connection) {
      if (err) {
        logger.error("createMovie", error);
        res.status(400).json({
          message: "createHome failed getting connection!",
          error: err,
        });
      }
      if (connection) {
        connection.query(
          sqlQuery,
          [name, street, housenr, userid, zipcode, city, phonenr],
          (error, results, fields) => {
            connection.release();
            if (error) {
              logger.error("createHome", error.toString());
              res.status(400).json({
                message: "createHome failed calling query",
                error: error.toString(),
              });
            }
            if (results) {
              logger.trace("results: ", results);
              res.status(200).json({
                result: {
                  id: results.insertId,
                  ...home,
                },
              });
            }
          }
        );
      }
    });
  },

  getAll: (req, res, next) => {
    log.info("studenthome.getAll called");
    console.log(req.query);
    let sqlQuery = "SELECT * FROM studenthome";
    const queryParams = Object.entries(req.query);

    if (queryParams.length > 0) {
      let queryString = queryParams
        .map((param) => {
          // map maakt een nieuwe waarde van gegeven invoer; hier een string van twee arrayvalues.
          return `${param[0]} = '${param[1]}'`;
        })
        .reduce((a, b) => {
          // reduce 'reduceert' twee opeenvolgende waarden tot één eindwaarde.
          return `${a} AND ${b}`;
        });
      logger.info("queryString:", queryString);
      sqlQuery += ` WHERE ${queryString};`;
    }

    logger.debug("getAll", "sqlQuery =", sqlQuery);

    pool.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
        res.status(400).json({
          message: "GetAll failed!",
          error: err.toString(),
        });
      }
      if (connection) {
        // Use the connection
        // Merk op dat we door de map/reduce aanpaak nu geen prepared statement (met value = ?) hebben!
        // Het zou nog mooier zijn wanneer we dat wél via de map/reduce zouden doen. Dat kan; zoek zelf uit hoe!
        connection.query(sqlQuery, (error, results, fields) => {
          // When done with the connection, release it.
          connection.release();
          // Handle error after the release.
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
    log.info("studenthome.info called");
    const homeId = req.params.homeId;

    let sqlQuery = "SELECT * FROM studenthome WHERE studenthome.ID = " + homeId;

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
            res.status(200).json({
              result: mappedResults,
            });
          }
        });
      }
    });
  },

  update: (req, res, next) => {
    log.info("studenthome.update called");
    const homeId = req.params.homeId;

    const home = req.body;

    const userid = req.userId;

    let { name, street, housenr, zipcode, city, phonenr } = home;

    let sqlQuery =
      "UPDATE studenthome SET Name = ?, Address = ?, House_Nr = ?, Postal_Code = ?, Telephone = ?, City = ? WHERE ID = " +
      homeId;

    pool.getConnection(function (err, connection) {
      if (err) {
        logger.error("createMovie", error);
        res.status(400).json({
          message: "createHome failed getting connection!",
          error: err,
        });
      }
      if (connection) {
        connection.query(
          sqlQuery,
          [name, street, housenr, userid, zipcode, city, phonenr],
          (error, results, fields) => {
            connection.release();
            if (error) {
              logger.error("createHome", error.toString());
              res.status(400).json({
                message: "createHome failed calling query",
                error: error.toString(),
              });
            }
            if (results) {
              logger.trace("results: ", results);
              res.status(200).json({
                result: {
                  id: results.insertId,
                  ...home,
                },
              });
            }
          }
        );
      }
    });
  },

  delete: (req, res, next) => {
    log.info("studenthome.delete called");
    const homeId = req.params.homeId;
    const userid = req.userId;

    pool.getConnection(function (err, connection) {
      if (err) {
        res.status(400).json({
          message: "delete failed!",
          error: err,
        });
      }

      // Use the connection
      let sqlQuery = "DELETE FROM studenthome WHERE id = ? AND UserID = ?";
      connection.query(sqlQuery, [homeId, userid], (error, results, fields) => {
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
                error: "Item not found of you do not have access to this item",
              },
            });
          } else {
            logger.trace("item was deleted");
            res.status(200).json({
              result: "successfully deleted item",
            });
          }
        }
      });
    });
  },
};
