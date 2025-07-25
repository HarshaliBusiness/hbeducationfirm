
const mongoose = require('mongoose');
const { Message } = require('twilio/lib/twiml/MessagingResponse');

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
  phone_number : Number,
  count : Number
});

const pdfSchema = new mongoose.Schema({
  pdfID: String,
  isVerified : Boolean,
  phone_number: String,
  examType: String,
  code: String,
  payment: String,
  title: { type: String, required: true },
  pdf: { type: Buffer, required: true }, 
  createdAt: { type: Date, default: Date.now }
});

const specialReservationSchema = new mongoose.Schema({
  code : String,
  examType: String,
  phone_number : Number,
  payment : String,
  generalRank: Number,
  allIndiaRank: Number,
  caste: String,
  gender: String,
  tfws: Boolean,
  branchCategories: [String],
  city: [String],
  homeuniversity: String,
  specialReservation: String
});

const contactUsSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  message: String
});

const preferenceListSchema = new mongoose.Schema({
  pdf_id : String,
  name: String,
  isCheck: Boolean,
  examType: String,
  isAccept: Boolean,
  whatsappNumber: String,
  registerPhone: String,
  generalRank: Number,
  allIndiaRank: Number,
  caste: String,
  gender: String,
  homeUniversity: String,
  tfws: Boolean,
  branchCategories: [String],
  cities: [String],
  selectedBranches: [String] ,
  paymentScreenshot: {
    data: Buffer,
    contentType: String
  },
  transactionId: String,
  createdAt: { type: Date, default: Date.now },
  paymentPlan: String
});

const Pdf = mongoose.model('Pdf', pdfSchema);
const User = mongoose.model('User', userSchema);
const promoCode = mongoose.model('promoCode',promoCodeSchema);
const specialReservation = mongoose.model('specialReservation', specialReservationSchema);
const contactUs = mongoose.model('contactUs',contactUsSchema);
const preferenceList = mongoose.model('preferenceList',preferenceListSchema)

module.exports = {User, promoCode, Pdf,specialReservation, contactUs, preferenceList};



