import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config({ path: "variables.env" });
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
import { getCollection } from "./lib/db-connection";
import expressSession from "express-session";
const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');

// The local strategy require a `verify` function which receives the credentials
passport.use(new LocalStrategy(async function(username, password, cb) {
  try {
    let usersCollection = await getCollection("users");
    let currentUser = await usersCollection.findOne({ username });

    if (!currentUser) { 
      cb(null, false);
      return;
    }

    let passwordMatches = await bcrypt.compare(password, currentUser.hash);

    if (!passwordMatches) {
      cb(null, false);
      return;
    }

    cb(null, currentUser);
    return;
  } catch (err) {
    console.error("Passport db error", err);
  }
}));

passport.serializeUser(function(currentUser, cb) {
  cb(null, currentUser._id);
});

passport.deserializeUser(async function(id, cb) {
  let usersCollection = await getCollection("users");
  let currentUser = await usersCollection.findOne({ _id: ObjectID(id) });

  cb(null, currentUser);
});


const app = express();

import { initRenderedRoutes } from "./lib/init-rendered-routes";
import { initApiRoutes } from "./lib/init-api-routes";

// configue app
app.use(expressSession({ 
  secret: 'keyboard cat', 
  resave: false, 
  saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

initRenderedRoutes({app});
initApiRoutes({app});

app.post('/signup', async function(req, res) {
  let usersCollection = await getCollection("users");
  let hash = await bcrypt.hash(req.body.password, 14);
  let result = await usersCollection.insertOne({username: req.body.username, hash: hash});
  res.redirect('/');
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
  res.redirect('/');
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)

  if (process.send) {
    process.send('online');
  }
})










