process.env.DB_DATABASE = process.env.DB_DATABASE || "studenthome";
process.env.NODE_ENV = "testing";
process.env.LOGLEVEL = "error";
console.log(`Running tests using database '${process.env.DB_DATABASE}'`);

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../server");
const pool = require("../../src/dao/database");

chai.should();
chai.use(chaiHttp);

describe("UC102 Login", () => {
  it("TC-102-1 verplicht veld ontbreekt", (done) => {
    chai
      .request(server)
      .post("/api/login")
      .send({
        email: "test@test.nl",
      })
      .end((err, res) => {
        res.should.have.status(422);
        done();
      });
  });
});

describe("UC102 Login", () => {
  it("TC-102-2 invalide email", (done) => {
    chai
      .request(server)
      .post("/api/login")
      .send({
        email: "test@test",
        password: "secret",
      })
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});

describe("UC102 Login", () => {
  it("TC-102-3 invalide wachtwoord", (done) => {
    chai
      .request(server)
      .post("/api/login")
      .send({
        email: "test@test.nl",
        password: "notsosecret",
      })
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});

describe("UC102 Login", () => {
  it("TC-102-4 gebruiker bestaat niet", (done) => {
    chai
      .request(server)
      .post("/api/login")
      .send({
        email: "tester@test.nl",
        password: "secret",
      })
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});

describe("UC102 Login", () => {
  it("TC-102-5 should return a token when providing valid information", (done) => {
    chai
      .request(server)
      .post("/api/login")
      .send({
        email: "test@test.nl",
        password: "secret",
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        const response = res.body;
        response.should.have.property("token").which.is.a("string");
        // response.should.have.property('username').which.is.a('string')
        done();
      });
  });
});
