const mongoose = require("mongoose");
const User = mongoose.model("User");
const IpAddress = mongoose.model("IpAddress");
const promisify = require("es6-promisify");
var reCAPTCHA = require("recaptcha2");

var recaptcha = new reCAPTCHA({
  siteKey: process.env.RECAPTCHA_SITEKEY,
  secretKey: process.env.RECAPTCHA_SECRETKEY
});

const captchaEligible = async req => {
  const thisUser = await IpAddress.findOne(
    { ipAddress: req.ip },
    "logins",
    (err, res) => {
      err && console.log("err", err, res);
    }
  );
  return !!(thisUser && thisUser.loginsToday >= 3);
};

exports.home = (req, res) => {
  res.send("You might want to go to /registration maybe");
};

exports.checkCaptcha = async (req, res, next) => {
  const showCaptcha = await captchaEligible(req);
  res.locals.checkCaptcha = !!showCaptcha;
  next();
};

exports.registerForm = (req, res) => {
  res.render("registration");
};

exports.validateCaptcha = async (req, res, next) => {
  const checkCaptcha = await captchaEligible(req);
  checkCaptcha &&
    recaptcha
      .validateRequest(req)
      .then(function() {
        next();
      })
      .catch(async errorCodes => {
        // invalid
        const checkCaptcha = await captchaEligible(req);
        req.flash("error", "Captcha is not valid");
        res.render("registration", {
          flashes: req.flash(),
          checkCaptcha: checkCaptcha
        });
        return; // stop running
      });
  next();
};

exports.validateRegister = async (req, res, next) => {
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
    const checkCaptcha = await captchaEligible(req);
    req.flash("error", errors.map(err => err.msg));
    res.render("registration", {
      flashes: req.flash(),
      checkCaptcha: checkCaptcha
    });
    return; // stop running
  }
  next();
};

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  const register = promisify(User.register, User);
  return await register(user, req.body.password)
    .then(() => {
      next();
    })
    .catch(async err => {
      const checkCaptcha = await captchaEligible(req);
      req.flash("error", err);
      res.render("registration", {
        flashes: req.flash(),
        checkCaptcha: checkCaptcha
      });
      return;
    });
};

exports.logIP = async (req, res, next) => {
  await IpAddress.findOneAndUpdate(
    {
      ipAddress: req.ip
    },
    {
      $push: { logins: new Date() }
    },
    { new: true, runValidators: true, upsert: true },
    (err, res) => {
      err && console.log("err", err, res);
    }
  ).exec();
  const checkCaptcha = await captchaEligible(req);
  req.flash("success", "Successfully registered.");
  res.render("registration", {
    flashes: req.flash(),
    checkCaptcha: checkCaptcha
  });
};
