const mongoose = require("mongoose");
const User = mongoose.model("User");
const IpAddress = mongoose.model("IpAddress");
const promisify = require("es6-promisify");

exports.home = (req, res) => {
  res.send("You might want to go to /register maybe");
};

exports.checkCaptcha = async (req, res, next) => {
  // TODO
  next();
};

exports.registerForm = (req, res) => {
  res.render("registration");
};

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody("name");
  req.checkBody("name", "You must supply a name!").notEmpty();
  req.checkBody("email", "That Email is not valid!").isEmail();
  req.sanitizeBody("email").normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody("password", "Password Is Blank!").notEmpty();
  req.checkBody("password-confirm", "Confirmed Password Is blank!").notEmpty();
  req
    .checkBody("password-confirm", "Passwords don't match.")
    .equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash("error", errors.map(err => err.msg));
    res.render("registration", { flashes: req.flash() });
    return; // stop running
  }
  next();
};

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next();
};

exports.logIP = async (req, res, next) => {
  await IpAddress.findOneAndUpdate(
    {
      ipAddress: req.ip
    },
    {
      $push: { logins: new Date() }
    },
    { 'new': true, 'runValidators': true, 'upsert': true },
    (err, res) => {
      console.log("ERRAR", err, res);
    }
  ).exec();
  next();
};
