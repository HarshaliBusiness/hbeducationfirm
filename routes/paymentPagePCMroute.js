const express = require('express');
const router = express.Router();
const {db, supabase} = require('../database/db');
const isLoggedIn = require('../middleware/auth');
const isPCMPaymentDataExist = require('../middleware/checkPayment')
const {preferenceList} = require('../database/schema');
const multer = require('multer');
const upload = multer();


router.get('/',isLoggedIn, isPCMPaymentDataExist, (req, res)=>{
    res.render('paymentPagePCM');
})

// Handle payment data submission
router.post('/paymentPagePCMData', async (req, res) => {
    try {
        const { formData, order } = req.body;
        
        // Store in session or database
        req.session.paymentData = { formData, order };
        
        res.json({ 
            success: true,
            message: 'Payment data stored successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get('/LoadData', (req, res)=>{
    try {
        const paymentData = req.session.paymentData;
        const phone = req.session.user.phone;
        // console.log(paymentData);
        res.json({paymentData, phone});
    } catch (error) {
        console.log(error);
    }
});


router.post('/submit', upload.single('paymentScreenshot'), async (req, res) => {
    try {
        const data = req.body;
        const paymentData = req.session.paymentData;
        const phone = req.session.user.phone;
        const pdf_id = req.session.pdfID;
        // Validate required fields
        if (!req.file) {
        return res.status(400).json({ success: false, message: 'Payment screenshot is required' });
        }

        console.log(paymentData);
        const student = new preferenceList({
            pdf_id: pdf_id,
            name: data.studentName,
            examType: data.exam_type || 'Engineering', 
            isAccept: data.privacyPolicyAgreed,// Default to Engineering if not provided
            whatsappNumber: data.whatsappNumber,
            registerPhone: phone,
            generalRank: paymentData.formData.generalRank,
            allIndiaRank: paymentData.formData.allIndiaRank,
            caste: paymentData.formData.caste,
            gender: paymentData.formData.gender,
            homeUniversity: paymentData.formData.homeuniversity,
            tfws: paymentData.formData.tfws,
            branchCategories: paymentData.formData.branchCategories,
            cities: paymentData.formData.city,
            selectedBranches: paymentData.formData.selected_branches,
            paymentScreenshot: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            },
            transactionId: data.transactionId,
            paymentPlan: paymentData.order
        });

        await student.save();

        delete req.session.paymentData;

        res.status(201).json({ 
            success: true, 
            isok: true, // Added to match your frontend check
            message: 'Application submitted successfully' 
        });
    } catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({ 
        success: false, 
        isok: false,
        message: error.message || 'Error submitting application' 
        });
    }
});

module.exports = router;