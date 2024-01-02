const express = require('express');
const router = express.Router();
const Position = require('../models/Position');
const OrgAccount = require('../models/OrgAccount');
const authMiddleware = require('../middleware/authMiddleware');
const accountsMiddleware = require('../middleware/accountsMiddleware');
const timeSlotsSchemas = require('../schemas/timeSlotSchemas');
const validationMiddleware = require('../middleware/validationMiddleware');
const TimeSlot = require('../models/TimeSlot');

// create a new time slot (org account only, position owner only)
router.post(
  '/',
  [
    authMiddleware.requireAuth,
    validationMiddleware.validateSchema(timeSlotsSchemas.createSchema),
    accountsMiddleware.getOrgAccount,
  ],
  async function (req, res) {
    // get parent position and check ownership
    const position = await Position.findById(req.body.positionID);
    // if not found
    if (!position) {
      res.status(404);
      res.json({ success: false, message: 'Position not found' });
      return;
    }
    if (res.locals.orgAccount._id.toString() !== position.OrgID) {
      return res.sendStatus(403);
    }
    // create object if passed ownership check
    const timeSlot = new TimeSlot({
      PositionID: req.body.positionID,
      DateTime: req.body.dateTime,
      Length: req.body.length,
    });
    await timeSlot.save();
    res.status(201);
    res.json({ success: true, message: 'Time slot created sucessfully' });
  }
);

// get time slots for a given position
router.get('/byPosition/:id', async function (req, res) {
  const timeSlots = await TimeSlot.find({ PositionID: req.params.id });
  res.json({ timeSlots });
});

// get time slot and assosiated data
router.get('/:id', async function (req, res) {
  const timeSlot = await TimeSlot.findById(req.params.id);
  const position = await Position.findById(timeSlot.PositionID);
  const org = await OrgAccount.findById(position.OrgID);
  res.status(200);
  res.json({ timeSlot, position, org });
});

// update timeslot (owner only)
router.patch(
  '/:id',
  [
    authMiddleware.requireAuth,
    validationMiddleware.validateSchema(timeSlotsSchemas.updateSchema),
    accountsMiddleware.getOrgAccount,
  ],
  async function (req, res) {
    const timeSlot = await TimeSlot.findById(req.params.id);
    const position = await Position.findById(timeSlot.PositionID);
    // if not found
    if (!position) {
      res.status(404);
      res.json({ success: false, message: 'Position not found' });
      return;
    }
    // check ownership
    if (res.locals.orgAccount._id.toString() !== position.OrgID) {
      return res.sendStatus(403);
    }
    // update if ownership check passes
    if (req.body.dateTime) {
      timeSlot.DateTime = req.body.dateTime;
    }
    if (req.body.length) {
      timeSlot.Length = req.body.length;
    }
    await timeSlot.save();
    res.sendStatus(200);
  }
);

// delete timeslot (owner only)
router.delete(
  '/:id',
  [authMiddleware.requireAuth, accountsMiddleware.getOrgAccount],
  async function (req, res) {
    const timeSlot = await TimeSlot.findById(req.params.id);
    const position = await Position.findById(timeSlot.PositionID);
    // check ownership
    if (res.locals.orgAccount._id.toString() !== position.OrgID) {
      return res.sendStatus(403);
    }
    // delete if ownership check passes
    await TimeSlot.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  }
);

module.exports = router;
