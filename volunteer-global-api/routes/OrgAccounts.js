const express = require("express")
const router = express.Router()
const OrgAccount = require("../models/OrgAccount")
const User = require("../models/User")
const passport = require("passport");
const authMiddleware = require("../middleware/authMiddleware");
const accountsMiddleware = require("../middleware/accountsMiddleware");

// org register
router.post("/organization/register", function(req, res) {
    User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
        if (err) {
            return res.json({ success: false, message: "Your account could not be saved. Error: " + err });
        }
        req.login(user, async(er) => {
            if (er) {
                return res.json({ success: false, message: er });
            }
            const orgAccount = new OrgAccount({
                companyName: req.body.companyName,
                contactEmail: req.body.contactEmail,
                contactPhone: req.body.contactPhone,
            });
            await orgAccount.save();
            user.accountID = orgAccount._id.toString();
            user.type = 'org';
            await user.save();
            res.json({ success: true, message: "Account creation sucessful" });
        })

    });
});

// org login
router.post("/organization/login", function(req, res) {
    if (!req.body.username) {
        return res.json({ success: false, message: "Username was not given" });
    }
    if (!req.body.password) {
        return res.json({ success: false, message: "Password was not given" });
    }
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return res.json({ success: false, message: err });
        }
        if (!user) {
            return res.json({ success: false, message: 'username or password incorrect' });
        }
        req.login(user, function(err) {
            if (err) {
                return res.json({ success: false, message: err });
            }
            if (user.type !== 'org') {
                return res.json({ success: false, message: 'this is not a org account' });
            }
            res.json({ success: true, message: "Authentication successful" });
        })
    })(req, res);
});

// destroys the session
router.post("/organization/logout", authMiddleware.requireAuth, function(req, res) {
    req.session.destroy(function(err) {
        res.json({ success: true, message: "Logout successful" });
    });
})

// returns the current logged in accounts info
router.get("/organization", [authMiddleware.requireAuth, accountsMiddleware.getOrgAccount], async(req, res) => {
    res.send({ user: res.locals.user, orgAccount: res.locals.orgAccount });
});

// update
router.patch("/organization", [authMiddleware.requireAuth, accountsMiddleware.getOrgAccount], async(req, res) => {
    try {
        const orgAccount = res.locals.orgAccount;

        if (req.body.companyName) {
            orgAccount.companyName = req.body.companyName
        }

        if (req.body.contactEmail) {
            orgAccount.contactEmail = req.body.contactEmail
        }

        if (req.body.contactPhone) {
            orgAccount.contactPhone = req.body.contactPhone
        }

        await orgAccount.save()
        res.send(orgAccount)
    } catch {
        res.status(404)
        res.send({ error: "Account doesn't exist!" })
    }
})

module.exports = router;