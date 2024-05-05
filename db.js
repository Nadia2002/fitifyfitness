const mongoose = require("mongoose");

const connection_string = "mongodb+srv://saifsakr02:PepC9vzvbJHJzlYK@gymapp.n69nqfs.mongodb.net/";

function connectToDb() {
  mongoose.connect(connection_string);

  mongoose.connection.on("connected", () => {
    console.log("Connection to MongoDB successful");
  });

  mongoose.connection.on("error", () => {
    console.log("An error occured");
  });
};

module.exports = { connectToDb };