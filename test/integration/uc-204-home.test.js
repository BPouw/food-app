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

describe("StudentHome", function () {
  describe("update", function () {
    it("UC-204-1 should return valid error when required value is not present", (done) => {
      jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (err, token) => {
        chai
          .request(server)
          .put("/api/studenthome/0")
          .set("authorization", "Bearer " + token)
          .send({
            // name is missing
            street: "Erlingsteenstraat",
            housenr: 7,
            zipcode: "4306AL",
            city: "nieuwerkerk",
            phonenr: "0637170530",
          })
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(400);
            res.should.be.an("object");

            res.body.should.be
              .an("object")
              .that.has.all.keys("message", "error");

            let { message, error } = res.body;
            message.should.be.a("string").that.equals("name is missing!");
            error.should.be.a("string");

            done();
          });
      });
    });
  });
});

describe("StudentHome", function () {
  describe("update", function () {
    it("UC-204-2 should return valid error when zipcode is wrong format", (done) => {
      jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (err, token) => {
        chai
          .request(server)
          .put("/api/studenthome/0")
          .set("authorization", "Bearer " + token)
          .send({
            name: "Gezellig studenthuis",
            street: "Erlingsteenstraat",
            housenr: 7,
            zipcode: "4306ALL",
            city: "nieuwerkerk",
            phonenr: "0637170530",
          })
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(400);
            res.should.be.an("object");

            res.body.should.be
              .an("object")
              .that.has.all.keys("message", "error");

            let { message, error } = res.body;
            message.should.be.a("string").that.equals("zipcode wrong format");
            error.should.be.a("string");

            done();
          });
      });
    });
  });
});

describe("StudentHome", function () {
  describe("update", function () {
    it("UC-204-3 should return valid error when phone number is wrong format", (done) => {
      jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (err, token) => {
        chai
          .request(server)
          .put("/api/studenthome/0")
          .set("authorization", "Bearer " + token)
          .send({
            name: "Gezellig studenthuis",
            street: "Erlingsteenstraat",
            housenr: 7,
            zipcode: "4306AL",
            city: "nieuwerkerk",
            phonenr: "06371705300",
          })
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(400);
            res.should.be.an("object");

            res.body.should.be
              .an("object")
              .that.has.all.keys("message", "error");

            let { message, error } = res.body;
            message.should.be
              .a("string")
              .that.equals("phone number wrong format");
            error.should.be.a("string");

            done();
          });
      });
    });
  });
});

describe("StudentHome", function () {
  describe("update", function () {
    it("UC-204-4 should return valid error when home doesn't exists", (done) => {
      jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (err, token) => {
        chai
          .request(server)
          .put("/api/studenthome/100")
          .set("authorization", "Bearer " + token)
          .send({
            name: "Gezellig studenthuis",
            street: "Erlingsteenstraat",
            housenr: 7,
            zipcode: "4306AL",
            city: "nieuwerkerk",
            phonenr: "0637170530",
          })
          .end((err, res) => {
            res.should.have.status(400);
            res.should.be.an("object");

            res.body.should.be.an("object").that.has.all.keys("error");

            let { error } = res.body;

            error.should.be.a("string").that.equals("ID does not exist");

            done();
          });
      });
    });
  });
});

describe("StudentHome", function () {
  describe("update", function () {
    it("UC-204-5 should reject studenthome when not signed in", (done) => {
      token = "faketoken";
      chai
        .request(server)
        .put("/api/studenthome/0")
        .set("authorization", "Bearer " + token)
        .send({
          name: "Gezellig studenthuis",
          street: "Erlingsteenstraat",
          housenr: 6,
          zipcode: "4306AL",
          city: "nieuwerkerk",
          phonenr: "0637170530",
        })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
});

describe("StudentHome", function () {
  describe("update", function () {
    it("UC-204-6 should accept a valid studenthome", (done) => {
      jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (err, token) => {
        chai
          .request(server)
          .put("/api/studenthome/2")
          .set("authorization", "Bearer " + token)
          .send({
            name: "Gezellig studenthuis",
            street: "Erlingsteenstraat",
            housenr: 7,
            zipcode: "4306AL",
            city: "nieuwerkerk",
            phonenr: "0637170530",
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.an("object");
            res.body.should.be.an("object").that.has.all.keys("result");
            done();
          });
      });
    });
  });
});
