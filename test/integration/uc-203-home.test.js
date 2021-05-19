process.env.DB_DATABASE = process.env.DB_DATABASE || "studenthome";
process.env.NODE_ENV = "testing";
process.env.LOGLEVEL = "error";
console.log(`Running tests using database '${process.env.DB_DATABASE}'`);

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../server");
const pool = require("../../src/dao/database");
var expect = chai.expect;
var should = chai.should;
const assert = require("assert");
const jwt = require("jsonwebtoken");

chai.should();
chai.use(chaiHttp);

describe("StudentHome", function () {
  describe("getById", function () {
    it("UC-203-1 student home id doesn't exist", (done) => {
      chai
        .request(server)
        .get("/api/studenthome/4")
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.an("object");

          res.body.should.be.an("object").that.has.all.keys("status");

          let { status } = res.body;
          status.should.be
            .a("string")
            .that.equals("No homes found with that ID");

          done();
        });
    });
  });
});

describe("StudentHome", function () {
  describe("getById", function () {
    it("UC-203-2 student home id does exist", (done) => {
      chai
        .request(server)
        .get("/api/studenthome/1")
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.an("object");
          let { result } = res.body;
          result.should.be.a("array");
          done();
        });
    });
  });
});
