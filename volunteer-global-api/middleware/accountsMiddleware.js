const OrgAccount = require("../models/OrgAccount");
const User = require("../models/User");

const getOrgAccount = async function(req, res, next) {
    res.locals.user = await User.findOne({ username: req.session.passport.user });
    res.locals.orgAccount = await OrgAccount.findOne({ _id: res.locals.user.accountID });
    next();
}

module.exports = {
    getOrgAccount
}