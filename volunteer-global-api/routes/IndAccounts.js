const express = require('express');
const router = express.Router();
const passport = require('passport');
const IndAccount = require('../models/IndAccount');
const User = require('../models/User');
const indAccountSchemas = require('../schemas/indAccountsSchemas');
const validationMiddleware = require('../middleware/validationMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const accountsMiddleware = require('../middleware/accountsMiddleware');

// ind register
router.post(
  '/register',
  [validationMiddleware.validateSchema(indAccountSchemas.registerSchema)],
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
          const indAccount = new IndAccount({
            Name: req.body.name,
            Email: req.body.email,
            Phone: req.body.phone,
          });
          await indAccount.save();
          user.accountID = indAccount._id.toString();
          user.type = 'ind';
          await user.save();
          res.status(201);
          res.json({ success: true, message: 'Account creation sucessful' });
        });
      }
    );
  }
);

// ind login
router.post(
  '/login',
  [validationMiddleware.validateSchema(indAccountSchemas.loginSchema)],
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
        if (user.type !== 'ind') {
          res.status(400);
          return res.json({
            success: false,
            message: 'this is not a ind account',
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
    validationMiddleware.validateSchema(indAccountSchemas.changePasswordSchema),
    accountsMiddleware.getIndAccount,
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
  [authMiddleware.requireAuth, accountsMiddleware.getIndAccount],
  async (req, res) => {
    res.status(200);
    res.send({ user: res.locals.user, indAccount: res.locals.indAccount });
  }
);

// update account information
router.patch(
  '/',
  [
    authMiddleware.requireAuth,
    validationMiddleware.validateSchema(indAccountSchemas.updateSchema),
    accountsMiddleware.getIndAccount,
  ],
  async (req, res) => {
    const indAccount = res.locals.indAccount;
    if (req.body.name) {
      indAccount.Name = req.body.name;
    }
    if (req.body.email) {
      indAccount.Email = req.body.email;
    }
    if (req.body.phone) {
      indAccount.Phone = req.body.phone;
    }
    await indAccount.save();

    const user = res.locals.user;
    if (req.body.username) {
      user.username = req.body.username;
    }
    await user.save();

    res.send({ success: true, user, indAccount });
  }
);

module.exports = router;
