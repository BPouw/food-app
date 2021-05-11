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

  getAll(name, city, callback) {

    if( typeof name == 'undefined' && typeof city == 'undefined') {
      callback(undefined, database.db);
    }

    if(name && city) {
      var QueryItem = database.db.filter(x => x.city == city && x.name == name)
      callback(undefined, QueryItem)
    }

    if (name) {
      var QueryItem = database.db.filter(x => x.name == name)
      callback(undefined, QueryItem)
    }

    if (city) {
      var QueryItem = database.db.filter(x => x.city == city)
      callback(undefined, QueryItem)
    }

  },

  getById(index, callback) {
    var ArrayItem = database.db.filter(x => x.id == index)
    setTimeout(() => {
        callback(undefined, ArrayItem);
      }, timeToWait);
  },

  delete(index, callback) {
    // if (index - 1 > database.db.size) {
    //   callback(undefined, undefined)
    // }
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