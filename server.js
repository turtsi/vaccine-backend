require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const vaccineRoute = require("./routes/vaccineRoute");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/vaccines", vaccineRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
