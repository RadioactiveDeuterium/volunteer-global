const express = require('express');
const router = express.Router();
const Position = require('../models/Position');
const OrgAccount = require('../models/OrgAccount');
const authMiddleware = require('../middleware/authMiddleware');
const accountsMiddleware = require('../middleware/accountsMiddleware');
const positionsSchemas = require('../schemas/positionsSchemas');
const validationMiddleware = require('../middleware/validationMiddleware');

// create a new position (Org account only)
router.post(
  '/',
  [
    authMiddleware.requireAuth,
    validationMiddleware.validateSchema(positionsSchemas.createSchema),
    accountsMiddleware.getOrgAccount,
  ],
  async function (req, res) {
    const post = new Position({
      OrgID: res.locals.orgAccount._id.toString(),
      Title: req.body.title,
      Description: req.body.description,
      ScreeningQuestions: req.body.screeningQuestions,
    });
    await post.save();
    res.status(201);
    res.json({ success: true, message: 'Position created sucessfully' });
  }
);

// retrieve all positions
router.get('/', async function (req, res) {
  const positions = await Position.find({});
  res.status(200);
  res.send(positions);
});

// retrieve a position and owner details (public)
router.get('/:id', async function (req, res) {
  const position = await Position.findById(req.params.id);
  const org = await OrgAccount.findById(position.OrgID);
  res.status(200);
  res.json({ position, org });
});

// update a position (position owner only)
router.patch(
  '/:id',
  [
    authMiddleware.requireAuth,
    validationMiddleware.validateSchema(positionsSchemas.updateSchema),
    accountsMiddleware.getOrgAccount,
  ],
  async function (req, res) {
    const position = await Position.findById(req.params.id);
    // check ownership
    if (res.locals.orgAccount._id.toString() !== position.OrgID) {
      return res.sendStatus(403);
    }
    // update if ownership check passed
    if (req.body.title) {
      position.Title = req.body.title;
    }
    if (req.body.description) {
      position.Description = req.body.description;
    }
    if (req.body.screeningQuestions) {
      position.ScreeningQuestions = req.body.screeningQuestions;
    }
    await position.save();
    res.sendStatus(200);
  }
);

// delete a position (position owner only)
router.delete(
  '/:id',
  [
    authMiddleware.requireAuth,
    validationMiddleware.validateSchema(positionsSchemas.updateSchema),
    accountsMiddleware.getOrgAccount,
  ],
  async function (req, res) {
    const position = await Position.findById(req.params.id);
    // check ownership
    if (res.locals.orgAccount._id.toString() !== position.OrgID) {
      return res.sendStatus(403);
    }
    // delete if owner
    await Position.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  }
);

module.exports = router;
