const express = require('express');
const router = express.Router();
const Position = require('../models/Position');
const passport = require('passport');
const authMiddleware = require('../middleware/authMiddleware');
const accountsMiddleware = require('../middleware/accountsMiddleware');

router.post(
  '/',
  [authMiddleware.requireAuth, accountsMiddleware.getOrgAccount],
  async function (req, res) {
    const post = new Position({
      OrgID: res.locals.orgAccount._id.toString(),
      Title: req.body.title,
      Description: req.body.description,
    });
    await post.save();
    res.json({ success: true, message: 'Position created sucessfully' });
  }
);

module.exports = router;
