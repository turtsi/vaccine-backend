require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const antiquaRoute = require("./routes/antiquaRoute");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/antiqua", antiquaRoute);
app.get("/api/other", antiquaRoute);
app.get("/", function (req, res) {
  res.send("hello world");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
