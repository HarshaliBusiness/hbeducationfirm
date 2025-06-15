const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    email : String,
    phone_number : Number,
    first_name : String,
    last_name : String,
    exam_type : String,
    password : String,
    otp : Number,
    gender : String,
    caste : String,
    special_category : String,
    home_university : String,
    isVerified : Boolean,
    examType : String
});

const promoCodeSchema = new mongoose.Schema({
  code : String,
  count : Number
});

const pdfSchema = new mongoose.Schema({
  phone_number: String,
  code: String,
  payment: String,
  title: { type: String, required: true },
  pdf: { type: Buffer, required: true }, 
  createdAt: { type: Date, default: Date.now }
});

const Pdf = mongoose.model('Pdf', pdfSchema);
const User = mongoose.model('User', userSchema);
const promoCode = mongoose.model('promoCode',promoCodeSchema);

module.exports = {User, promoCode, Pdf};

