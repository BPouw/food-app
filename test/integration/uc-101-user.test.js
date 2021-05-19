process.env.DB_DATABASE = process.env.DB_DATABASE || "studenthome";
process.env.NODE_ENV = "testing";
process.env.LOGLEVEL = "error";
console.log(`Running tests using database '${process.env.DB_DATABASE}'`);

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../server");
const pool = require("../../src/dao/database");
const assert = require("assert");

chai.should();
chai.use(chaiHttp);

const CLEAR_DB = "DELETE IGNORE FROM `user`";

describe("Authentication", () => {
  before((done) => {
    console.log("beforeEach");
    pool.query(CLEAR_DB, (err, rows, fields) => {
      if (err) {
        console.log(`beforeEach CLEAR error: ${err}`);
        done(err);
      } else {
        done();
      }
    });
  });

  describe("UC101 Registation", () => {
    it("TC-101-1 verplicht veld ontbreekt", (done) => {
      chai
        .request(server)
        .post("/api/register")
        .send({
          firstname: "FirstName",
          lastname: "LastName",
          email: "test@test.nl",
          studentnr: 1234567,
          // no password
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");

          let { message, datetime } = res.body;
          message.should.be
            .a("string")
            .that.equals(
              "AssertionError [ERR_ASSERTION]: password must be a string."
            );
          done();
        });
    });
  });

  describe("UC101 Registation", () => {
    it("TC-101-2 invalide email adres", (done) => {
      chai
        .request(server)
        .post("/api/register")
        .send({
          firstname: "FirstName",
          lastname: "LastName",
          email: "fakeemail.com",
          studentnr: 1234567,
          password: "secret",
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");

          let { message, datetime } = res.body;
          message.should.be
            .a("string")
            .that.equals("AssertionError [ERR_ASSERTION]: email wrong format");
          done();
        });
    });
  });

  describe("UC101 Registation", () => {
    it("TC-101-3 invalide wachtwoord", (done) => {
      chai
        .request(server)
        .post("/api/register")
        .send({
          firstname: "FirstName",
          lastname: "LastName",
          email: "fakeemail.com",
          studentnr: 1234567,
          password: "",
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");

          let { message, datetime } = res.body;
          message.should.be
            .a("string")
            .that.equals(
              "AssertionError [ERR_ASSERTION]: password can't be empty"
            );
          done();
        });
    });
  });

  describe("UC101 Registation", () => {
    it("TC-101-5 gebruiker succesvol geregistreerd", (done) => {
      chai
        .request(server)
        .post("/api/register")
        .send({
          firstname: "FirstName",
          lastname: "LastName",
          email: "test@test.nl",
          studentnr: 1234567,
          password: "secret",
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          const response = res.body;
          response.should.have.property("token").which.is.a("string");
          done();
        });
    });
  });
});

describe("UC101 Registation", () => {
  it("TC-101-4 gebruiker bestaat al", (done) => {
    chai
      .request(server)
      .post("/api/register")
      .send({
        firstname: "FirstName",
        lastname: "LastName",
        email: "test@test.nl",
        studentnr: 1234567,
        password: "secret",
      })
      .end((err, res) => {
        assert.ifError(err);
        res.should.have.status(400);
        let { message, datetime } = res.body;
        message.should.be
          .a("string")
          .that.equals("This email has already been taken.");
        done();
      });
  });
});
