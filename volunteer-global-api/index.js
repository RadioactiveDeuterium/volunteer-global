const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const orgAccountRoutes = require('./routes/OrgAccounts');
const positionRoutes = require('./routes/Positions');
const timeSlotRoutes = require('./routes/TimeSlots');
const indAccountRoutes = require('./routes/IndAccounts');
const manageRoutes = require('./routes/Manage');
const User = require('./models/User');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;

mongoose
  .connect(
    'mongodb+srv://root:nJpJrXRfMSVHOxj7@volunteer-global.ffymckl.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true }
  )
  .then(() => {
    // init express
    const app = express();
    app.use(express.json());

    // setup cors
    const corsOptions = {
      optionsSuccessStatus: 200,
      credentials: true,
      origin: 'http://localhost:3000',
    };
    app.use(cors(corsOptions));

    // init auth
    app.use(
      session({ secret: 'keyboard cat', resave: true, saveUninitialized: true })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    passport.use(new LocalStrategy(User.authenticate()));

    // init routes
    app.use('/api/accounts/organization', orgAccountRoutes);
    app.use('/api/accounts/individual', indAccountRoutes);
    app.use('/api/positions', positionRoutes);
    app.use('/api/timeSlots', timeSlotRoutes);
    app.use('/api/manage', manageRoutes);

    app.listen(5000, () => {
      console.log('Server has started!');
    });
  });
