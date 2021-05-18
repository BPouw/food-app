process.env.DB_DATABASE = process.env.DB_DATABASE || "studenthome";
process.env.NODE_ENV = "testing";
process.env.LOGLEVEL = "error";

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../server");
const pool = require("../../src/dao/database");
const logger = require("../../src/dao/database").logger;
const jwt = require("jsonwebtoken");
const assert = require("assert");

chai.should();
chai.use(chaiHttp);

const CLEAR_STUDENTHOME_TABLE = "DELETE IGNORE FROM `studenthome`;";
const CLEAR_MEAL_TABLE = "DELETE IGNORE FROM `meal`;";
const CLEAR_USERS_TABLE = "DELETE IGNORE FROM `user`;";
const CLEAR_DB = CLEAR_STUDENTHOME_TABLE + CLEAR_MEAL_TABLE + CLEAR_USERS_TABLE;

const INSERT_USER =
  "INSERT INTO `user` (`ID`, `First_Name`, `Last_Name`, `Email`, `Student_Number`, `Password` ) VALUES" +
  '(1, "twan", "roelofsen", "twanroelofsen@hotmail.com", "1234567", "secret");';

const INSERT_STUDENTHOME =
  "INSERT INTO `studenthome` (`ID`, `Name`, `Address`, `House_Nr`, `UserID`, `Postal_Code`, `Telephone`, `City`) VALUES " +
  "(1, 'Huis', 'address', 1, 1, '1111AA', 061234567890, 'Goes' ), " +
  "(2, 'Keet', 'address', 2, 1, '2222BB', 061234567890, 'Goes' ); ";

before((done) => {
  pool.query(CLEAR_DB, (err, rows, fields) => {
    if (err) {
      done(err);
    } else {
      pool.query(
        "select * from user; select * from studenthome",
        (err, rows, fields) => {
          if (err) {
            done(err);
          } else {
            console.log(rows);
            pool.query(
              INSERT_USER + INSERT_STUDENTHOME,
              (err, rows, fields) => {
                if (err) {
                  // logger.error(`before INSERTING tables: ${err}`)
                  done(err);
                } else {
                  done();
                }
              }
            );
          }
        }
      );
    }
  });
});

after((done) => {
  pool.query(CLEAR_DB, (err, rows, fields) => {
    if (err) {
      console.log(`after error: ${err}`);
      done(err);
    } else {
      logger.info("After FINISHED");
      done();
    }
  });
});

describe("UC200 Overview of Studenthomes", () => {
  beforeEach((done) => {
    pool.query(CLEAR_STUDENTHOME_TABLE, (err, rows, fields) => {
      if (err) {
        logger.error(`before List Studenthome: ${err}`);
        done(err);
      } else {
        done();
      }
    });
  }),
    it("TC-201-1 should return valid error when required value is not present", (done) => {
      chai
        .request(server)
        .post("/api/studenthome")
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, "secret"))
        .send({
          // Name is missing!
          street: "Duizendblad",
          House_Nr: 21,
          Postal_Code: "4421MT",
          Telephone: "0620878866",
          City: "Kapelle",
        })
        .end((err, res) => {
          assert.ifError(err);
          res.should.have.status(400);
          res.should.be.an("object");
          res.error.text.should.be.a("string").that.equals("name is missing!");
          done();
        });
    }),
    it("TC-201-2 should return valid error when the postcode is invalid", (done) => {
      chai
        .request(server)
        .post("/api/studenthome")
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, "secret"))
        .send({
          Name: "Testhouse",
          street: "Duizendblad",
          House_Nr: 21,
          Postal_Code: "59387 MT",
          Telephone: "0620878866",
          City: "Kapelle",
        })
        .end((err, res) => {
          assert.ifError(err);
          res.should.have.status(400);
          res.should.be.an("object");
          res.error.text.should.be
            .a("string")
            .that.equals("postcode is incorrect!");
          done();
        });
    }),
    it("TC-201-3 should return valid error when the phonenumber is invalid", (done) => {
      chai
        .request(server)
        .post("/api/studenthome")
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, "secret"))
        .send({
          Name: "Testhouse",
          street: "Duizendblad",
          House_Nr: 21,
          Postal_Code: "5921MT",
          Telephone: "062087886655234",
          City: "Kapelle",
        })
        .end((err, res) => {
          assert.ifError(err);
          res.should.have.status(400);
          res.should.be.an("object");
          res.error.text.should.be
            .a("string")
            .that.equals("phonenumber is incorrect!");
          done();
        });
    }),
    it("TC-201-4 should return valid studenthome", (done) => {
      pool.query(INSERT_STUDENTHOME, (error, result) => {
        if (error) {
          done(error);
        }
        if (result) {
          chai
            .request(server)
            .post("/api/studenthome")
            .set("authorization", "Bearer " + jwt.sign({ id: 1 }, "secret"))
            .send({
              Name: "Testhouse",
              street: "Duizendblad",
              House_Nr: 1,
              Postal_Code: "1111AA",
              Telephone: "0620878866",
              City: "Kapelle",
            })
            .end((err, res) => {
              assert.ifError(err);
              res.should.have.status(400);
              done();
            });
        }
      });
    }),
    it("TC-201-6 should return valid studenthome", (done) => {
      chai
        .request(server)
        .post("/api/studenthome")
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, "secret"))
        .send({
          Name: "Testhouse",
          street: "Duizendblad",
          House_Nr: 21,
          Postal_Code: "5921MT",
          Telephone: "0620878866",
          City: "Kapelle",
        })
        .end((err, res) => {
          assert.ifError(err);
          res.should.have.status(200);
          done();
        });
    }),
    it("TC-202-1 should return empty list when database contains no items", (done) => {
      chai
        .request(server)
        .get("/api/studenthome")
        .end((err, res) => {
          assert.ifError(err);
          res.should.have.status(200);
          res.should.be.an("object");

          let { result } = res.body;
          result.should.be.an("array").that.has.length(0);

          done();
        });
    });

  it("TC-202-2 should show 2 results", (done) => {
    pool.query(INSERT_STUDENTHOME, (error, result) => {
      if (error) {
        done(error);
      }
      if (result) {
        chai
          .request(server)
          .get("/api/studenthome/")
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(200);
            res.should.be.an("object");

            let { result } = res.body;
            result.should.be.an("array").that.has.length(2);

            done();
          });
      }
    });
  });

  it("TC-202-3 studenthomes with not existing city", (done) => {
    pool.query(INSERT_STUDENTHOME, (error, result) => {
      if (error) {
        done(error);
      }
      if (result) {
        chai
          .request(server)
          .get("/api/studenthome?city=nonexistingcity")
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(404);
            res.should.be.an("object");

            res.body.should.be
              .an("object")
              .that.has.all.keys("status", "message");

            let { status, message } = res.body;
            status.should.be.an("string").that.equals("failed");
            message.should.be
              .an("string")
              .that.equals("name or city does not exist!");

            done();
          });
      }
    });
  });

  it("TC-202-4 studenthomes with not existing name", (done) => {
    pool.query(INSERT_STUDENTHOME, (error, result) => {
      if (error) {
        done(error);
      }
      if (result) {
        chai
          .request(server)
          .get("/api/studenthome?name=nonexistingname")
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(404);
            res.should.be.an("object");

            res.body.should.be
              .an("object")
              .that.has.all.keys("status", "message");

            let { status, message } = res.body;
            status.should.be.an("string").that.equals("failed");
            message.should.be
              .an("string")
              .that.equals("name or city does not exist!");

            done();
          });
      }
    });
  });

  it("TC-202-5 show studenthouses searching by existing city", (done) => {
    pool.query(INSERT_STUDENTHOME, (error, result) => {
      if (error) {
        done(error);
      }
      if (result) {
        chai
          .request(server)
          .get("/api/studenthome?city=Goes")
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(200);
            res.should.be.an("object");

            let { result } = res.body;
            result.should.be.an("array").that.has.length(2);

            done();
          });
      }
    });
  });

  it("TC-202-6 show studenthouses searching by existing name", (done) => {
    pool.query(INSERT_STUDENTHOME, (error, result) => {
      if (error) {
        done(error);
      }
      if (result) {
        chai
          .request(server)
          .get("/api/studenthome?name=huis")
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(200);
            res.should.be.an("object");

            let { result } = res.body;
            result.should.be.an("array").that.has.length(1);

            done();
          });
      }
    });
  }),
    it("TC-203-1 Studenthome id does not exist", (done) => {
      pool.query(INSERT_STUDENTHOME, (error, result) => {
        if (error) {
          done(error);
        }
        if (result) {
          chai
            .request(server)
            .get("/api/studenthome/10000")
            .end((err, res) => {
              assert.ifError(err);
              res.should.have.status(404);
              res.should.be.an("object");

              res.body.should.be
                .an("object")
                .that.has.all.keys("result", "status");

              let { result, status } = res.body;
              result.should.be.an("string").that.equals("Item not found!");
              status.should.be.an("string").that.equals("404");

              done();
            });
        }
      });
    }),
    it("TC-203-2 Studenthome id does exist", (done) => {
      pool.query(INSERT_STUDENTHOME, (error, result) => {
        if (error) {
          done(error);
        }
        if (result) {
          chai
            .request(server)
            .get("/api/studenthome/1")
            .end((err, res) => {
              assert.ifError(err);
              res.should.have.status(200);
              res.should.be.an("object");

              let { result } = res.body;
              result.should.be.an("array").that.has.length(1);
              done();
            });
        }
      });
    }),
    it("TC-204-1 should return valid error when required value is not present", (done) => {
      pool.query(INSERT_STUDENTHOME, (error, result) => {
        if (error) {
          done(error);
        }
        if (result) {
          chai
            .request(server)
            .put("/api/studenthome/1")
            .set("authorization", "Bearer " + jwt.sign({ id: 1 }, "secret"))
            .send({
              // Name is missing!
              street: "Duizendblad",
              House_Nr: 21,
              Postal_Code: "4421MT",
              Telephone: "0620878866",
              City: "Kapelle",
            })
            .end((err, res) => {
              assert.ifError(err);
              res.should.have.status(400);
              res.should.be.an("object");
              res.error.text.should.be
                .a("string")
                .that.equals("name is missing!");
              done();
            });
        }
      });
    }),
    it("TC-204-2 should return valid error when postalcode is invalid", (done) => {
      pool.query(INSERT_STUDENTHOME, (error, result) => {
        if (error) {
          done(error);
        }
        if (result) {
          chai
            .request(server)
            .put("/api/studenthome/1")
            .set("authorization", "Bearer " + jwt.sign({ id: 1 }, "secret"))
            .send({
              Name: "UpdateHouse",
              street: "Duizendblad",
              House_Nr: 21,
              Postal_Code: "442154MT",
              Telephone: "0620878866",
              City: "Kapelle",
            })
            .end((err, res) => {
              assert.ifError(err);
              res.should.have.status(400);
              res.should.be.an("object");
              res.error.text.should.be
                .a("string")
                .that.equals("postcode is incorrect!");
              done();
            });
        }
      });
    }),
    it("TC-204-3 should return valid error when phonenumber is invalid", (done) => {
      pool.query(INSERT_STUDENTHOME, (error, result) => {
        if (error) {
          done(error);
        }
        if (result) {
          chai
            .request(server)
            .put("/api/studenthome/1")
            .set("authorization", "Bearer " + jwt.sign({ id: 1 }, "secret"))
            .send({
              Name: "UpdateHouse",
              street: "Duizendblad",
              House_Nr: 21,
              Postal_Code: "4421MT",
              Telephone: "0620878884738566",
              City: "Kapelle",
            })
            .end((err, res) => {
              assert.ifError(err);
              res.should.have.status(400);
              res.should.be.an("object");
              res.error.text.should.be
                .a("string")
                .that.equals("phonenumber is incorrect!");
              done();
            });
        }
      });
    }),
    it("TC-204-4 should return valid error when studenthome is not found by id", (done) => {
      pool.query(INSERT_STUDENTHOME, (error, result) => {
        if (error) {
          done(error);
        }
        if (result) {
          chai
            .request(server)
            .put("/api/studenthome/100")
            .set("authorization", "Bearer " + jwt.sign({ id: 1 }, "secret"))
            .send({
              Name: "UpdateHouse",
              street: "Duizendblad",
              House_Nr: 21,
              Postal_Code: "4421MT",
              Telephone: "0620878866",
              City: "Kapelle",
            })
            .end((err, res) => {
              assert.ifError(err);
              res.should.have.status(400);
              res.should.be.an("object");
              res.body.should.be
                .an("object")
                .that.has.all.keys("result", "status");

              let { result, status } = res.body;
              result.should.be
                .an("string")
                .that.equals(
                  "Item not found or you do not have access to this item"
                );
              status.should.be.an("string");
              done();
            });
        }
      });
    }),
    it("TC-204-6 should return a updated studenthome", (done) => {
      pool.query(INSERT_STUDENTHOME, (error, result) => {
        if (error) {
          done(error);
        }
        if (result) {
          chai
            .request(server)
            .put("/api/studenthome/1")
            .set("authorization", "Bearer " + jwt.sign({ id: 1 }, "secret"))
            .send({
              Name: "UpdateHouse",
              street: "Duizendblad",
              House_Nr: 21,
              Postal_Code: "4421MT",
              Telephone: "0620878866",
              City: "Kapelle",
            })
            .end((err, res) => {
              assert.ifError(err);
              res.should.have.status(200);
              done();
            });
        }
      });
    }),
    it("TC-205-1 could not delete a studenthome by id, because it doesnt exist, ", (done) => {
      pool.query(INSERT_STUDENTHOME, (error, result) => {
        if (error) {
          done(error);
        }
        if (result) {
          chai
            .request(server)
            .delete("/api/studenthome/3")
            .set("authorization", "Bearer " + jwt.sign({ id: 1 }, "secret"))
            .end((err, res) => {
              assert.ifError(err);
              res.should.have.status(404);
              res.should.be.an("object");
              res.body.should.be
                .an("object")
                .that.has.all.keys("result", "status");

              let { result, status } = res.body;
              result.should.be
                .an("string")
                .that.equals(
                  "Item not found or you do not have access to this item"
                );
              status.should.be.an("string");

              done();
            });
        }
      });
    }),
    // TC-205-2 NOG

    it("TC-205-3 could not delete a studenthome by id, because your not logged in, ", (done) => {
      pool.query(INSERT_STUDENTHOME, (error, result) => {
        if (error) {
          done(error);
        }
        if (result) {
          chai
            .request(server)
            .delete("/api/studenthome/1")
            .set("authorization", "Bearer " + jwt.sign({ id: 2 }, "secret"))
            .end((err, res) => {
              assert.ifError(err);
              res.should.have.status(404); // moet eig 401 zijn
              res.should.be.an("object");
              res.body.should.be
                .an("object")
                .that.has.all.keys("result", "status");

              let { result, status } = res.body;
              result.should.be
                .an("string")
                .that.equals(
                  "Item not found or you do not have access to this item"
                );
              status.should.be.an("string");

              done();
            });
        }
      });
    }),
    it("TC-205-4 item is deleted", (done) => {
      pool.query(INSERT_STUDENTHOME, (error, result) => {
        if (error) {
          done(error);
        }
        if (result) {
          chai
            .request(server)
            .delete("/api/studenthome/1")
            .set("authorization", "Bearer " + jwt.sign({ id: 1 }, "secret"))
            .end((err, res) => {
              assert.ifError(err);
              res.should.have.status(200);
              res.should.be.an("object");
              done();
            });
        }
      });
    });
});
