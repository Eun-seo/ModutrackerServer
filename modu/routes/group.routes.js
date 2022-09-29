const express = require("express");
const router = express.Router();

const GroupController = require("../controller/group.controller");

router.get("/", GroupController.findGroup);
router.post("/", GroupController.addGroup);
router.patch("/join", GroupController.joinGroup);

module.exports = router;