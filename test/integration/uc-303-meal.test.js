process.env.DB_DATABASE = process.env.DB_DATABASE || "studenthome";
process.env.NODE_ENV = "testing";
process.env.LOGLEVEL = "error";
console.log(`Running tests using database '${process.env.DB_DATABASE}'`);

const chai = require("chai");
const chaiHttp = require("chai-http");
var expect = chai.expect;
const server = require("../../server");

chai.should();
chai.use(chaiHttp);

describe("Meal", function () {
  describe("getAll", function () {
    it("UC-303-1 should return an array with meals", (done) => {
      chai
        .request(server)
        .get("/api/studenthome/2/meal")
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.an("object");
          res.body.should.be.an("object").that.has.all.keys("result");
          let { status, result } = res.body;
          expect(result).to.be.an("array");
          done();
        });
    });
  });
});
