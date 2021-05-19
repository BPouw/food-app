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
  describe("create", function () {
    it("UC-201-1 should return valid error when required value is not present", (done) => {
      jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (err, token) => {
        chai
          .request(server)
          .post("/api/studenthome")
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
  describe("create", function () {
    it("UC-201-2 should return valid error when zipcode is wrong format", (done) => {
      jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (err, token) => {
        chai
          .request(server)
          .post("/api/studenthome")
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
  describe("create", function () {
    it("UC-201-3 should return valid error when phone number is wrong format", (done) => {
      jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (err, token) => {
        chai
          .request(server)
          .post("/api/studenthome")
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
  describe("create", function () {
    it("UC-201-5 should reject studenthome when not signed in", (done) => {
      token = "faketoken";
      chai
        .request(server)
        .post("/api/studenthome")
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
          res.body.should.be
            .an("object")
            .that.has.all.keys("datetime", "error");

          let { error, datetime } = res.body;
          error.should.be.a("string").that.equals("Not authorized");
          done();
        });
    });
  });
});

describe("StudentHome", function () {
  describe("create", function () {
    before((done) => {
      pool.query(INSERT_USER, (err, rows, fields) => {
        if (err) {
          logger.error(`before CLEARING tables: ${err}`);
          done(err);
        } else {
          done();
        }
      });
    });

    it("UC-201-6 should accept a valid studenthome", (done) => {
      jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (err, token) => {
        chai
          .request(server)
          .post("/api/studenthome")
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
            res.should.have.status(200);
            res.should.be.an("object");
            res.body.should.be.an("object").that.has.all.keys("result");
            done();
          });
      });
    });
  });
});

describe("StudentHome", function () {
  describe("create", function () {
    it("UC-201-4 should return valid error when student home already exists", (done) => {
      jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (err, token) => {
        chai
          .request(server)
          .post("/api/studenthome")
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
            assert.ifError(err);
            res.should.have.status(400);
            res.body.should.be
              .an("object")
              .that.has.all.keys("message", "error");

            let { error, message } = res.body;
            message.should.be.a("string").that.equals("home already exists");
            error.should.be
              .a("string")
              .that.equals(
                "Error: ER_DUP_ENTRY: Duplicate entry '4306AL-6' for key 'UniqueAdress'"
              );

            done();
          });
      });
    });
  });
});
