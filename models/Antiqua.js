const mongoose = require("mongoose");

const antiquaSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  orderNumber: {
    type: Number,
    required: true,
  },
  responsiblePerson: {
    type: String,
    required: true,
  },
  healthCareDistrict: {
    type: String,
    required: true,
  },
  vaccine: {
    type: String,
    required: true,
  },
  injections: {
    type: Number,
    required: true,
  },
  arrived: {
    type: String,
    required: true,
  },
});

const Antiqua = mongoose.model("antiqua", antiquaSchema);

module.exports = Antiqua;
