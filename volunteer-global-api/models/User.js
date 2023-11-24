var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var schema = mongoose.Schema({
  username: String,
  accountID: String,
  type: String,
});

schema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', schema);
