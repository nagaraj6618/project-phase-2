const mongoose = require("mongoose");

const chatHistorySchema = new mongoose.Schema({
   chatHistoryName : {
      type:String,
   },
   chatDataIds :{
      type: [],
   },
   totalChatData :{
      type:Number,
      required:true,
      default:0
   },
   userId : {
      type:String
   }
},
{timestamps:true}
);

const chatHistoryModel = mongoose.model("chatHistory",chatHistorySchema);

module.exports = chatHistoryModel;