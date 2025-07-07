
function isPCMPaymentDataExist(req, res, next) {
  
  if (req.session.paymentData) {
    next(); 
  } else {
    res.redirect('pcm')
  }
}

module.exports = isPCMPaymentDataExist;

