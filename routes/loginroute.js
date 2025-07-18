const express = require('express');
const router = express.Router();
const {User, promoCode} = require('../database/schema');
const bcrypt = require('bcrypt');
const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);


router.get('/',(req,res)=>{
  res.render('login');
});


router.post('/checkCredentials', async(req,res)=>{
  const {phone, password} = req.body;
  const hashPassword = await bcrypt.hash(password,10);
  // console.log(hashPassword);
  try {
    const user = await User.findOne({phone_number : phone});
    // console.log(user);
    let exampage;
    if(!user || !user.isVerified){
      return res.json({msg: `Invalid phone number.`,exam:`null`,login : false});
    }else{
      const isMatch = await bcrypt.compare(password,user.password);
      if(!isMatch){
        return res.json({msg: `Invalid password.`,exam:`null`,login : false});
      }
      req.session.user = {phone : phone, password : hashPassword, promoCode:'',payment:''};
      // req.session.user = {phone : phone, password : hashPassword, promoCode:'',payment:'', formData:'', order: ''};
      return res.json({msg: `Login successful!`,exam:`${user.examType}` ,login : true});
    }
  } catch (error) {
    console.log(error);
  }
});


router.post('/forgotPassword', async(req,res)=>{
  const {phone} = req.body;
  try {

    const user = await User.findOne({phone_number : phone});
    if(!user){
      return res.json({msg : 'Invalid phone number.', issend : false});
    }
    return res.json({msg : '', issend : true});
  } catch (error) {
    console.log(error);
  }
});




router.post('/resetPassword', async(req,res)=>{
  const {phone, password} = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  try {

    const user = await User.findOne({phone_number : phone});
    if(!user){
      return res.json({msg : 'Network issue.', isreset : false});
    }
    await User.findOneAndUpdate(
      { phone_number : phone },
      { password : hashPassword},
      { new: true }
    );
    req.session.user = {phone : phone, password : hashPassword};
    return res.json({msg : 'Password reset successfully!', isreset : true});
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;