const requireAuth = function(req, res, next) {
    if (!req.session.passport) {
        return res.sendStatus(401);
    }
    next();
}

module.exports = {
    requireAuth
}