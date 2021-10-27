const mongoose = require("mongoose");

const LocalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  coords: {
    lat: {
      type: Number,
      required: true,
    },
    lon: {
      type: Number,
      required: true,
    },
  },
  address: {
    type: String,
    required: true,
  },
});

const Local = mongoose.model("Local", LocalSchema, "Locals");

module.exports = Local;
