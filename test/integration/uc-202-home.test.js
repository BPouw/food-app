process.env.DB_DATABASE = process.env.DB_DATABASE || "studenthome";
process.env.NODE_ENV = "testing";
process.env.LOGLEVEL = "error";
console.log(`Running tests using database '${process.env.DB_DATABASE}'`);

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../server");
const pool = require("../../src/dao/database");
var expect = chai.expect;
const assert = require("assert");
const jwt = require("jsonwebtoken");

chai.should();
chai.use(chaiHttp);

const CLEAR_DB = "DELETE IGNORE FROM `user`";
const INSERT_USER =
  "INSERT INTO `user` (`ID`, `First_Name`, `Last_Name`, `Email`, `Student_Number`, `Password` ) VALUES" +
  '(1, "first", "last", "name@server.nl","1234567", "secret");';

const INSERT_STUDENTHOME =
  "INSERT INTO `studenthome` (`ID`, `Name`, `Address`, `House_Nr`, `UserID`, `Postal_Code`, `Telephone`, `City`) VALUES " +
  "(1, 'Studiehuis', 'address', 1, 1, '1111AA', 061234567890, 'Breda' ), " +
  "(2, 'Feesthuis', 'address', 2, 1, '2222BB', 061234567890, 'Zierikzee' ); ";

describe("StudentHome", function () {
  describe("getAll", function () {
    before((done) => {
      pool.query(CLEAR_DB, (err, rows, fields) => {
        if (err) {
          logger.error(`before CLEARING tables: ${err}`);
          done(err);
        } else {
          done();
        }
      });
    });
    it("UC-202-1 should return an empty list", (done) => {
      chai
        .request(server)
        .get("/api/studenthome")
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.an("object");

          res.body.should.be.an("object").that.has.all.keys("result");

          let { status, result } = res.body;
          expect(result).to.be.an("array");
          expect(result).to.have.length(0);
          done();
        });
    });
  });
});

describe("StudentHome", function () {
  describe("getAll", function () {
    before((done) => {
      pool.query(INSERT_USER + INSERT_STUDENTHOME, (err, rows, fields) => {
        if (err) {
          logger.error(`before CLEARING tables: ${err}`);
          done(err);
        } else {
          done();
        }
      });
    });
    it("UC-202-2 should return a list with 2 items", (done) => {
      chai
        .request(server)
        .get("/api/studenthome")
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.an("object");

          res.body.should.be.an("object").that.has.all.keys("result");

          let { status, result } = res.body;
          expect(result).to.be.an("array");
          expect(result).to.have.length(2);
          done();
        });
    });
  });
});

describe("StudentHome", function () {
  describe("getAll", function () {
    it("UC-202-3 should return a error with invalid city", (done) => {
      chai
        .request(server)
        .get("/api/studenthome?city=asgard")
        .end((err, res) => {
          res.should.have.status(404);

          let { error } = res.body;
          error.should.be.a("string").that.equals("No entries were found");

          done();
        });
    });
  });
});

describe("StudentHome", function () {
  describe("getAll", function () {
    it("UC-202-4 should return a error with invalid name", (done) => {
      chai
        .request(server)
        .get("/api/studenthome?name=borishuis")
        .end((err, res) => {
          res.should.have.status(404);
          let { error } = res.body;
          error.should.be.a("string").that.equals("No entries were found");
          done();
        });
    });
  });
});

describe("StudentHome", function () {
  describe("getAll", function () {
    it("UC-202-4 should return results when query on a valid city", (done) => {
      chai
        .request(server)
        .get("/api/studenthome?city=Breda")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object").that.has.all.keys("result");
          let { status, result } = res.body;
          expect(result).to.be.an("array");
          expect(result).to.have.length(1);
          done();
        });
    });
  });
});

describe("StudentHome", function () {
  describe("getAll", function () {
    it("UC-202-5 should return results when query on a valid name", (done) => {
      chai
        .request(server)
        .get("/api/studenthome?name=Feesthuis")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object").that.has.all.keys("result");
          let { status, result } = res.body;
          expect(result).to.be.an("array");
          expect(result).to.have.length(1);
          done();
        });
    });
  });
});
