const e = require("express");

const timeToWait = 800;
let lastInsertedIndex = 0;

let database = {
  db: [],
  info: "This is the home database",

  add(item, callback) {
    setTimeout(() => {
      item.id = lastInsertedIndex++;
      this.db.push(item);
      callback(undefined, item);
    }, timeToWait);
  },

  getAll(callback) {
    setTimeout(() => {
      callback(undefined, database.db);
    }, timeToWait);
  },

  getById(index, callback) {
    // var ArrayItem = database.db[index]
    var ArrayItem = database.db.filter(x => x.id == index)
    setTimeout(() => {
        callback(undefined, ArrayItem);
      }, timeToWait);
  },

  delete(index, callback) {
    let removed = database.db.splice(index, 1)
    setTimeout(() => {
        callback(undefined, removed);
      }, timeToWait);
  },

  update(index, home, callback) {
    let updated = database.db.splice(index, 1, home)
    setTimeout(() => {
        callback(undefined, updated);
      }, timeToWait);
  },

};

module.exports = database;