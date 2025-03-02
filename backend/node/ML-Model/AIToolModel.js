const mongoose = require("mongoose");

const AITooLSchema = new mongoose.Schema({
   request :{
     type:String, 
   },
   response:{
      content:{
         type:String,
      },
      responseOf:{
         type:String,
      }
   },
   userId:{
      type:String
   }
},{timestamps:true});

const AITooLModel = mongoose.model('aichats',AITooLSchema);

module.exports = AITooLModel;