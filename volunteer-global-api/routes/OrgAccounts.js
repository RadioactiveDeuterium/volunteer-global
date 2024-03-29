const express = require('express');
const router = express.Router();
const OrgAccount = require('../models/OrgAccount');
const User = require('../models/User');
const passport = require('passport');
const authMiddleware = require('../middleware/authMiddleware');
const accountsMiddleware = require('../middleware/accountsMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');
const orgAccountSchemas = require('../schemas/orgAccountsSchemas');

// org register
router.post(
  '/register',
  [validationMiddleware.validateSchema(orgAccountSchemas.registerSchema)],
  function (req, res) {
    User.register(
      new User({ username: req.body.username }),
      req.body.password,
      function (err, user) {
        if (err) {
          res.status(500);
          return res.json({
            success: false,
            message: 'Your account could not be saved. Error: ' + err,
          });
        }
        req.login(user, async (er) => {
          if (er) {
            res.status(500);
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
          res.status(201);
          res.json({ success: true, message: 'Account creation sucessful' });
        });
      }
    );
  }
);

// org login
router.post(
  '/login',
  [validationMiddleware.validateSchema(orgAccountSchemas.loginSchema)],
  function (req, res) {
    passport.authenticate('local', function (err, user, info) {
      if (err) {
        res.status(500);
        return res.json({ success: false, message: err });
      }
      if (!user) {
        res.status(400);
        return res.json({
          success: false,
          message: 'username or password incorrect',
        });
      }
      req.login(user, function (err) {
        if (err) {
          res.status(500);
          return res.json({ success: false, message: err });
        }
        if (user.type !== 'org') {
          res.status(400);
          return res.json({
            success: false,
            message: 'this is not a org account',
          });
        }
        res.status(200);
        res.json({ success: true, message: 'Authentication successful' });
      });
    })(req, res);
  }
);

// destroys the session
router.post('/logout', authMiddleware.requireAuth, function (req, res) {
  req.session.destroy(function (err) {
    res.status(200);
    res.json({ success: true, message: 'Logout successful' });
  });
});

// update password
router.post(
  '/changePassword',
  [
    authMiddleware.requireAuth,
    validationMiddleware.validateSchema(orgAccountSchemas.changePasswordSchema),
    accountsMiddleware.getOrgAccount,
  ],
  function (req, res) {
    res.locals.user.setPassword(req.body.password, async function (err, user) {
      if (err) {
        res.status(500);
        return res.json({ success: false, message: 'Error changing password' });
      }
      await res.locals.user.save();
      res.status(200);
      return res.json({ success: true, message: 'Password updated' });
    });
  }
);

// returns the current logged in accounts info
router.get(
  '/',
  [authMiddleware.requireAuth, accountsMiddleware.getOrgAccount],
  async (req, res) => {
    res.status(200);
    res.send({ user: res.locals.user, orgAccount: res.locals.orgAccount });
  }
);

// update account information
router.patch(
  '/',
  [
    authMiddleware.requireAuth,
    validationMiddleware.validateSchema(orgAccountSchemas.updateSchema),
    accountsMiddleware.getOrgAccount,
  ],
  async (req, res) => {
    const orgAccount = res.locals.orgAccount;
    if (req.body.companyName) {
      orgAccount.companyName = req.body.companyName;
    }
    if (req.body.contactEmail) {
      orgAccount.contactEmail = req.body.contactEmail;
    }
    if (req.body.contactPhone) {
      orgAccount.contactPhone = req.body.contactPhone;
    }
    await orgAccount.save();

    const user = res.locals.user;
    if (req.body.username) {
      user.username = req.body.username;
    }
    await user.save();

    res.send({ success: true, user, orgAccount });
  }
);

module.exports = router;
