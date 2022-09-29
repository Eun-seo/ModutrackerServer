const express = require("express");
const router = express.Router();

const DiaryController = require("../controller/diary.controller");

router.post("/", DiaryController.addDiary);
router.post("/inquire", DiaryController.inquire);
router.get("/calendar", DiaryController.calendar);
router.get("/check", DiaryController.checkDiary);

module.exports = router;