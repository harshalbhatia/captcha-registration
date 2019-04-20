const mongoose = require("mongoose");
const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const routes = require("./routes/index");
const flash = require("connect-flash");
require("./handlers/passport");

app.use(
  session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

// flash middleware
app.use(flash());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Validation helpers
app.use(expressValidator());
// handle logins
app.use(passport.initialize());
app.use(passport.session());

// pass flashes
app.use((req, res, next) => {
  res.locals.flashes = req.flash();
  res.locals.siteKey = process.env.RECAPTCHA_SITEKEY;
  next();
});

app.set("view engine", "pug");

app.use("/", routes);

module.exports = app;
