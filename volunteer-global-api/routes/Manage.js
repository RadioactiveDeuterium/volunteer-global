const express = require('express');
const router = express.Router();
const Position = require('../models/Position');
const UserPositionLink = require('../models/UserPositionLink');
const authMiddleware = require('../middleware/authMiddleware');
const accountsMiddleware = require('../middleware/accountsMiddleware');

// apply for a position
router.post(
  '/apply/:id',
  [authMiddleware.requireAuth, accountsMiddleware.getIndAccount],
  async function (req, res) {
    // check if already applied
    const existingApp = await UserPositionLink.find({
      UserID: res.locals.indAccount._id.toString(),
      PositionID: req.params.id,
    });
    if (existingApp.length !== 0) {
      res.status(400);
      res.json({
        success: false,
        message: 'An application already exists for this position',
      });
      return;
    }
    var position;
    // retrieve relevant data
    position = await Position.findById(req.params.id);
    if (!position) {
      res.status(401);
      res.send({ success: false, message: 'Position not found' });
      return;
    }
    // check for screening questions
    if (position.ScreeningQuestions) {
      if (
        req.body.screeningResponses?.length !==
        position.ScreeningQuestions.length
      ) {
        res.status(400);
        res.send({
          success: false,
          message: 'Request must include response to screening questions',
        });
        return;
      }
    }
    const userPositionLink = new UserPositionLink({
      UserID: res.locals.indAccount._id.toString(),
      PositionID: position._id.toString(),
      ScreeningResponses: req.body.screeningResponses,
      Status: 'pending',
    });
    await userPositionLink.save();
    res.status(201);
    res.json({ success: true, message: 'Application sucessful' });
  }
);

module.exports = router;
