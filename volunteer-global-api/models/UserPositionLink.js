const mongoose = require('mongoose');

const schema = mongoose.Schema({
  UserID: String,
  PositionID: String,
  TimeSlotIDs: [String],
  ScreeningResponses: [String],
  Status: String,
});

module.exports = mongoose.model('UserPositionLink', schema);
