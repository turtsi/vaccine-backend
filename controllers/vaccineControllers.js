const Antiqua = require("../models/Antiqua");
const Zerpfy = require("../models/Zerpfy");
const Solar = require("../models/SolarBuddhica");

const getAntiqua = async (date) => {
  const antiqua = await Antiqua.aggregate([
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
  return antiqua;
};

const getZerpfy = async (date) => {
  const zerpfy = await Zerpfy.aggregate([
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
  return zerpfy;
};

const getSolar = async (date) => {
  const solar = await Solar.aggregate([
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
  return solar;
};

module.exports = {
  getAntiqua,
  getZerpfy,
  getSolar,
};
