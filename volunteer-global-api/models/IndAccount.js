const mongoose = require('mongoose');

const schema = mongoose.Schema({
  Name: String,
  Email: String,
  Phone: String,
});

module.exports = mongoose.model('IndAccount', schema);
