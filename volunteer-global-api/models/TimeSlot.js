const mongoose = require('mongoose');

const schema = mongoose.Schema({
  PositionID: String,
  DateTime: Date,
  Length: Number,
});

module.exports = mongoose.model('TimeSlot', schema);
