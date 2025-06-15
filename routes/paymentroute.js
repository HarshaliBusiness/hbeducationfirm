const express = require('express');
const router = express.Router();
const {db, supabase} = require('../database/db');
const isLoggedIn = require('../middleware/auth');
const {User,promoCode} = require('../database/schema');

router.get('/', isLoggedIn,async (req,res)=>{

    try {

        if(req.session.user.promoCode != ''){
            const promo_code = req.session.user.promoCode;
            const pm = await User.findOne({code : promo_code});
            if(pm.count == 0){
                return res.json({isOk: false, msg: 'Promocode limit is over'});
            }
            await promoCode.findOneAndUpdate(
                { 
                code: promo_code,
                count: { $gt: 0 } 
                },
                { $inc: { count: -1 } }, 
                { new: true }
            );
            return res.json({isOk : true, msg: 'success'});
        }
        
        if(req.session.user.payment != ''){
            if(req.session.user.payment == '75'){
                return res.json({isOk : true, msg: 'success'});
            }else{
                return res.json({isOk : true, msg: 'success'});
            }
        }
        return res.json({isOk : false, msg: 'Internet Problem..'});

    } catch (error) {
        console.log(error);
    }
});


module.exports = router;