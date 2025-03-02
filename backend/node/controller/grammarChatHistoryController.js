const grammarChatHistoryModel = require("../model/chatHistoryModel");
const grammarChatDataModel = require("../model/ChatDataModel");
const { verifyToken } = require("./authVerify");

const getAllGrammarChatHistory = async(req,res) => {

   try{

      const user = await verifyToken(req.headers.authorization);
      const allChatHistoryData = await grammarChatHistoryModel.find({
         userId:user.id
      });
      if(allChatHistoryData.length<=0){
         return res.status(404).json({
            success:false,
            message:"No chat history found..",
            data: allChatHistoryData
         })
      }
      return res.status(200).json({
         success:true,
         message:"Successfully retrived all chat history..",
         data:allChatHistoryData
      });
   }
   catch(error){
      return res.status(500).json({
         message:"Internal Server Error",
         error : error,
         success:false
      })
   }
}

const getGrammarChatHistoryById = async(req,res) => {

   try{
      const id = req.params.id || "";
      const user = await verifyToken(req.headers.authorization);
      const chatHistoryData = await grammarChatHistoryModel.find({_id:id,userId:user.id});
      if(chatHistoryData.length<=0){
         return res.status(404).json({
            message:"Requesting Chat history not found.",
            success:false
         });
      }
      return res.status(200).json({
         message:"Successfully Retrived the chat history",
         success:true,
         data : chatHistoryData[0]
      });
   }
   catch(error){
      return res.status(500).json({
         message:"Internal Server Error",
         error : error,
         success:false
      })
   }
}

const createNewGrammarChatHistory = async(req,res) => {

   try{
      const user = await verifyToken(req.headers.authorization);
      const newChatHistory = new grammarChatHistoryModel({
         chatHistoryName:"",
         totalChatData:0,
         chatDataIds:[],
         userId:user.id
      })
      await newChatHistory.save();
      return res.status(201).json({
         success:true,
         message:"Successfully created new chat",
         data : newChatHistory
      });
   }
   catch(error){
      return res.status(500).json({
         message:"Internal Server Error",
         error : error,
         success:false
      })
   }
}
const deleteGrammarChatHistoryById = async (req, res) => {
   try {
       const user = await verifyToken(req.headers.authorization);
       const id = req.params.id || "";

       // Delete chat history
       const deleteData = await grammarChatHistoryModel.deleteMany({
           _id: id,
           userId: user.id
       });
       // Delete associated chat data
       const deleteChatData = await grammarChatDataModel.deleteMany({
           chatHistoryId: id,
           userId: user.id
       });

       if (deleteData.deletedCount === 0 && deleteChatData.deletedCount === 0) {
           return res.status(404).json({
               success: false,
               message: "No matching records found to delete."
           });
       }
       return res.status(200).json({
           success: true,
           message: "Successfully deleted the chat history and related data.",
       });
   } catch (error) {
       return res.status(500).json({
           success: false,
           message: "Internal Server Error",
           error: error.message
       });
   }
};


const deleteAllChatHistoryOfUser = async(req,res) => {
   try{
      const user = await verifyToken(req.headers.authorization);
      const deleteData = await grammarChatHistoryModel.deleteMany({
         userId: user.id
      });
      if(!deleteData){
         return res.status(404).json({
            success:false,
            message:"No record found to delete",
         })
      }
      return res.status(200).json({
         success: true,
         message: "Successfully deleted the all history",
      });
   }catch(error){
      return res.status(500).json({
         message:"Internal Server Error",
         error : error,
         success:false
      });
   }
}

module.exports = {
   getAllGrammarChatHistory
   ,getGrammarChatHistoryById
   ,createNewGrammarChatHistory
   ,deleteGrammarChatHistoryById
   ,deleteAllChatHistoryOfUser};