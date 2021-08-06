const Zerpfy = require("../models/Zerpfy");
const {
  getTotalInjections,
  getTotalUsed,
  getExpiredBottles,
  getVaccinatedGender,
} = require("./functions");

const getZerpfy = async (
  date,
  monthDate,
  startOfMonth,
  nextTenDays,
  startOfDay,
  endOfDay
) => {
  const data = await Zerpfy.aggregate([
    {
      $lookup: {
        from: "vaccinations",
        let: { zerpfy_id: "$id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$sourceBottle", "$$zerpfy_id"],
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

  const tenDayData = await Zerpfy.aggregate([
    {
      $lookup: {
        from: "vaccinations",
        let: { zerpfy_id: "$id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$sourceBottle", "$$zerpfy_id"],
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
  const expiredBottles = await Zerpfy.aggregate([
    {
      $lookup: {
        from: "vaccinations",
        let: { zerpfy_id: "$id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$sourceBottle", "$$zerpfy_id"],
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
  const vaccinesLeft = await Zerpfy.aggregate([
    {
      $lookup: {
        from: "vaccinations",
        let: { zerpfy_id: "$id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$sourceBottle", "$$zerpfy_id"],
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
  const ordersToday = await Zerpfy.aggregate([
    {
      $lookup: {
        from: "vaccinations",
        let: { zerpfy_id: "$id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$sourceBottle", "$$zerpfy_id"],
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

module.exports = getZerpfy;