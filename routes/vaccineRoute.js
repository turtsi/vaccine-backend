const express = require("express");
const router = express.Router();
const dayjs = require("dayjs");
const getAntiqua = require("../controllers/antiquaController");
const getZerpfy = require("../controllers/zerpfyController");
const getSolar = require("../controllers/solarController");

router.get("/vaccines", async (req, res) => {
  if (req.query.date != null) {
    if (!validateDate(req.query.date)) res.json({ message: "Invalid date" });
    try {
      const date = dayjs(req.query.date)
        .hour(23)
        .minute(59)
        .second(59)
        .format("YYYY-MM-DDTHH:mm:ss.SSSSSS[Z]");
      const monthDate = formatMonthDate(date);
      const nextTenDays = formatNextTenDate(date);
      const startOfDay = dayjs(req.query.date)
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0)
        .format("YYYY-MM-DDTHH:mm:ss.SSSSSS[Z]");

      const endOfDay = dayjs(req.query.date)
        .hour(23)
        .minute(59)
        .second(59)
        .format("YYYY-MM-DDTHH:mm:ss.SSSSSS[Z]");
      const startOfMonth = dayjs(monthDate)
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0)
        .format("YYYY-MM-DDTHH:mm:ss.SSSSSS[Z]");
      if (req.query.v === "antiqua") {
        const data = await getAntiqua(
          date,
          monthDate,
          startOfMonth,
          nextTenDays,
          startOfDay,
          endOfDay
        );
        res.json(data);
      } else if (req.query.vaccine === "zerpfy") {
        const data = await getZerpfy(
          date,
          monthDate,
          startOfMonth,
          nextTenDays,
          startOfDay,
          endOfDay
        );
        res.json(data);
      } else if (req.query.vaccine === "solar") {
        const data = await getSolar(
          date,
          monthDate,
          startOfMonth,
          nextTenDays,
          startOfDay,
          endOfDay
        );
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

const formatMonthDate = (date) => {
  const newDate = new Date(date);
  const monthDate = newDate.setDate(newDate.getDate() - 30);
  const formattedMonthDate = dayjs(monthDate).format(
    "YYYY-MM-DDTHH:mm:ss.SSSSSS[Z]"
  );
  return formattedMonthDate;
};

const formatNextTenDate = (date) => {
  const newDate = new Date(date);
  const nextTenDaysDate = newDate.setDate(newDate.getDate() - 20);
  const formattedNextTenDate = dayjs(nextTenDaysDate).format(
    "YYYY-MM-DDTHH:mm:ss.SSSSSS[Z]"
  );
  return formattedNextTenDate;
};

module.exports = router;
