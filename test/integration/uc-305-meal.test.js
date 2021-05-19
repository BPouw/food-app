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

describe("Meal", function () {
  describe("delete", function () {
    it("UC-305-2 not signed in", (done) => {
      token = "fake";
      chai
        .request(server)
        .delete("/api/studenthome/2/meal/1")
        .set("authorization", "Bearer " + token)
        .end((err, res) => {
          res.should.have.status(401);
          res.should.be.an("object");
          done();
        });
    });
  });
});

describe("Meal", function () {
  describe("delete", function () {
    it("UC-305-3 not authorised to delete meal", (done) => {
      jwt.sign({ id: 2 }, "secret", { expiresIn: "2h" }, (err, token) => {
        chai
          .request(server)
          .delete("/api/studenthome/2/meal/1")
          .set("authorization", "Bearer " + token)
          .end((err, res) => {
            res.should.have.status(401);
            res.should.be.an("object");
            done();
          });
      });
    });
  });
});

describe("Meal", function () {
  describe("delete", function () {
    it("UC-305-4 meal does not exists", (done) => {
      jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (err, token) => {
        chai
          .request(server)
          .delete("/api/studenthome/2/meal/1000")
          .set("authorization", "Bearer " + token)
          .end((err, res) => {
            res.should.have.status(401);
            res.should.be.an("object");
            done();
          });
      });
    });
  });
});

describe("Meal", function () {
  describe("delete", function () {
    it("UC-305-5 meal delete succesfull", (done) => {
      jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (err, token) => {
        chai
          .request(server)
          .delete("/api/studenthome/2/meal/1")
          .set("authorization", "Bearer " + token)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.an("object");
            done();
          });
      });
    });
  });
});
