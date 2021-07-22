const Antiqua = require("../models/Antiqua");

const getAllAntiqua = async (req, res) => {
  try {
    const antiqua = await Antiqua.find({});

    res.json(antiqua);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
const getById = async (req, res) => {
  try {
    const data = await Antiqua.findById(req.params.id);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getByName = async (req, res) => {
  try {
    const data = await Antiqua.find(req.params.responsiblePerson);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getByDistrict = async (req, res) => {
  try {
    const data = await Antiqua.find(req.params.healthCareDistrict);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllAntiqua,
  getById,
  getByName,
  getByDistrict,
};
