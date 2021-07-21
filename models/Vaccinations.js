const mongoose = require("mongoose");

const vaccinationsSchema = new mongoose.Schema({
  "vaccination-id": {
    type: String,
    required: true,
  },
  sourceBottle: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  vaccinationDate: {
    type: String,
    required: true,
  },
});

const Vaccinations = mongoose.model("vaccinations", vaccinationsSchema);

module.exports = Vaccinations;
