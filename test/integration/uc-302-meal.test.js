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

const INSERT_MEAL =
  "INSERT INTO `meal` (`ID`, `Name`, `Description`, `Ingredients`, `Allergies`, `CreatedOn`, `OfferedOn`, `Price`, `MaxParticipants`, `UserID`, `StudenthomeID`) VALUES " +
  '(2, "Pizza hawaii", "Its like a regular pizza", "Dough, tomato sauce, cheese, pineapple", "cheese, gluten", "2021-05-09", "2021-05-09", 5, 5, 1, 2);';

describe("Meal", function () {
  describe("update", function () {
    before((done) => {
      pool.query(INSERT_MEAL, (err, rows, fields) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
    });
    it("UC-302-1 should return valid error when required value is not present", (done) => {
      jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (err, token) => {
        chai
          .request(server)
          .put("/api/studenthome/2/meal/2")
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
  describe("update", function () {
    it("UC-302-2 should return valid error when user is not signed in", (done) => {
      token = "notsignedin";
      chai
        .request(server)
        .put("/api/studenthome/2/meal/2")
        .set("authorization", "Bearer " + token)
        .send({
          name: "Salad royale",
          descr: "Rucola salad with cheese",
          available: "12-05-2021",
          price: 10,
          allergies: "cheese & nuts",
          ingredients: "cheese, nuts, rucola",
        })
        .end((err, res) => {
          assert.ifError(err);
          res.should.have.status(401);
          res.should.be.an("object");

          done();
        });
    });
  });
});

describe("Meal", function () {
  describe("update", function () {
    it("UC-302-3 should return valid error when changing data that is not yours", (done) => {
      jwt.sign({ id: 10 }, "secret", { expiresIn: "2h" }, (err, token) => {
        chai
          .request(server)
          .put("/api/studenthome/2/meal/2")
          .set("authorization", "Bearer " + token)
          .send({
            name: "Salad royale",
            descr: "Rucola salad with cheese",
            available: "12-05-2021",
            price: 10,
            allergies: "cheese & nuts",
            ingredients: "cheese, nuts, rucola",
          })
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(401);
            res.should.be.an("object");

            done();
          });
      });
    });
  });
});

describe("Meal", function () {
  describe("update", function () {
    it("UC-302-4 should return valid error when changing a meal that is not there", (done) => {
      jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (err, token) => {
        chai
          .request(server)
          .put("/api/studenthome/2/meal/200")
          .set("authorization", "Bearer " + token)
          .send({
            name: "Salad royale",
            descr: "Rucola salad with cheese",
            available: "12-05-2021",
            price: 10,
            allergies: "cheese & nuts",
            ingredients: "cheese, nuts, rucola",
          })
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(401);
            res.should.be.an("object");

            done();
          });
      });
    });
  });
});

describe("Meal", function () {
  describe("update", function () {
    it("UC-302-4 should update when data is valid", (done) => {
      jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (err, token) => {
        chai
          .request(server)
          .put("/api/studenthome/2/meal/2")
          .set("authorization", "Bearer " + token)
          .send({
            name: "Ribeye steak",
            descr: "Old classic we only bake it rare",
            available: "12-05-2021",
            price: 10,
            allergies: "dairy",
            ingredients: "cow",
          })
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(200);
            res.should.be.an("object");

            done();
          });
      });
    });
  });
});
