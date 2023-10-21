const mongoose = require("mongoose");

const databaseConnection = () => {
  mongoose
    .connect("mongodb://0.0.0.0:27017/e-commerce-web", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`Database Connected successfully ${data.connection.host}`);
    });
};

module.exports = databaseConnection;
