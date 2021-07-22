const express = require("express");
const router = express.Router();

const {
  getAllAntiqua,
  getById,
  getByName,
  getByDistrict,
} = require("../controller/vaccineControllers");

//@desc GET all antiqua vaccines
router.get("/", getAllAntiqua);

//@desc GET antiqua vaccines by id
router.get("/:id", getById);

router.get("/:responsiblePerson", getByName);

router.get("/:healthCareDistrict", getByDistrict);

module.exports = router;
