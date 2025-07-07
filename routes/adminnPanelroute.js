const express = require('express');
const router = express.Router();
const {db, supabase} = require('../database/db');
const {User, promoCode, Pdf, specialReservation, contactUs, preferenceList} = require('../database/schema');

router.get('/',(req,res)=>{
  res.render('adminPanel');
});

router.get('/specialReservations', async(req, res)=>{
  try {
    const data = await specialReservation.aggregate([
      {
        $lookup: {
          from: 'users', 
          localField: 'phone_number',
          foreignField: 'phone_number',
          as: 'extra_info'
        }
      }
    ]);

    res.json(data);

  } catch (error) {
    console.log(error);
  }
});

router.delete('/deleteReservation/:Id', async (req, res) => {
  try {
    const result = await specialReservation.findByIdAndDelete(req.params.Id);
    if (!result) {
      return res.status(404).json({success: false, message: 'User not found' });
    }
    res.json({ success: true,message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false,error: 'Server error' });
  }
});

router.get('/studentInformation',async (req,res)=>{
  try {
    const students = await User.find({}, { password: 0 });
    // console.log(students);
    res.json(students);
  } catch (error) {
    console.log(error);
  }
});

router.get('/studentPurchase',async (req,res)=>{
  try {
    const purchase = await Pdf.find({},{ pdf: 0 });
    // console.log(purchase);
    res.json(purchase);
  } catch (error) {
    console.log(error);
  }
});


router.get('/promoCodes', async (req, res) => {
  try {
    const data = await promoCode.aggregate([
      {
        $lookup: {
          from: 'users', // must match the actual *collection name* in MongoDB (lowercase, plural usually)
          localField: 'phone_number',
          foreignField: 'phone_number',
          as: 'extra_info'
        }
      }
    ]);

    // console.log(data);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/assignPromoCode', async (req, res) => {
  try {

    const {phone, promo_code} = req.body;
    // console.log(phone, promoCode);
    const code = await promoCode.findOne({code: promo_code});
    if(code && code.phone_number == null){
      await promoCode.findOneAndUpdate(
        { code: promo_code },
        {phone_number: phone},
        { new: true }
      );
      return res.json({msg: 'Successfully done.', isAssign: true});
    }else if(code){
      return res.json({msg: 'Already assigned.', isAssign: false});
    }else{
      return res.json({msg: 'Invalide promo code.', isAssign: false});
    }
    // res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/contactUsForms',async (req,res)=>{
  try {

    const data = await contactUs.find({});
    // console.log(data);
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.delete('/deleteContactForm/:Id', async (req, res) => {
  try {
    const result = await contactUs.findByIdAndDelete(req.params.Id);
    if (!result) {
      return res.status(404).json({success: false, message: 'User not found' });
    }
    res.json({ success: true,message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false,error: 'Server error' });
  }
});

router.get('/preferenceLists',async (req, res)=>{
  try {
     const data = await preferenceList.find({});
    //  console.log(data);
     res.json(data);
  } catch (error) {
    console.log(error);
  }
});

// router.get('/', async (req, res) => {
//   try {
//     const pdf_id = req.params.pdf_id; // ✅ this gets the actual string
//     // console.log(pdf_id);
//     const data = await Pdf.find({ pdfID: pdf_id }); // ✅ use string here
//     // console.log(data);
//     res.json({data, isok:true});
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

router.get('/downloadPreferencePDF/:pdf_id', async (req, res) => {
  try {
    const pdf_id = req.params.pdf_id;

    // Use findOne instead of find
    const pdfDoc = await Pdf.findOne({ pdfID: pdf_id });

    // Handle not found case
    if (!pdfDoc || !pdfDoc.pdf) {
      return res.status(404).json({ error: 'PDF not found' });
    }

    const base64Pdf = pdfDoc.pdf; // ✅ Now this is a string
    const buffer = Buffer.from(base64Pdf, 'base64');

    const fileName = `${pdf_id}.pdf`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    res.send(buffer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;