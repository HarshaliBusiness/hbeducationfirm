const express = require('express');
const router = express.Router();
const {contactUs} = require('../database/schema');

router.get('/',(req,res)=>{
    res.render('contactUs');
});

router.post('/msgSend',async (req,res)=>{
    try {
        
        const contactForm = req.body;
        // console.log(contactForm);
        const newForm = new contactUs(contactForm);
        await newForm.save();
        return res.json({isSend: true});

    } catch (error) {
        console.log(error);
        return res.json({isSend: false});
    }
});

module.exports = router;