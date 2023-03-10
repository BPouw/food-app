const assert = require("assert");
const jwt = require("jsonwebtoken");
const pool = require("../dao/database");
const logger = require("../dao/config").logger;
const jwtSecretKey = require("../dao/config").jwtSecretKey;
var pattern =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = {
  login(req, res, next) {
    logger.info("user.login called");
    pool.getConnection((err, connection) => {
      if (err) {
        logger.error("Error getting connection from pool");
        res
          .status(500)
          .json({ error: err.toString(), datetime: new Date().toISOString() });
      }
      if (connection) {
        // 1. Kijk of deze useraccount bestaat.
        connection.query(
          "SELECT `ID`, `Email`, `Password`, `First_Name`, `Last_Name` FROM `user` WHERE `Email` = ?",
          [req.body.email],
          (err, rows, fields) => {
            connection.release();
            if (err) {
              logger.error("Error: ", err.toString());
              res.status(500).json({
                error: err.toString(),
                datetime: new Date().toISOString(),
              });
            } else {
              // 2. Er was een resultaat, check het password.
              logger.info("Result from database: ");
              logger.info(rows);
              if (
                rows &&
                rows.length === 1 &&
                rows[0].Password == req.body.password
              ) {
                logger.info("passwords DID match, sending valid token");
                // Create an object containing the data we want in the payload.
                const payload = {
                  id: rows[0].ID,
                };
                // Userinfo returned to the caller.
                const userinfo = {
                  id: rows[0].ID,
                  firstName: rows[0].First_Name,
                  lastName: rows[0].Last_Name,
                  emailAdress: rows[0].Email,
                  token: jwt.sign(payload, jwtSecretKey, { expiresIn: "2h" }),
                };
                logger.debug("Logged in, sending: ", userinfo);
                res.status(200).json(userinfo);
              } else {
                logger.info("User not found or password invalid");
                res.status(400).json({
                  message: "User not found or password invalid",
                  datetime: new Date().toISOString(),
                });
              }
            }
          }
        );
      }
    });
  },

  //
  //
  //
  validateLogin(req, res, next) {
    // Verify that we receive the expected input
    try {
      assert(typeof req.body.email === "string", "email must be a string.");
      assert(
        typeof req.body.password === "string",
        "password must be a string."
      );
      assert(req.body.password.length > 2, "password must have more length.");
      assert(
        pattern.test(String(req.body.email).toLowerCase()),
        "email wrong format"
      );
      next();
    } catch (ex) {
      res
        .status(400)
        .json({ error: ex.toString(), datetime: new Date().toISOString() });
    }
  },

  //
  //
  //
  register(req, res, next) {
    logger.info("register");
    logger.info(req.body);

    /**
     * Query the database to see if the email of the user to be registered already exists.
     */
    pool.getConnection((err, connection) => {
      if (err) {
        logger.error("Error getting connection from pool: " + err.toString());
        res
          .status(500)
          .json({ error: ex.toString(), datetime: new Date().toISOString() });
      }
      if (connection) {
        let { firstname, lastname, email, studentnr, password } = req.body;

        connection.query(
          "INSERT INTO `user` (`First_Name`, `Last_Name`, `Email`, `Student_Number`, `Password`) VALUES (?, ?, ?, ?, ?)",
          [firstname, lastname, email, studentnr, password],
          (err, rows, fields) => {
            connection.release();
            if (err) {
              // When the INSERT fails, we assume the user already exists
              logger.error("Error: " + err.toString());
              res.status(400).json({
                message: "This email has already been taken.",
                datetime: new Date().toISOString(),
              });
            } else {
              logger.trace(rows);
              // Create an object containing the data we want in the payload.
              // This time we add the id of the newly inserted user
              const payload = {
                id: rows.insertId,
              };
              // Userinfo returned to the caller.
              const userinfo = {
                id: rows.insertId,
                firstName: firstname,
                lastName: lastname,
                emailAdress: email,
                token: jwt.sign(payload, jwtSecretKey, { expiresIn: "2h" }),
              };
              logger.debug("Registered", userinfo);
              res.status(200).json(userinfo);
            }
          }
        );
      }
    });
  },

  //
  //
  //
  validateRegister(req, res, next) {
    // Verify that we receive the expected input
    var emailvariable = req.body.email;
    try {
      assert(
        typeof req.body.firstname === "string",
        "firstname must be a string."
      );
      assert(
        typeof req.body.lastname === "string",
        "lastname must be a string."
      );
      assert(typeof req.body.email === "string", "email must be a string.");
      assert(
        typeof req.body.password === "string",
        "password must be a string."
      );
      assert(req.body.password.length > 0, "password can't be empty");
      assert(
        pattern.test(String(emailvariable).toLowerCase()),
        "email wrong format"
      );

      next();
    } catch (ex) {
      logger.debug("validateRegister error: ", ex.toString());
      res
        .status(400)
        .json({ message: ex.toString(), datetime: new Date().toISOString() });
    }
  },

  //
  //
  //
  validateToken(req, res, next) {
    logger.info("validateToken called");
    // logger.trace(req.headers)
    // The headers should contain the authorization-field with value 'Bearer [token]'
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      logger.warn("Authorization header missing!");
      res.status(400).json({
        error: "Authorization header missing!",
        datetime: new Date().toISOString(),
      });
    } else {
      // Strip the word 'Bearer ' from the headervalue
      const token = authHeader.substring(7, authHeader.length);

      jwt.verify(token, jwtSecretKey, (err, payload) => {
        if (err) {
          logger.warn("Not authorized");
          res.status(401).json({
            error: "Not authorized",
            datetime: new Date().toISOString(),
          });
        }
        if (payload) {
          logger.debug("token is valid", payload);
          // User heeft toegang. Voeg UserId uit payload toe aan
          // request, voor ieder volgend endpoint.
          req.userId = payload.id;
          next();
        }
      });
    }
  },

  renewToken(req, res, next) {
    logger.debug("renewToken");

    pool.getConnection((err, connection) => {
      if (err) {
        logger.error("Error getting connection from pool");
        res
          .status(500)
          .json({ error: err.toString(), datetime: new Date().toISOString() });
      }
      if (connection) {
        // 1. Kijk of deze useraccount bestaat.
        connection.query(
          "SELECT * FROM `user` WHERE `ID` = ?",
          [req.userId],
          (err, rows, fields) => {
            connection.release();
            if (err) {
              logger.error("Error: ", err.toString());
              res.status(500).json({
                error: err.toString(),
                datetime: new Date().toISOString(),
              });
            } else {
              // 2. User gevonden, return user info met nieuw token.
              // Create an object containing the data we want in the payload.
              const payload = {
                id: rows[0].ID,
              };
              // Userinfo returned to the caller.
              const userinfo = {
                id: rows[0].ID,
                firstName: rows[0].First_Name,
                lastName: rows[0].Last_Name,
                emailAdress: rows[0].Email,
                token: jwt.sign(payload, jwtSecretKey, { expiresIn: "2h" }),
              };
              logger.debug("Sending: ", userinfo);
              res.status(200).json(userinfo);
            }
          }
        );
      }
    });
  },
};
