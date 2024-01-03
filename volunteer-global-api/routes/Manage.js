const express = require('express');
const router = express.Router();
const Position = require('../models/Position');
const UserPositionLink = require('../models/UserPositionLink');
const authMiddleware = require('../middleware/authMiddleware');
const accountsMiddleware = require('../middleware/accountsMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');
const manageSchemas = require('../schemas/manageSchemas');

// apply for a position
router.post(
  '/apply/:id',
  [
    authMiddleware.requireAuth,
    validationMiddleware.validateSchema(manageSchemas.applySchema),
    accountsMiddleware.getIndAccount,
  ],
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

// accept a applicant (org owner only)
router.post(
  '/acceptApplication/:id',
  [authMiddleware.requireAuth, accountsMiddleware.getOrgAccount],
  async (req, res) => {
    const userPositionLink = await UserPositionLink.findById(req.params.id);
    const ownerPosition = await Position.findById(userPositionLink.PositionID);
    if (res.locals.orgAccount._id.toString() !== ownerPosition.OrgID) {
      return res.sendStatus(403);
    }
    userPositionLink.Status = 'accepted';
    await userPositionLink.save();
    res.send({ success: true, message: 'User accepted' });
  }
);

// reject a applicant (org owner only)
router.post(
  '/rejectApplication/:id',
  [authMiddleware.requireAuth, accountsMiddleware.getOrgAccount],
  async (req, res) => {
    const userPositionLink = await UserPositionLink.findById(req.params.id);
    const ownerPosition = await Position.findById(userPositionLink.PositionID);
    if (res.locals.orgAccount._id.toString() !== ownerPosition.OrgID) {
      return res.sendStatus(403);
    }
    userPositionLink.Status = 'rejected';
    await userPositionLink.save();
    res.send({ success: true, message: 'User rejected' });
  }
);

// withdraw a applaction (ind owner only)
router.post(
  '/withdrawApplication/:id',
  [authMiddleware.requireAuth, accountsMiddleware.getIndAccount],
  async (req, res) => {
    const userPositionLink = await UserPositionLink.findById(req.params.id);
    if (res.locals.indAccount._id.toString() !== userPositionLink.UserID) {
      return res.sendStatus(403);
    }
    userPositionLink.Status = 'withdrawn';
    await userPositionLink.save();
    res.send({ success: true, message: 'User withdrawn' });
  }
);

// add a timeslot to a UserPositionLink (id = UserPositionLink id, timeslotID in body)
router.post(
  '/addTimeslot/:id',
  [
    authMiddleware.requireAuth,
    validationMiddleware.validateSchema(manageSchemas.addTimeslotSchema),
    accountsMiddleware.getIndAccount,
  ],
  async (req, res) => {
    const userPositionLink = await UserPositionLink.findById(req.params.id);
    // check ownership
    if (res.locals.indAccount._id.toString() !== userPositionLink.UserID) {
      return res.sendStatus(403);
    }
    var tempTimeslots = userPositionLink.TimeSlotIDs;
    if (tempTimeslots.find((slot) => slot == req.body.timeslotID)) {
      res.status(400);
      return res.json({
        success: false,
        message: 'Timeslot already exists on this position',
      });
    }
    tempTimeslots.push(req.body.timeslotID);
    userPositionLink.TimeSlotIDs = tempTimeslots;
    userPositionLink.save();
    res.status(200);
    res.send({ success: true, message: 'Timeslot added sucessfully' });
  }
);

// remove a timeslot from a UserPositionLink (id = UserPositionLink id, timeslotID in body)
router.post(
  '/removeTimeslot/:id',
  [
    authMiddleware.requireAuth,
    validationMiddleware.validateSchema(manageSchemas.removeTimeslotSchema),
    accountsMiddleware.getIndAccount,
  ],
  async (req, res) => {
    const userPositionLink = await UserPositionLink.findById(req.params.id);
    // check ownership
    if (res.locals.indAccount._id.toString() !== userPositionLink.UserID) {
      return res.sendStatus(403);
    }
    var tempTimeslots = userPositionLink.TimeSlotIDs;
    if (!tempTimeslots.find((slot) => slot == req.body.timeslotID)) {
      res.status(400);
      return res.json({
        success: false,
        message: 'Timeslot does not exist on this position',
      });
    }
    tempTimeslots = tempTimeslots.filter((e) => e !== req.body.timeslotID);
    userPositionLink.TimeSlotIDs = tempTimeslots;
    userPositionLink.save();
    res.status(200);
    res.send({ success: true, message: 'Timeslot removed sucessfully' });
  }
);

module.exports = router;
