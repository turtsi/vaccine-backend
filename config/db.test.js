const mongoose = require("mongoose");
require("./db");

test("mongoose connection", () => {
  try {
    const test = mongoose.connection.readyState;
    if (test === 1 || test === 2) {
      console.log("Connection success");
    }
  } catch (error) {
    console.error(error);
  }
});
