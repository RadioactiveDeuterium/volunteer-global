const mongoose = require('mongoose');

const schema = mongoose.Schema({
  companyName: String,
  contactEmail: String,
  contactPhone: String,
});

module.exports = mongoose.model('OrgAccount', schema);
