const mongoose = require("mongoose");

const db = () => {
  mongoose
    .connect('mongodb://localhost:27017/Authentication', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then((data) => {
      console.log(`Database connected on server: ${data.connection.host}`);
    });
};

module.exports = db;