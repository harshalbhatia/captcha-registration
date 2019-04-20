const express = require("express");
const router = express.Router();
const controller = require("../controllers");

router.get("/", controller.home);

router.get("/registration", controller.checkCaptcha, controller.registerForm);
router.post(
  "/registration",
  controller.validateCaptcha,
  controller.validateRegister,
  controller.register,
  controller.logIP
);

module.exports = router;
