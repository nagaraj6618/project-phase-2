const bcrypt = require('bcrypt');
const userModelSchema = require('../model/userModel');
const OTPModel = require('../model/OTPModel');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const {verifyToken} = require('./authVerify')
const transporter = nodemailer.createTransport({
   service: 'Gmail',
   auth: {
      user: 'nagaraj516700@gmail.com',
      pass: process.env.EMAIL_PASS_KEY || "lmys irrw wict zvcr"
   }
})


const salt = bcrypt.genSaltSync(10);

const registerController = async(req,res) => {
   try{
      const {name,userName,password,email} = req.body;

      //check email is valid
      // const isvalid = await isEmailValid(email);
      // if(!isvalid){
      //    return res.status(404).json({success:false,message:'Email is not valid'});
      // }

      //check user is already exists
      const isAlreadyUser = await userModelSchema.find({email:email});
      if(isAlreadyUser.length>0){
         return res.status(400).json({success:false,message:"User Already exist"});
      }

      // const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password,salt);

      const userData = {
         email:email,
         password:hashPassword,
         userName:userName,
         name:name,
         // createdAt: new Date(Date.now())
      }

      const newUser = new userModelSchema(userData);
      await newUser.save();
      console.log(newUser);
      await sendOTPVerificationEmail(newUser,salt,res);
      // res.status(200).json({success:true,message:'Registered Successfully',data:newUser});

   }
   catch(error){
      res.status(500).json({success:false,message:'Internal Server Error',error:error});
   }
   
}

const loginController = async(req,res) => {

   console.log(req.body)
   const userByName = await userModelSchema.findOne({ userName: req.body.emailorusername });
   const userByEmail = await userModelSchema.findOne({ email: req.body.emailorusername });
   let user = userByEmail || userByName;
   if (!user) {
      console.log("Accound doesn't exist");
      return res.status(400).json({ success:false,message: "Account doesn't Exist" })
   }
   // console.log(user)
   const userData = {
      userName: user.userName,
      name: user.name,
      role:user.role,
      id:user._id,
   }
   const correctPassword = await bcrypt.compareSync(req.body.password, user.password);
   if (!correctPassword) {
      return res.status(400).json({ success:false,message: "Invalid Password." });
   }
   const token = jwt.sign(
      {
         id: user._id,
         role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
         expiresIn: "1d"
      }
   );
   const deleteUserOTP = await OTPModel.deleteMany({userId:user._id});
   console.log("User OTP",deleteUserOTP)
   await sendOTPVerificationEmail(user,salt,res);
   // res.cookie('accesstoken', token, {
   //    httpOnly: true,
   //    secure: true,
   //    sameSite: 'None',
   //    expires: new Date(Date.now() + 600000),
   //    partitioned: 'None'
   // }).status(200).json({ success:true,message: "Please complete Two-Factor Authentication (TFA) by entering the OTP sent to your email.", data: userData});


}



const OTPVerification = async(req,res) => {
   try{
      console.log(req.body);
      const id = req.params.id;
      const {otp,password,type} = req.body;
      console.log("otp:",otp)
      const userOTPVerificationRecord = await OTPModel.findOne({ userId: id })
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order
    .limit(1);
      if(!userOTPVerificationRecord){
         return res.status(400).json({success:false,message:"OTP doesn't exist"});
      }
      const {expiresAt} = userOTPVerificationRecord;
      const hashOtp = userOTPVerificationRecord.otp;
      if(expiresAt < Date.now()){
         await OTPModel.deleteMany({userId:id});
         return res.status(200).json({message:'Code expired',success:false});
      }
      else{
         const isOtpValid = await bcrypt.compareSync(otp,hashOtp);
         if(!isOtpValid){
            return res.status(400).json({success:false,message:'OTP is not valid'});
         }
         // if(type && type === "login"){
            // console.log("Login OTP")
            const userData = await userModelSchema.findById(id);
            console.log(userData)
            const token = jwt.sign(
               {
                  id: userData._id,
                  role: userData.role,
                  userName: userData.userName
               },
               process.env.JWT_SECRET_KEY,
               {
                  expiresIn: "1d"
               }
            );
            if(type && type === "create new password"){
               return res.status(200).json({
                  success:true,
                  message:"OTP verified successfully"
               })
            }
            if(password){
               const hashPassword = bcrypt.hashSync(password,salt);
               await userModelSchema.updateOne({_id:id},{verified:true,password:hashPassword});
            }
            const updateUserData = await userModelSchema.updateOne({_id:id},{verified:true});
            // await OTPModel.deleteMany({userId:id});
            return res.cookie('accesstoken', token, {
               httpOnly: true,
               secure: true,
               sameSite: 'None',
               expires: new Date(Date.now() + 600000),
               partitioned: 'None'
            }).status(200).json({ success:true,message: "Two-Factor Authentication (TFA) Completed via OTP", token:token});
         
         // }
         // const updateUserData = await userModelSchema.updateOne({_id:id},{verified:true});
         // await OTPModel.deleteMany({userId:id});
         // return res.status(200).json({success:true,message:'OTP verification Successfull',data:updateUserData})
      }
      
   }
   catch(error){
      res.status(500).json({success:false,error:error,message:'Internal Server Error'})
   }
   

}


async function sendOTPVerificationEmail({_id,email},salt,res){

   try{
      console.log(_id,email)
      const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
      const OTPMailOption = {
         from: `nagaraj516700@gmail.com`,
         to: email,
         subject: "Your OTP Code for Verification",
         html: `
             <p>Dear User,</p>
            <p>Thank you for registering with Grammar.AI.</p>
            <p>Your OTP code for verification is:</p>
            <h2>${otp}</h2>
            <p>Please enter this code to complete your verification process. The code is valid for 10 minutes.</p>
            <p>If you did not request this code, please ignore this email.</p>
            <p>Best regards,<br>Grammar AI</p>
         `
     };
     const hashOtp = bcrypt.hashSync(otp,salt);
     const newOTPVerfication = new OTPModel({
      otp:hashOtp,
      userId:_id,
      createdAt: new Date(Date.now()),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
     })
     console.log(newOTPVerfication)
     await newOTPVerfication.save();
     await transporter.sendMail(OTPMailOption, function (error, info) {
      if (error) {
         console.error('Error sending email:', error);
         return res.status(400).json({success:false,message:error})
      } else {
         console.log('Email sent:', info.response);
         return res.status(200).json({success:true,message:'Verification otp email sent',data:{
            id:_id,
            email:email
         }
      })
      }
   });
     console.log(newOTPVerfication);
   }
catch(error){
   return res.status(500).json({success:false,message:error.message});
}
}

async function resetPassword(req, res) {
   console.log(req.body);
   console.log(req.headers.token)
   try {
      const data = verifyToken(req.headers.authorization);
      console.log(data)
      if (data) {
         const salt = bcrypt.genSaltSync(10);
         const hash = bcrypt.hashSync(req.body.newpassword, salt)
         console.log(hash);
         const userData = await userModelSchema.findById(data.id);
         if(userData){
            const correctPassword = await bcrypt.compareSync(req.body.oldpassword, userData.password);
            if(!correctPassword){
               return res.status(400).json({success:false,message:'Old password is incorrect'});
            }
            const updatePassword = await userModelSchema.findByIdAndUpdate(data.id,{password:hash},{new:true})
         console.log(updatePassword)
         return res.status(200).json({success:true, message: 'Updated Successfully!',data:updatePassword });
         }
         return res.status(200).json({success:false,message:'User must login'});
      }
      res.status(400).json({ success:false,message: 'Not Updated..' })
   }
   catch (error) {
      res.status(500).json({ success:false,message: 'Internal Server error' })
   }
}

const getUserDetail = async(req,res) => {
   try{
      
      const user = await verifyToken(req.headers.authorization);
      const userData = await userModelSchema.findById(user.id);
      if(userData.length<=0){
         return res.status(404).json({success:false,message:"User doesn't exist"});
      }

      return res.status(200).json({success:true,message:'success',data:userData});
   }
   catch(error){
      return res.status(500).json({ success:false,message: 'Internal Server error',error:error })
   }
}

const createNewPassword = async(req,res) => {
   try{
      const userByName = await userModelSchema.findOne({ userName: req.body.emailorusername });
      const userByEmail = await userModelSchema.findOne({ email: req.body.emailorusername });
      let user = userByEmail || userByName;
      if (!user) {
         console.log("Accound doesn't exist");
         return res.status(400).json({ success:false,message: "Account doesn't Exist" })
      }
      await sendOTPVerificationEmail(user,salt,res);
      // return res.status(200).json({
      //    success:true,
      //    message: "Complete the TFA to change the password.",
      //    data:{
      //       id:user._id,
      //       userName : user.userName,
      //    }
      // })
   }
   catch(error){
      return res.status(500).json({ success:false,message: 'Internal Server error',error:error })
   }
}

const resendOtp = async(req,res) => {
   try{
      const {email} = req.body;
      
      const user = await userModelSchema.find({
         email
      })
      await sendOTPVerificationEmail(user[0],salt,res);
   }catch(error){
      return res.status(500).json({ success:false,message: 'Internal Server error',error:error })
   }

}
module.exports = {resendOtp,createNewPassword,loginController,registerController,OTPVerification,resetPassword,getUserDetail,sendOTPVerificationEmail}