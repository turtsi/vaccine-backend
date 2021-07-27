const express = require("express");
const router = express.Router();
const Antiqua = require("../models/Antiqua");

const { getData } = require("../controller/vaccineControllers");

// router.get("/", getData);

router.get("/", async (req, res) => {
  try {
    const data = await Antiqua.find(req.query.rp);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
