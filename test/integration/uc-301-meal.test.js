process.env.DB_DATABASE = process.env.DB_DATABASE || "studenthome";
process.env.NODE_ENV = "testing";
process.env.LOGLEVEL = "error";
console.log(`Running tests using database '${process.env.DB_DATABASE}'`);

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../server");
const assert = require("assert");
const jwt = require("jsonwebtoken");

chai.should();
chai.use(chaiHttp);

describe("Meal", function () {
  describe("create", function () {
    it("UC-301-1 should return valid error when required value is not present", (done) => {
      jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (err, token) => {
        chai
          .request(server)
          .post("/api/studenthome/2/meal")
          .set("authorization", "Bearer " + token)
          .send({
            // name is missing
            descr: "Rucola salad with cheese",
            available: "12-05-2021",
            price: 10,
            allergies: "cheese & nuts",
            ingredients: "cheese, nuts, rucola",
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

describe("Meal", function () {
  describe("create", function () {
    it("UC-301-2 should return valid error when not signed in", (done) => {
      token = "Fake";
      chai
        .request(server)
        .post("/api/studenthome/2/meal")
        .set("authorization", "Bearer " + token)
        .send({
          name: "Cheese salad",
          descr: "Rucola salad with cheese",
          available: "12-05-2021",
          price: 10,
          allergies: "cheese & nuts",
          ingredients: "cheese, nuts, rucola",
        })
        .end((err, res) => {
          assert.ifError(err);
          res.should.have.status(401);
          done();
        });
    });
  });
});

describe("Meal", function () {
  describe("create", function () {
    it("UC-301-3 should add a meal with valid info", (done) => {
      jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (err, token) => {
        chai
          .request(server)
          .post("/api/studenthome/2/meal")
          .set("authorization", "Bearer " + token)
          .send({
            name: "Cheese salad",
            descr: "Rucola salad with cheese",
            available: "12-05-2021",
            price: 10,
            allergies: "cheese & nuts",
            ingredients: "cheese, nuts, rucola",
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
