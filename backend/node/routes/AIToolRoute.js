const express = require("express");
const { getALLChatOfUser, createNewChat, deleteChat } = require("../ML-Model/moreAitoolController");
const { verifyUser } = require("../controller/authVerify");
const router = express.Router();

router.route("/").get(verifyUser,getALLChatOfUser).post(verifyUser,createNewChat);
router.route("/:id").delete(verifyUser,deleteChat);
module.exports = router;