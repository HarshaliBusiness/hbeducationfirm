const express = require('express');
const router = express.Router();
const {User, Pdf, promoCode} = require('../database/schema');
const isLoggedIn = require('../middleware/auth');


router.get('/',isLoggedIn,(req,res)=>{
    res.render('profile');
});

router.get('/profileData', async(req,res)=>{

    try {
        const phone = req.session.user.phone;
        // console.log(phone);
        const user = await User.findOne({phone_number: phone},{password:0});
        // console.log(user);

        const pdf = await Pdf.find({phone_number: phone},{pdf:0});
        // console.log(pdf);
        
        const promo_code = await promoCode.find({phone_number: phone});
        // console.log(promo_code);

        let name = user.first_name + ' ' + user.last_name;
        res.json({
            phone_number: user.phone_number,
            name: name,
            email: user.email,
            pdf: pdf,
            promo_code: promo_code
        });

    } catch (error) {
        console.log(error);
    }   

});

router.get('/download/:index', async(req,res)=>{

    try {

        const index = req.params.index;
        const phone = req.session.user.phone;
        const pdfList = await Pdf.find({phone_number: phone});
        const base64Pdf = pdfList[index].pdf;
        const buffer = Buffer.from(base64Pdf, 'base64');

        const fileName = `${pdfList[index].examType}.pdf`;

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${fileName}"`,
        });

        res.send(buffer);
    } catch (error) {
        console.log(error);
    }   

});

module.exports = router;