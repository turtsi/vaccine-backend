const Antiqua = require("../models/Antiqua");
const {
  getTotalInjections,
  getTotalUsed,
  getExpiredBottles,
  getVaccinatedGender,
} = require("./functions");

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
    gender: {
      male: getVaccinatedGender(data, "male"),
      female: getVaccinatedGender(data, "female"),
      nonbinary: getVaccinatedGender(data, "nonbinary"),
    },
  };

  return importData;
};

module.exports = getAntiqua;
