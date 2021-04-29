module.exports = {
    db: [
      // Hard-coded Movie als voorbeeld van een database met 1 item.
      {
        name: "Blade runner",
        year: 1990,
        studio: "MGM",
      },
    ],
    info: "This is the database",
  
    // Gebruik deze add() om vanuit je routes items in de in-memory database te zetten.
    add(item, callback) {
      // De setTimeout SIMULEERT in ons geval de vertraging die een echte database
      // zou hebben. Zodra we dus een echte SQL database gaan gebruiken hebben we de
      // setTimeout niet meer nodig.
      setTimeout(() => {
        this.db.push(item);
        callback("success", undefined);
      }, 3500);
    },
  
    // get() om één item uit de database te lezen.
    get(index, callback) {
      setTimeout(() => {
        // get item from array
        const itemNotFound = true;
        if (itemNotFound) {
          callback(undefined, "error, item not found");
        } else {
          callback({ name: "item" }, undefined);
        }
      }, 3500);
    },
  };
  