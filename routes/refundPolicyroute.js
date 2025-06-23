const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
  res.render('cancellationAndRefund');
});

module.exports = router;