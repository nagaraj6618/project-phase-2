const express = require('express');
const {getAllContactInfo,postContactInfo , getOneContactInfo,deleteOneInfo, deleteAllContactData} = require("../controller/contactController.js")
const {verifyAdmin} = require("../controller/authVerify.js");
const router = express.Router();

router.get('/',verifyAdmin,getAllContactInfo);
router.post('/',postContactInfo);

router.delete("/",verifyAdmin,deleteAllContactData);
router.get('/:id',getOneContactInfo)
router.delete('/:id',verifyAdmin,deleteOneInfo)

module.exports = router;