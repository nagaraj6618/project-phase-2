const express = require("express");
const { getAllGrammarChatHistory, getGrammarChatHistoryById, createNewGrammarChatHistory, deleteGrammarChatHistoryById, deleteAllChatHistoryOfUser } = require("../controller/grammarChatHistoryController");
const { verifyUser } = require("../controller/authVerify");
const router = express.Router();


router.route("/")
.get(verifyUser,getAllGrammarChatHistory)
.post(verifyUser,createNewGrammarChatHistory)
.delete(verifyUser,deleteAllChatHistoryOfUser);

router.route("/:id")
.get(verifyUser,getGrammarChatHistoryById)
.delete(verifyUser,deleteGrammarChatHistoryById);

module.exports = router;