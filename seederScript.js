require("dotenv").config();

const antiquaData = require("./data/Antiqua");
const zerpfyData = require("./data/Zerpfy");
const solarData = require("./data/SolarBuddhica");
const vaccineData = require("./data/vaccinations");

const connectDB = require("./config/db");

const Antiqua = require("./models/Antiqua");
const Zerpfy = require("./models/Zerpfy");
const SolarBuddhica = require("./models/SolarBuddhica");
const Vaccinations = require("./models/Vaccinations");

connectDB();

const importData = async () => {
  try {
    await Antiqua.deleteMany({});
    await Zerpfy.deleteMany({});
    await SolarBuddhica.deleteMany({});
    await Vaccinations.deleteMany({});

    await Antiqua.insertMany(antiquaData);
    await Zerpfy.insertMany(zerpfyData);
    await SolarBuddhica.insertMany(solarData);
    await Vaccinations.insertMany(vaccineData);

    console.log("Data import success");
    process.exit(1);
  } catch (error) {
    console.error("Error with data import: " + error);
    process.exit(1);
  }
};

importData();
