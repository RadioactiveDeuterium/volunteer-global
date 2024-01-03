const express = require('express');
const router = express.Router();
const Position = require('../models/Position');
const OrgAccount = require('../models/OrgAccount');
const IndAccount = require('../models/IndAccount');
const UserPositionLink = require('../models/UserPositionLink');
const authMiddleware = require('../middleware/authMiddleware');
const accountsMiddleware = require('../middleware/accountsMiddleware');
const positionsSchemas = require('../schemas/positionsSchemas');
const validationMiddleware = require('../middleware/validationMiddleware');

// get applications (ind only)
router.get(
  '/userApplications',
  [authMiddleware.requireAuth, accountsMiddleware.getIndAccount],
  async function (req, res) {
    const applications = await UserPositionLink.find({
      UserID: res.locals.indAccount._id.toString(),
    });
    var result = [];
    for (app of applications) {
      const position = await Position.findById(app.PositionID);
      result.push({
        ...app._doc,
        position,
      });
    }
    res.status(200);
    res.json({ success: true, applications: result });
  }
);

// get pending applications for a position (org owner only)
router.get(
  '/pendingApplications/:id',
  [authMiddleware.requireAuth, accountsMiddleware.getOrgAccount],
  async function (req, res) {
    const position = await Position.findById(req.params.id);
    if (position.OrgID !== res.locals.orgAccount._id.toString()) {
      return res.status(403);
    }
    const applications = await UserPositionLink.find({
      PositionID: req.params.id,
      Status: 'pending',
    });
    var result = [];
    for (app of applications) {
      const user = await IndAccount.findById(app.UserID);
      result.push({
        ...user._doc,
        ...app._doc,
      });
    }
    res.status(200);
    return res.json(result);
  }
);

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
  var result = [];
  for (pos of positions) {
    const org = await OrgAccount.findById(pos.OrgID);
    result.push({
      ...pos._doc,
      org,
    });
  }
  res.status(200);
  res.send(result);
});

// retrieve positions for current org
router.get(
  '/byLoggedOrg',
  [authMiddleware.requireAuth, accountsMiddleware.getOrgAccount],
  async function (req, res) {
    const positions = await Position.find({
      OrgID: res.locals.orgAccount._id.toString(),
    });
    var result = [];
    for (pos of positions) {
      // check applicant data
      var hasApplications = false;
      if (!hasApplications) {
        const applications = await UserPositionLink.find({
          PositionID: pos._id.toString(),
        });
        for (app of applications) {
          if (app.Status === 'pending') hasApplications = true;
        }
      }
      result.push({
        ...pos._doc,
        hasApplications: hasApplications,
      });
    }
    res.status(200);
    res.send(result);
  }
);

// retrieve a position and owner details (public)
router.get('/:id', async function (req, res) {
  const position = await Position.findById(req.params.id);
  const org = await OrgAccount.findById(position.OrgID);
  // get volunteer details
  const userLinks = await UserPositionLink.find({
    PositionID: req.params.id,
    Status: 'accepted',
  });
  var volunteerDetails = [];
  for (link of userLinks) {
    const user = await IndAccount.findById(link.UserID);
    volunteerDetails.push({
      ...link._doc,
      user: user._doc,
    });
  }
  res.status(200);
  res.json({ position, org, volunteerDetails });
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
  [authMiddleware.requireAuth, accountsMiddleware.getOrgAccount],
  async function (req, res) {
    const position = await Position.findById(req.params.id);
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
    // delete if owner
    await Position.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  }
);

// get applications (position owner only)
router.get(
  '/applications/:id',
  [authMiddleware.requireAuth, accountsMiddleware.getOrgAccount],
  async function (req, res) {
    const position = await Position.findById(req.params.id);
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
    // retrieve applications
    const UserPositionLinks = await UserPositionLink.find({
      PositionID: req.params.id,
    });
    // return results
    if (UserPositionLinks.length == 0) {
      res.status(401);
      res.json({
        success: false,
        message: 'No applications found for this position ID',
      });
      return;
    }
    var applications = [];
    for (link of UserPositionLinks) {
      const user = await IndAccount.findById(link.UserID);
      const item = {
        user: user,
        ...link._doc,
      };
      applications.push(item);
    }
    res.status(200);
    res.json({ success: true, applications: applications });
  }
);

module.exports = router;
