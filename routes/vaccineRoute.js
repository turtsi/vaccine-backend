const express = require("express");
const router = express.Router();
const dayjs = require("dayjs");
const {
  getAntiqua,
  getZerpfy,
  getSolar,
} = require("../controllers/vaccineControllers");

router.get("/vaccines", async (req, res) => {
  if (req.query.d != null) {
    if (!validateDate(req.query.d)) res.json({ message: "Invalid date" });
    try {
      const date = dayjs(req.query.d).format("YYYY-MM-DDTHH:mm:ss.SSSSSS[Z]");

      if (req.query.v === "antiqua") {
        const data = await getAntiqua(date);
        res.json(data);
      } else if (req.query.v === "zerpfy") {
        const data = await getZerpfy(date);
        res.json(data);
      } else if (req.query.v === "solar") {
        const data = await getSolar(date);
        res.json(data);
      } else {
        res.json({ message: "Invalid query" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  } else {
    res.json({ message: "Invalid query" });
  }
});

const validateDate = (date) => {
  const format = "YYYY-MM-DD";
  return dayjs(date, format).format(format) === date;
};

module.exports = router;
