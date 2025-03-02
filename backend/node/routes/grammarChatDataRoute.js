const express = require("express");
const { getAllGrammarChatData, createNewGrammarChatData, getAllGrammarChatDataByChatHistoryID, updateGrammarChatDataByChatID } = require("../controller/grammarChatDataController");
const { verifyUser } = require("../controller/authVerify");
const router = express.Router();

router.route("/")
.get(verifyUser,getAllGrammarChatData)
.post(verifyUser,createNewGrammarChatData)

router.route("/:id").get(verifyUser,getAllGrammarChatDataByChatHistoryID)
.put(verifyUser,updateGrammarChatDataByChatID);

module.exports = router;