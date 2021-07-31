const express = require("express");
const router = express.Router();
const Antiqua = require("../models/Antiqua");
const Zerpfy = require("../models/Zerpfy");
const Solar = require("../models/SolarBuddhica");
const Vaccines = require("../models/Vaccinations");

const { getData } = require("../controller/vaccineControllers");

// router.get("/", getData);

router.get("/vaccines", async (req, res) => {
  let string = req.query.healthCareDistrict;
  console.log(string);

  try {
    const data = await Antiqua.find({ healthCareDistrict: string });
    db.Antiqua.find({});
    console.log(data);
    // const data = await Antiqua.find(req.query.rp);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/vaccines/date", async (req, res) => {
  let date = req.query.d;
  try {
    const data = await Antiqua.find({ arrived: date });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
module.exports = router;
