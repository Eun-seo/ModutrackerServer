const express = require("express");
const router = express.Router();

const UserController = require("../controller/user.controller");

router.get("/", UserController.findAll);
router.post("/", UserController.signUp);
router.post("/member", UserController.isMember);
router.get("/info", UserController.info);

module.exports = router;

