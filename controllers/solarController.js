const Solar = require("../models/SolarBuddhica");
const {
  getTotalInjections,
  getTotalUsed,
  getExpiredBottles,
  getVaccinatedGender,
} = require("./functions");

const getAllSolar = async (req, res) => {
  try {
    const data = await Solar.find({});
    if (data) {
      res.json(data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getSolar = async (
  date,
  monthDate,
  startOfMonth,
  nextTenDays,
  startOfDay,
  endOfDay
) => {
  const data = await Solar.aggregate([
    {
      $lookup: {
        from: "vaccinations",
        let: { solar_id: "$id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$sourceBottle", "$$solar_id"],
              },
            },
          },
        ],
        as: "dateInjected",
      },
    },
    {
      $match: { arrived: { $lte: date } },
    },
  ]);

  const tenDayData = await Solar.aggregate([
    {
      $lookup: {
        from: "vaccinations",
        let: { solar_id: "$id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$sourceBottle", "$$solar_id"],
              },
            },
          },
        ],
        as: "dateInjected",
      },
    },
    {
      $match: { arrived: { $gte: monthDate, $lte: nextTenDays } },
    },
  ]);
  const expiredBottles = await Solar.aggregate([
    {
      $lookup: {
        from: "vaccinations",
        let: { solar_id: "$id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$sourceBottle", "$$solar_id"],
              },
            },
          },
        ],
        as: "dateInjected",
      },
    },
    {
      $match: { arrived: { $lte: monthDate } },
    },
  ]);
  const vaccinesLeft = await Solar.aggregate([
    {
      $lookup: {
        from: "vaccinations",
        let: { solar_id: "$id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$sourceBottle", "$$solar_id"],
              },
            },
          },
        ],
        as: "dateInjected",
      },
    },
    {
      $match: { arrived: { $gte: startOfMonth, $lte: date } },
    },
  ]);
  const ordersToday = await Solar.aggregate([
    {
      $lookup: {
        from: "vaccinations",
        let: { solar_id: "$id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$sourceBottle", "$$solar_id"],
              },
            },
          },
        ],
        as: "dateInjected",
      },
    },
    {
      $match: { arrived: { $gte: startOfDay, $lte: endOfDay } },
    },
  ]);

  const expiredBottleInjections =
    getTotalInjections(expiredBottles) - getTotalUsed(expiredBottles);
  const totalVaccinesLeft =
    getTotalInjections(vaccinesLeft) - getTotalUsed(vaccinesLeft);

  const importData = {
    totalOrders: data.length,
    ordersToday: ordersToday.length,
    totalInjections: getTotalInjections(data),
    totalUsed: getTotalUsed(data),
    vaccinesLeft: totalVaccinesLeft,
    totalExpiredBottles: getExpiredBottles(expiredBottles),
    totalExpiredInjections: expiredBottleInjections,
    nextTenDayExpire: getExpiredBottles(tenDayData),
    gender: {
      male: getVaccinatedGender(data, "male"),
      female: getVaccinatedGender(data, "female"),
      nonbinary: getVaccinatedGender(data, "nonbinary"),
    },
  };

  return importData;
};

module.exports = { getSolar, getAllSolar };
