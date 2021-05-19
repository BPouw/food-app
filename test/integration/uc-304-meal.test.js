process.env.DB_DATABASE = process.env.DB_DATABASE || "studenthome";
process.env.NODE_ENV = "testing";
process.env.LOGLEVEL = "error";
console.log(`Running tests using database '${process.env.DB_DATABASE}'`);

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../server");
const assert = require("assert");
const jwt = require("jsonwebtoken");
const pool = require("../../src/dao/database");

chai.should();
chai.use(chaiHttp);

const INSERT_MEAL =
  "INSERT INTO `meal` (`ID`, `Name`, `Description`, `Ingredients`, `Allergies`, `CreatedOn`, `OfferedOn`, `Price`, `MaxParticipants`, `UserID`, `StudenthomeID`) VALUES " +
  '(1, "Pizza calzone", "Its like a regular pizza but folded", "Dough, tomato sauce, cheese", "cheese, gluten", "2021-05-09", "2021-05-09", 5, 5, 1, 2);';

describe("Meal", function () {
  describe("details", function () {
    it("UC-304-1 don't return details of meal when ID is invalid", (done) => {
      chai
        .request(server)
        .get("/api/studenthome/2/meal/1000")
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.an("object");
          done();
        });
    });
  });
});

describe("Meal", function () {
  describe("details", function () {
    before((done) => {
      pool.query(INSERT_MEAL, (err, rows, fields) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
    });
    it("UC-304-2 return details of meal when ID is valid", (done) => {
      chai
        .request(server)
        .get("/api/studenthome/2/meal/1")
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.an("object");
          done();
        });
    });
  });
});
