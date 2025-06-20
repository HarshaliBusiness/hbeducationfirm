const express = require('express');
const router = express.Router();
const {db, supabase} = require('../database/db');
const isLoggedIn = require('../middleware/auth');

router.get('/',isLoggedIn,(req,res)=>{
  res.render('afterLoginPage');
});

module.exports = router;