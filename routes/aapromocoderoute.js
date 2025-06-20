const express = require('express');
const router = express.Router();
const {db, supabase} = require('../database/db');
const {promoCode} = require('../database/schema');
const { v4: uuidv4 } = require('uuid');


function generatePromoCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  // Generate UUID and convert to base64, then take first 11 chars
  const uuid = uuidv4().replace(/-/g, '');
  const base64 = Buffer.from(uuid).toString('base64');
  result = base64.replace(/[+/=]/g, '').substring(0, 11);
  
  // If for some reason we don't get 11 chars, fill the rest randomly
  while (result.length < 11) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result.substring(0, 11);
}


router.get('/',async (req,res)=>{

  try {

    const promoCodePromises = [];
    const code_counts = 10;
    for (let i = 0; i < code_counts; i++) {
      const code = generatePromoCode();
      promoCodePromises.push(
        promoCode.create({ code,phone_number: '' ,count: 2 })
      );
    }
    await Promise.all(promoCodePromises);
    console.log(`Successfully generated ${code_counts} promo codes`);
    
  } catch (error) {
    console.log(error);
  }
  console.log();
  res.render('home');
});


module.exports = router;