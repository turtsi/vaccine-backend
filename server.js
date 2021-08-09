require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const vaccineRoute = require("./routes/vaccineRoute");

connectDB();

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json(
    "Backend made using node.js and express. Raw vaccine data is found on /antiqua, /solar and /zerpfy"
  );
});
app.get("/antiqua", vaccineRoute);
app.get("/solar", vaccineRoute);
app.get("/zerpfy", vaccineRoute);
app.get("/vaccines", vaccineRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
