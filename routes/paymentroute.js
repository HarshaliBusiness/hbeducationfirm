const express = require('express');
require('dotenv').config();
const router = express.Router();
const {db, supabase} = require('../database/db');
const isLoggedIn = require('../middleware/auth');
const {User,promoCode} = require('../database/schema');
const crypto = require("crypto");
const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.get('/', isLoggedIn,async (req,res)=>{
    try {

        if(req.session.user.promoCode != ''){
            const promo_code = req.session.user.promoCode;
            const pm = await promoCode.findOne({code : promo_code});
            // console.log(pm)
            if(pm.count == 0){
                return res.json({isOk: false, msg: 'Promocode limit is over', order:''});
            }
            await promoCode.findOneAndUpdate(
                { 
                code: promo_code,
                count: { $gt: 0 } 
                },
                { $inc: { count: -1 } }, 
                { new: true }
            );
            return res.json({isOk : true, msg: 'success',order:''});
        }
        
        if(req.session.user.payment != ''){
            if(req.session.user.payment == 'basic'){
                const data = await createOder(500);
                if(data.iserr){
                    return res.json({isOk : false, msg: 'Server error. Try later.', order:''});
                }else{
                    return res.json({isOk : true, msg: 'success', order: data.order});
                }
                
            }else{
                
                const data = await await createOder(1000);
                if(data.iserr){
                    return res.json({isOk : false, msg: 'Server error. Try later.', order:''});
                }else{
                    return res.json({isOk : true, msg: 'success', order: data.order});
                }
            }
        }
        return res.json({isOk : false, msg: 'Internet Problem..'});

    } catch (error) {
        console.log(error);
    }
});

async function createOder(amount) {
    const options = {
        amount: amount * 100, // in paise
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
    };

    try {
        const order = await razorpayInstance.orders.create(options);
        return { iserr: false, order };
    } catch (error) {
        console.error("Error in creating order:", error);
        return { error: "Something went wrong", iserr: true, order: '' };
    }
}

// After successful verification in /verify-payment
router.post("/verify-payment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  // Validate required fields
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ isOk: false, msg: "Missing required fields" });
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    try {
      // Update user's payment status in database
      await User.findByIdAndUpdate(req.session.user._id, { 
        paymentStatus: 'completed',
        paymentDate: new Date()
      });
      
      res.status(200).json({ isOk: true, msg: "Payment verified successfully" });
    } catch (error) {
      console.error("Error updating payment status:", error);
      res.status(500).json({ isOk: false, msg: "Error updating payment status" });
    }
  } else {
    res.status(400).json({ isOk: false, msg: "Invalid signature. Verification failed" });
  }
});


module.exports = router;