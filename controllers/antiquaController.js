const Antiqua = require("../models/Antiqua");
const {
  getTotalInjections,
  getTotalUsed,
  getExpiredBottles,
  getVaccinatedGender,
  getHealthDistrict,
} = require("./functions");

const getAllAntiqua = async (req, res) => {
  try {
    const data = await Antiqua.find({});
    if (data) {
      res.json(data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
const getAntiqua = async (
  date,
  monthDate,
  startOfMonth,
  nextTenDays,
  startOfDay,
  endOfDay
) => {
  const data = await Antiqua.aggregate([
    {
      $lookup: {
        from: "vaccinations",
        let: { antiqua_id: "$id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$sourceBottle", "$$antiqua_id"],
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

  const tenDayData = await Antiqua.aggregate([
    {
      $lookup: {
        from: "vaccinations",
        let: { antiqua_id: "$id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$sourceBottle", "$$antiqua_id"],
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
  const expiredBottles = await Antiqua.aggregate([
    {
      $lookup: {
        from: "vaccinations",
        let: { antiqua_id: "$id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$sourceBottle", "$$antiqua_id"],
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
  const vaccinesLeft = await Antiqua.aggregate([
    {
      $lookup: {
        from: "vaccinations",
        let: { antiqua_id: "$id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$sourceBottle", "$$antiqua_id"],
              },
            },
          },
        ],
        as: "dateInjected",
      },
    },
    {
      $match: { arrived: { $gte: startOfMonth, $lte: endOfDay } },
    },
  ]);
  const ordersToday = await Antiqua.aggregate([
    {
      $lookup: {
        from: "vaccinations",
        let: { antiqua_id: "$id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$sourceBottle", "$$antiqua_id"],
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
    vaccinationsPerDistrict: {
      hyks: getHealthDistrict(data, "HYKS"),
      kys: getHealthDistrict(data, "KYS"),
      oys: getHealthDistrict(data, "OYS"),
      tays: getHealthDistrict(data, "TAYS"),
      tyks: getHealthDistrict(data, "TYKS"),
    },
    gender: {
      male: getVaccinatedGender(data, "male"),
      female: getVaccinatedGender(data, "female"),
      nonbinary: getVaccinatedGender(data, "nonbinary"),
    },
  };

  return importData;
};

module.exports = { getAntiqua, getAllAntiqua };
