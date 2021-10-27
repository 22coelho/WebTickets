const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: false,
  },
  capacity: {
    type: Number,
    required: true,
  },
  ticketPrice: {
    type: Number,
    required: true,
  },
  imagem: {
    type: String,
    default: "http://localhost:3000/images/default.jpg"
  },
  location: {
    type: Object
  },
  published: {
    type: Boolean,
    default: false
  }
});

const Event = mongoose.model("Event", EventSchema, "Events");

module.exports = Event;
