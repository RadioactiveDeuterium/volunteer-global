const mongoose = require('mongoose');

const schema = mongoose.Schema({
  OrgID: String,
  Title: String,
  Description: String,
  ScreeningQuestions: [String],
});

module.exports = mongoose.model('Position', schema);
