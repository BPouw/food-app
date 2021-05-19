process.env.DB_DATABASE = process.env.DB_DATABASE || "studenthome";
process.env.NODE_ENV = "testing";
process.env.LOGLEVEL = "error";
console.log(`Running tests using database '${process.env.DB_DATABASE}'`);

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../server");

chai.should();
chai.use(chaiHttp);

describe("UC102 Login", () => {
  it("TC-102-1 verplicht veld ontbreekt", (done) => {
    chai
      .request(server)
      .post("/api/login")
      .send({
        email: "test@test.nl",
        // no password
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");

        let { error, datetime } = res.body;
        error.should.be
          .a("string")
          .that.equals(
            "AssertionError [ERR_ASSERTION]: password must be a string."
          );
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
        res.should.have.status(400);
        let { error, datetime } = res.body;
        error.should.be
          .a("string")
          .that.equals("AssertionError [ERR_ASSERTION]: email wrong format");
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
        password: "",
      })
      .end((err, res) => {
        res.should.have.status(400);
        let { error, datetime } = res.body;
        error.should.be
          .a("string")
          .that.equals(
            "AssertionError [ERR_ASSERTION]: password must have more length."
          );
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
        res.should.have.status(400);
        let { message, datetime } = res.body;
        message.should.be
          .a("string")
          .that.equals("User not found or password invalid");
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
        done();
      });
  });
});
