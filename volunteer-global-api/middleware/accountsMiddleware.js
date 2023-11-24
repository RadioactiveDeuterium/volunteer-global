const OrgAccount = require('../models/OrgAccount');
const User = require('../models/User');

const getOrgAccount = async function (req, res, next) {
  res.locals.user = await User.findOne({ username: req.session.passport.user });
  if (res.locals.user.type !== 'org') {
    return res.json({ message: 'Authenticated account incorrect type' });
  }
  res.locals.orgAccount = await OrgAccount.findOne({
    _id: res.locals.user.accountID,
  });
  next();
};

module.exports = {
  getOrgAccount,
};
