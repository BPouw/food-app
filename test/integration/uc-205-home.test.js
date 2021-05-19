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

describe("StudentHome", function () {
  describe("delete", function () {
    it("UC-205-1 should return valid error when trying to delete home that doesn't exist", (done) => {
      jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (err, token) => {
        chai
          .request(server)
          .delete("/api/studenthome/1000")
          .set("authorization", "Bearer " + token)
          .end((err, res) => {
            res.should.have.status(404);
            res.should.be.an("object");

            res.body.should.be.an("object").that.has.all.keys("error");

            let { error } = res.body;
            error.should.be
              .a("string")
              .that.equals(
                "Item not found of you do not have access to this item"
              );
            done();
          });
      });
    });
  });
});

describe("StudentHome", function () {
  describe("delete", function () {
    it("UC-205-2 should return valid error when trying to delete home when not signed in", (done) => {
      token = "expiredorfaketoken";
      chai
        .request(server)
        .delete("/api/studenthome/0")
        .set("authorization", "Bearer " + token)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
});

// geeft 404 moet 401 zijn somehow
describe("StudentHome", function () {
  describe("delete", function () {
    it("TC-205-3 should return valid error when trying to delete a home thats not yours", (done) => {
      jwt.sign({ id: 2 }, "secret", { expiresIn: "2h" }, (err, token) => {
        chai
          .request(server)
          .delete("/api/studenthome/1")
          .set("authorization", "Bearer " + token)
          .end((err, res) => {
            res.should.have.status(404);
            done();
          });
      });
    });
  });
});

describe("StudentHome", function () {
  describe("delete", function () {
    it("TC-205-3 should return 200 when deleted", (done) => {
      jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (err, token) => {
        chai
          .request(server)
          .delete("/api/studenthome/1")
          .set("authorization", "Bearer " + token)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });
  });
});
