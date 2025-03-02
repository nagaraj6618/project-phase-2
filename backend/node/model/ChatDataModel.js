const mongoose = require("mongoose");

const chatDataSchema = new mongoose.Schema({
   request:{
      type : String,
      required:true,
   },
   response:{
      score:{
         type:Number,  
      },
      suggest:{
         type:String
      },
      suggestion:{
         type:[]
      },
      voiceMessage:{
         type:String,
      },
      correctedSentence:{
         type:String
      }
   },
   chatHistoryId :{
      type:String,
   },
   userId : {
      type:String
   }

},{timestamps:true});

const chatDataModel = mongoose.model("chatData",chatDataSchema);

module.exports = chatDataModel;