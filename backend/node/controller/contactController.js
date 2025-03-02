const ContactSchema = require('../model/contactModel.js');
const nodemailer = require('nodemailer');
const { verifyUser, verifyToken } = require('./authVerify.js');
const userModel = require('../model/userModel.js');
let transporter = nodemailer.createTransport({
   service: 'Gmail',
   auth: {
       user: 'nagaraj516700@gmail.com', 
       pass: process.env.EMAIL_PASS_KEY || "lmys irrw wict zvcr"
   }
});
const getOneContactInfo = async(req,res) => {
   try{
   const contactData = await ContactSchema.findById(req.params.id)
   console.log(contactData);
   if(!contactData){
      res.status(404).json({data:[],message:"unsuccess"})
   }
   res.json({data:contactData , message:"success"});
   }
   catch (err){
      res.status(500).json({message:"unsuccess.."})
   }
}
const getAllContactInfo = async(req,res) => {
   const contactData = await ContactSchema.find({})
   console.log(contactData)
   try{
      res.status(200).json({data:contactData,message:"Retrived all the message",success:true});
   }
   catch(error){
      res.status(500).json({message:'unsuccess'});
   }
}

const postContactInfo = async(req,res) => {

   try{
      let {name,email,message} = req.body;
      let user = null;
      if(!name && !email && req.headers.authorization ){
         user = verifyToken(req.headers.authorization);
      }
      
      if(user){
         const userData = await userModel.findById(user.id);
         name = userData.name;
         email = userData.email;
      }
      const newPost = new ContactSchema({
         name,email,message
      })
      await newPost.save()
      let mailOptions = {
         from: 'NAGARAJ S <nagaraj516700@gmail.com>', 
         to: newPost.email, 
         subject: "Thanks for contacting! We'll get back to you soon.", 
         text: `Dear ${newPost.name},
      
      Thank you for reaching out! Your message has been received, and we will get back to you as soon as possible.
      
      Best regards,
      Grammar AI
      ` 
      };
      transporter.sendMail(mailOptions, async function(error, info){
         if (error) {
             console.error('Error sending email:', error);
             return res.status(500).json({message:'An Error occured',success:false,error:error});
         } else {
             console.log('Email sent:', info.response);
             return await res.status(201).json({message:'Message sent successfully',success:true,email:info.response});
         }
     });
      // res.status(201).json({message:'Message sent successfully',success:true,data:req.body});
   }
   catch(error){
      res.status(500).json({message:'Unsuccess',error:error});
   }
   
}

const deleteOneInfo = async(req,res) => {
   const id = req.params.id;
   try{
      
      const deletedContact = await ContactSchema.deleteOne({_id:id})
      res.status(200).json({success:true,message:"Contact deleted successfully", data: deletedContact});
   }
   catch(error){
      res.status(500).json({message:'Internal Server Error',success:false});
   }
}
const deleteAllContactData = async(req,res) => {
   try{
      const deleteAllContactData = await ContactSchema.deleteMany();
      if(deleteAllContactData){
         return res.status(200).json({message:"Contact history cleared",success:true,data:deleteAllContactData})
      }
      res.status(400).json({
         success:false,
         message:"Contact history has not cleared.."
      })
   }catch(error){
      res.status(500).json({message:'Internal Server Error',success:false});
   }
}
module.exports = {getAllContactInfo , postContactInfo ,getOneContactInfo,deleteOneInfo,deleteAllContactData};