const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../server");
const database = require("../../src/dao/home-database");
const assert = require("assert");

chai.should();
chai.use(chaiHttp);
var expect = chai.expect;

// TC-201

describe("StudentHome", function () {
  describe("create", function () {
    it("TC-201-1 should return valid error when required value is not present", (done) => {
      chai
        .request(server)
        .post("/api/studenthome")
        .send({
          // name is missing
          street: "Erlingsteenstraat",
          housenr: 7,
          zipcode: "4306AL",
          city: "nieuwerkerk",
          phonenr: "0637170530"
        })
        .end((err, res) => {
          assert.ifError(err);
          res.should.have.status(400);
          res.should.be.an("object");

          res.body.should.be.an("object").that.has.all.keys("message", "error");

          let { message, error } = res.body;
          message.should.be.a("string").that.equals("name is missing!");
          error.should.be.a("string");

          done();
        });
    });
  });
});

describe("StudentHome", function () {
  describe("create", function () {
    it("TC-201-2 should return valid error when zipcode is wrong format", (done) => {
      chai
        .request(server)
        .post("/api/studenthome")
        .send({
          name: "Gezellig studenthuis",
          street: "Erlingsteenstraat",
          housenr: 7,
          zipcode: "4306ALL",
          city: "nieuwerkerk",
          phonenr: "0637170530"
        })
        .end((err, res) => {
          assert.ifError(err);
          res.should.have.status(400);
          res.should.be.an("object");

          res.body.should.be.an("object").that.has.all.keys("message", "error");

          let { message, error } = res.body;
          message.should.be.a("string").that.equals("zipcode wrong format");
          error.should.be.a("string");

          done();
        });
    });
  });
});

describe("StudentHome", function () {
  describe("create", function () {
    it("TC-201-3 should return valid error when phone number is wrong format", (done) => {
      chai
        .request(server)
        .post("/api/studenthome")
        .send({
          name: "Gezellig studenthuis",
          street: "Erlingsteenstraat",
          housenr: 7,
          zipcode: "4306AL",
          city: "nieuwerkerk",
          phonenr: "06371705300"
        })
        .end((err, res) => {
          assert.ifError(err);
          res.should.have.status(400);
          res.should.be.an("object");

          res.body.should.be.an("object").that.has.all.keys("message", "error");

          let { message, error } = res.body;
          message.should.be.a("string").that.equals("phone number wrong format");
          error.should.be.a("string");

          done();
        });
    });
  });
});

describe("StudentHome", function () {
  describe("create", function () {
    it("TC-201-6 should accept a valid studenthome", (done) => {
      chai
        .request(server)
        .post("/api/studenthome")
        .send({
          name: "Gezellig studenthuis",
          street: "Erlingsteenstraat",
          housenr: 7,
          zipcode: "4306AL",
          city: "nieuwerkerk",
          phonenr: "0637170530"
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.an("object");

          res.body.should.be.an("object").that.has.all.keys("status", "result");

          let { status, result } = res.body;
          status.should.be.a("string").that.equals("succes");

          done();
        });
    });
  });
});

// TC-202

describe("StudentHome", function () {
  describe("getAll", function () {
    before(function() {
      database.db = []
    });
    it("TC-202-1 should return an empty list", (done) => {
      chai
        .request(server)
        .get("/api/studenthome")
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.an("object");

          res.body.should.be.an("object").that.has.all.keys("status", "result");

          let { status, result } = res.body;
          status.should.be.a("string").that.equals("succes");
          expect(result).to.be.an('array');
          expect(result).to.have.length(0);    
          done();
        });
    });
  });
});

describe("StudentHome", function () {
  describe("getAll", function () {
    before(function() {

      const item1 = {name: "Blade runner",
      street: "Erlingsteenstraat",
      housenr: 7,
      zipcode : "4306AL",
        phonenr : "0637170530",
      city : "nieuwerkerk" }
       
      const item2 = {name: "Huis Huis",
      street: "Hoevensdijk",
      housenr: 16,
      zipcode : "4306AL",
        phonenr : "0637170530",
      city : "Breda" }

      database.db = [item1, item2]
    });
    it("TC-202-2 should return a list with 2 items", (done) => {
      chai
        .request(server)
        .get("/api/studenthome")
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.an("object");

          res.body.should.be.an("object").that.has.all.keys("status", "result");

          let { status, result } = res.body;
          status.should.be.a("string").that.equals("succes");
          expect(result).to.be.an('array');
          expect(result).to.have.length(2);    
          done();
        });
    });
  });
});

// TC-203

describe("StudentHome", function () {
  describe("getById", function () {
    before(function() {

      const item1 = {name: "Blade runner",
      street: "Erlingsteenstraat",
      housenr: 7,
      zipcode : "4306AL",
        phonenr : "0637170530",
      city : "nieuwerkerk" }
       
      database.db = [item1]
    });
    it("TC-203-2 student home id exists", (done) => {
      chai
        .request(server)
        .get("/api/studenthome/0")
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.an("object");

          res.body.should.be.an("object").that.has.all.keys("status", "result");

          let { status, result } = res.body;
          status.should.be.a("string").that.equals("succes");

          done();
        });
    });
  });
});

// TC-204 

describe("StudentHome", function () {
  describe("update", function () {
    it("TC-204-1 should return valid error when required value is not present", (done) => {
      chai
        .request(server)
        .put("/api/studenthome/0")
        .send({
          // name is missing
          street: "Erlingsteenstraat",
          housenr: 7,
          zipcode: "4306AL",
          city: "nieuwerkerk",
          phonenr: "0637170530"
        })
        .end((err, res) => {
          assert.ifError(err);
          res.should.have.status(400);
          res.should.be.an("object");

          res.body.should.be.an("object").that.has.all.keys("message", "error");

          let { message, error } = res.body;
          message.should.be.a("string").that.equals("name is missing!");
          error.should.be.a("string");

          done();
        });
    });
  });
});

describe("StudentHome", function () {
  describe("create", function () {
    it("TC-204-2 should return valid error when zipcode is wrong format", (done) => {
      chai
        .request(server)
        .put("/api/studenthome/0")
        .send({
          name: "Gezellig studenthuis",
          street: "Erlingsteenstraat",
          housenr: 7,
          zipcode: "4306ALL",
          city: "nieuwerkerk",
          phonenr: "0637170530"
        })
        .end((err, res) => {
          assert.ifError(err);
          res.should.have.status(400);
          res.should.be.an("object");

          res.body.should.be.an("object").that.has.all.keys("message", "error");

          let { message, error } = res.body;
          message.should.be.a("string").that.equals("zipcode wrong format");
          error.should.be.a("string");

          done();
        });
    });
  });
});

describe("StudentHome", function () {
  describe("create", function () {
    it("TC-201-3 should return valid error when phone number is wrong format", (done) => {
      chai
        .request(server)
        .put("/api/studenthome/0")
        .send({
          name: "Gezellig studenthuis",
          street: "Erlingsteenstraat",
          housenr: 7,
          zipcode: "4306AL",
          city: "nieuwerkerk",
          phonenr: "06371705300"
        })
        .end((err, res) => {
          assert.ifError(err);
          res.should.have.status(400);
          res.should.be.an("object");

          res.body.should.be.an("object").that.has.all.keys("message", "error");

          let { message, error } = res.body;
          message.should.be.a("string").that.equals("phone number wrong format");
          error.should.be.a("string");

          done();
        });
    });
  });
});

describe("StudentHome", function () {
  describe("create", function () {
    before(function() {

      const item1 = {name: "Blade runner",
      street: "Erlingsteenstraat",
      housenr: 7,
      zipcode : "4306AL",
        phonenr : "0637170530",
      city : "nieuwerkerk" }
       
      database.db = [item1]
    });
    it("TC-201-6 should accept a valid studenthome", (done) => {
      chai
        .request(server)
        .put("/api/studenthome/0")
        .send({
          name: "Gezellig studenthuis",
          street: "Erlingsteenstraat",
          housenr: 7,
          zipcode: "4306AL",
          city: "nieuwerkerk",
          phonenr: "0637170530"
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.an("object");

          res.body.should.be.an("object").that.has.all.keys("status", "result");

          let { status, result } = res.body;
          status.should.be.a("string").that.equals("succes");

          done();
        });
    });
  });
});

// UC-205


