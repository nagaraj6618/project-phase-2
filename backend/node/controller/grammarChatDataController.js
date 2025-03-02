const grammerChatDataModel = require("../model/ChatDataModel");
const axios = require("axios");
const { verifyToken } = require("./authVerify");
const grammerChatHistoryModel = require("../model/chatHistoryModel");
const { checkGrammar } = require("../ML-Model/model");

const getAllGrammarChatData = async(req,res) => {
   try{
      const user = await verifyToken(req.headers.authorization);
      console.log(user)
      const allChatData = await grammerChatDataModel.find({
         userId:user.id
      });
      if(allChatData.length <= 0){
         return res.status(404).json({
            message:"No Record Found",
            success:false,
         });
      }
      return res.status(200).json({
         message: "Successfully retrived all data",
         success: true,
         data : allChatData,
      });
   }catch(error){
      return res.status(500).json({
         message:"Internal Server Error",
         error:error,
         success:false,
      })
   }
}

const getAllGrammarChatDataByChatHistoryID = async(req,res) => {
   try{
      const user = await verifyToken(req.headers.authorization);
      const {id} = req.params || "";
      const chatHistoryId = id;
      console.log("Chat History Id",chatHistoryId)
      if(!chatHistoryId){
         return res.status(400).json({
            message: "Please send the chat history ID..",
            success:false,
         });
      }
      const allChatDataOfHistory = await grammerChatDataModel.find({
         chatHistoryId,
         userId:user.id, 
      });
      if(allChatDataOfHistory.lenght <= 0){
         return res.status(404).json({
            message: "No chat found in the history..",
            success:false,
         });
      }
      return res.status(200).json({
         success:true,
         data:allChatDataOfHistory,
         message: "Successfully retrived all the chat data of given history.."
      });
   }catch(error){
      return res.status(500).json({
         message:"Internal Server Error",
         error:error,
         success:false,
      })
   }
}

const createNewGrammarChatData = async(req,res) => {
   try{
      let responseData = null;
      const user = await verifyToken(req.headers.authorization);
      let {message,chatHistoryId} = req.body
      const prod_model_be_url = process.env.prod_model_be_url || ""
      const model_be_url =  `${prod_model_be_url}/calculate_score` 
      const response =  await axios.post(model_be_url,{
         text : message
      });
      const geminiResponse = await checkGrammar(message);
      if(chatHistoryId && chatHistoryId === "new"){
         // console.log(chatHistoryId)
         const user = await verifyToken(req.headers.authorization);
         const newChatHistory = new grammerChatHistoryModel({
         chatHistoryName:message,
         totalChatData:0,
         chatDataIds:[],
         userId:user.id
      })
      await newChatHistory.save();
      chatHistoryId = newChatHistory._id;
      }

      // if(response.data?.score === 100 && (!response.data?.suggest || response.data?.suggest === "This sentence is in active voice.")){
      //    responseData = {...geminiResponse,chatHistoryId};
      // }
      // else{
      //    responseData = {
      //       score:geminiResponse.score,
      //       suggest:response.data?.suggest,
      //       suggestion:[response.data?.suggest,...geminiResponse.suggestion],
      //       voiceMessage:geminiResponse.voiceMessage,
      //       chatHistoryId
      //    }
      // }
      // console.log("Hiiiiiiiiiiiiiiiiii",getResponseData(response,geminiResponse))
       responseData = {...getModelResponseData(response,geminiResponse),chatHistoryId};
      const newChat = new grammerChatDataModel({
         userId:user.id,
         request : message,
         response:{
            score : responseData.score,
            suggest : responseData.suggest,
            suggestion : responseData.suggestion,
            voiceMessage : responseData.voiceMessage,
            correctedSentence : responseData.correctedSentence
         },
         chatHistoryId
      })
      console.log(newChat)
      await newChat.save();
      let getChatHistoryData = await grammerChatHistoryModel.find({_id:chatHistoryId,userId:user.id});
      if(getChatHistoryData.length <= 0){
         return res.status(404).json({
            message:"No Chat history Found..",
            success:false
         });
      }
      getChatHistoryData = getChatHistoryData[0];
      if (getChatHistoryData) {
         getChatHistoryData.chatDataIds.push(String(newChat._id));
         await getChatHistoryData.save();
         console.log("Updated Chat History:", getChatHistoryData);
      } else {
         console.log("Chat history not found.");
      }
      // const responseData = {...response.data,chatHistoryId}
      return res.status(200).json({
         message:"Successfully new chat created.",
         data: newChat,
      })
   }catch(error){
      return res.status(500).json({
         message:"Internal Server Error",
         error:error,
         success:false,
      })
   }
}
const updateGrammarChatDataByChatID = async(req,res) => {
   try{
      let responseData = null;
      const user = await verifyToken(req.headers.authorization);
      const {id} = req.params;
      const {message} = req.body;
      const prod_model_be_url = process.env.prod_model_be_url || ""
      const model_be_url =  `${prod_model_be_url}/calculate_score` 
      const response =  await axios.post(model_be_url,{
         text : message
      });
      const geminiResponse = await checkGrammar(message);
      responseData = getModelResponseData(response,geminiResponse);
      let chatData = await grammerChatDataModel.find({
         _id:id,
         userId:user.id,
      });
      if(chatData.length <= 0){
         return res.status(404).json({
            message:"No Chat data Found..",
            success:false
         });
      }
      chatData = chatData[0];
      chatData.request = message;
      chatData.response = responseData;
      await chatData.save()
      return res.status(200).json({
         success:true,
         message : "Successfully chat updated.",
         data : chatData,
      })


   }catch(error){
      return res.status(500).json({
         message:"Internal Server Error",
         error:error,
         success:false,
      })
   }
}

function getModelResponseData(response,geminiResponse){
   try{
      let responseData = null;
      console.log(response.data)
   if(response.data?.score === 100 && (!response.data?.suggest || response.data?.suggest === "This sentence is in active voice.")){
      responseData = {...geminiResponse,suggest:""};
   }
   else if(response.data?.score !== 100 && geminiResponse.score === 100){
      responseData = {
         score:geminiResponse.score,
         suggest:"",
         suggestion:geminiResponse.suggestion,
         voiceMessage:geminiResponse.voiceMessage,
         correctedSentence:geminiResponse.correctedSentence
      }
   }
   else{
      responseData = {
         score:geminiResponse.score,
         suggest:response.data?.suggest,
         suggestion:[response.data?.suggest,...geminiResponse.suggestion],
         voiceMessage:geminiResponse.voiceMessage,
         correctedSentence:geminiResponse.correctedSentence
      }
   }
   return responseData
   }
   catch(error){
      console.log("Error",error)
   }
   
}
module.exports = {getAllGrammarChatData,getAllGrammarChatDataByChatHistoryID,createNewGrammarChatData,updateGrammarChatDataByChatID};