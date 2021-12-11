const mongoose = require("mongoose");
const mongoDBuri = "mongodb://localhost:27017/JWT";

const mongod = async () => {
  mongoose
    .connect(mongoDBuri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log("mongoDB Connected... ");
    });
};

module.exports = mongod;
