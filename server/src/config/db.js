const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("db connect");
    })
    .catch((error) => {
      console.log("--------------------------");
      console.log("error: " + error);
      console.log("--------------------------");
    });
};

module.exports = connectDB;