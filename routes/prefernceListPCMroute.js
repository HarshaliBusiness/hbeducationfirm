const express = require('express');
const router = express.Router();
const {db, supabase} = require('../database/db');
const isLoggedIn = require('../middleware/auth');
const {User, promoCode, Pdf ,specialReservation} = require('../database/schema');
const multer = require('multer');
const upload = multer({ limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB limit

router.get('/', isLoggedIn,(req,res)=>{
  res.render('prefernceListPCM');
});


router.post('/specialReservationMsg', async (req, res) => {
    try {
        const {formData, special_reservation, exam_type} = req.body;
        // console.log(formData, special_reservation);
        const user = req.session.user;
        // console.log(user);
        const newUserData = {
            code: user.promoCode,
            examType: exam_type,
            phone_number: user.phone,
            payment: user.payment,
            generalRank: formData.generalRank,
            allIndiaRank: formData.allIndiaRank,
            caste: formData.caste,
            gender: formData.gender,
            tfws: formData.tfws,
            branchCategories: formData.branchCategories,
            city: formData.city,
            homeuniversity: formData.homeuniversity,
            specialReservation: special_reservation
        }

        const newspecialReservation = new specialReservation(newUserData);
        await newspecialReservation.save();
        res.json({isSave: true});
    } catch (err) {
        console.error(err);
        res.json({isSave: false});
    }
});


router.get('/fetchBranches', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('branch')
            .select('branch_name');
        
        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch branches' });
    }
});

router.get('/fetchcity', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('college_info')
            .select('city')
            .not('city', 'is', null)
            .order('city', { ascending: true });
        
        if (error) throw error;
        
        // Trim city names and get distinct values
        const distinctCities = [...new Set(data.map(item => item.city.trim()))];
        res.json(distinctCities.map(city => ({ city })));
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to fetch cities' });
    }
});


router.get('/fetchUniversity', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('college_info')
            .select('university')
            .not('university', 'is', null)
            .order('university', { ascending: true });
        
        if (error) throw error;
        
        // Get distinct universities
        const distinctUniversities = [...new Set(data.map(item => item.university))];
        res.json(distinctUniversities.map(univ => ({ university: univ })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch universities' });
    }
});



async function getSelectedBranchCode(selected_branches) {
    try {
        const { data, error } = await supabase
            .from('branch')
            .select('branch_code')
            .in('branch_name', selected_branches);
        
        if (error) throw error;
        return data.map(item => item.branch_code);
    } catch (error) {
        console.error('Error fetching branch codes:', error);
        throw error;
    }
}

function calculateRankRange(formData) {

    let subMinRank = 0;

    let minRank = formData.generalRank;

    if (formData.generalRank < 7000) {
        subMinRank = 0;
    }else if(formData.generalRank < 20000){
        subMinRank = 7000;
    }else if(formData.generalRank < 30000){
        subMinRank = 8000;
    }else if(formData.generalRank < 40000){
        subMinRank = 9000;
    }else if(formData.generalRank < 50000){
        subMinRank = 10000;
    }else if(formData.generalRank < 60000){
        subMinRank = 11000;
    }else if(formData.generalRank < 70000){
        subMinRank = 12000;
    }else if(formData.generalRank < 80000){
        subMinRank = 13000;
    }else if(formData.generalRank < 90000){
        subMinRank = 14000;
    }else if(formData.generalRank < 100000){
        subMinRank = 15000;
    }else {
        subMinRank = 17000;
    }
    

    minRank -= subMinRank;
    new_data_of_student.minRank = minRank;
    new_data_of_student.maxRank = 2000000;

    if (formData.allIndiaRank  < 3000) {
        subMinRank = 0;
    }else if(formData.allIndiaRank  < 10000){
        subMinRank = 7000;
    }else if(formData.allIndiaRank  < 20000){
        subMinRank = 8000;
    }else if(formData.allIndiaRank  < 30000){
        subMinRank = 9000;
    }else if(formData.allIndiaRank  < 40000){
        subMinRank = 10000;
    }else if(formData.allIndiaRank  < 50000){
        subMinRank = 11000;
    }else if(formData.allIndiaRank < 60000){
        subMinRank = 12000;
    }else if(formData.allIndiaRank  < 70000){
        subMinRank = 13000;
    }else if(formData.allIndiaRank  < 80000){
        subMinRank = 14000;
    }else if(formData.allIndiaRank < 90000){
        subMinRank = 15000;
    }else {
        subMinRank = 17000;
    }
    
    minRank -= subMinRank;
    new_data_of_student.allMinRank = minRank;
    new_data_of_student.allMaxRank = 2000000;
    
}

function clear_new_data_function() {
    new_data_of_student.caste_name = '';
    new_data_of_student.caste_Column_H = '';
    new_data_of_student.caste_Column_S = '';
    new_data_of_student.caste_Column_O = '';
    new_data_of_student.specialReservation = '';
}

function getCasteColumns(caste, gender) {
    const prefix = gender === 'Female' ? 'L' : 'G';

    new_data_of_student.caste_Column_H = `"${prefix}${caste}H"`;
    new_data_of_student.caste_Column_O = `"${prefix}${caste}O"`;
    new_data_of_student.caste_Column_S = `"${prefix}${caste}S"`;
    new_data_of_student.caste_name = `${prefix}${caste}`;

    if (caste === 'EWS') {
        new_data_of_student.caste_Column_H = '"EWS"';
        new_data_of_student.caste_Column_O = '"EWS"';
        new_data_of_student.caste_Column_S = '"EWS"';
        new_data_of_student.caste_name = 'EWS';
    }
}

const new_data_of_student = {
    caste_name: '',
    caste_Column_S: '',
    caste_Column_O: '',
    caste_Column_H: '',
    specialReservation: '',
    minRank: 0,
    maxRank: 0,
    allMinRank: 0,
    allMaxRank: 0,
    selected_branches_code: []
};

async function getColleges(formData) {
    formData.homeUniversity = formData.homeuniversity;
    let caste_column = '';
    let caste_condition = '';

    // EWS
    if (formData.caste == 'EWS') {
        caste_column += `
            r."EWS" || ' (' || COALESCE((SELECT m.percentile FROM merit_list AS m WHERE m."Rank" = r."EWS" LIMIT 1), '0') || ')' AS ews,
        `;
        caste_condition += `
            (r."EWS" BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank} OR r."EWS" = 0)
            AND
        `;
    }else{
        caste_column += `
            NULL::TEXT AS ews,
        `;
        caste_condition += `
            TRUE AND
        `;
    }

    //  TFWS
    if (formData.tfws) {
        caste_column += `
            r."TFWS" || ' (' || COALESCE((SELECT m.percentile FROM merit_list AS m WHERE m."Rank" = r."TFWS" LIMIT 1), '0') || ')' AS def,
        `;
        caste_condition += `
            (r."TFWS" BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank} OR r."TFWS" = 0)
            AND
        `;
    }else{
        caste_column += `
            NULL::TEXT AS tfws,
        `;
        caste_condition += `
            TRUE AND
        `;
    }
    
    // LOPEN
    if (formData.gender == 'Female') {
        caste_column += `
            CASE
                WHEN r."LOPENS" <> 0 AND r."LOPENO" = 0 AND r."LOPENH" = 0 THEN r."LOPENS"::TEXT
                WHEN c.university = '${formData.homeUniversity}' THEN r."LOPENH"::TEXT
                ELSE r."LOPENO"::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r."LOPENS" <> 0 AND r."LOPENO" = 0 AND r."LOPENH" = 0 THEN r."LOPENS"
                                 WHEN c.university = '${formData.homeUniversity}' THEN r."LOPENH"
                                 ELSE r."LOPENO"
                             END
                         LIMIT 1), '0'
                    ) || ')' AS lopen,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r."LOPENS" <> 0 AND r."LOPENO" = 0 AND r."LOPENH" = 0 THEN r."LOPENS"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."LOPENH"
                    ELSE r."LOPENO"
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r."LOPENS" <> 0 AND r."LOPENO" = 0 AND r."LOPENH" = 0 THEN r."LOPENS"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."LOPENH"
                    ELSE r."LOPENO"
                END = 0
            ) AND
        `;
    }else{
        caste_column += `
            NULL::TEXT AS lopen,
        `;
        caste_condition += `
            TRUE AND
        `;
    } 

    // GOBC
    if (formData.caste == 'OBC' && formData.gender == 'Male') {
        caste_column += `
            CASE
                WHEN r."GOBCS" <> 0 AND r."GOBCO" = 0 AND r."GOBCH" = 0 THEN r."GOBCS"::TEXT
                WHEN c.university = '${formData.homeUniversity}' THEN r."GOBCH"::TEXT
                ELSE r."GOBCO"::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r."GOBCS" <> 0 AND r."GOBCO" = 0 AND r."GOBCH" = 0 THEN r."GOBCS"
                                 WHEN c.university = '${formData.homeUniversity}' THEN r."GOBCH"
                                 ELSE r."GOBCO"
                             END
                         LIMIT 1), '0'
                    ) || ')' AS gobc,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r."GOBCS" <> 0 AND r."GOBCO" = 0 AND r."GOBCH" = 0 THEN r."GOBCS"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."GOBCH"
                    ELSE r."GOBCO"
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r."GOBCS" <> 0 AND r."GOBCO" = 0 AND r."GOBCH" = 0 THEN r."GOBCS"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."GOBCH"
                    ELSE r."GOBCO"
                END = 0
            ) AND
        `;
    }else{
        caste_column += `
            NULL::TEXT AS gobc,
        `;
        caste_condition += `
            TRUE AND
        `;
    } 

    // LOBC
    if (formData.caste == 'OBC' && formData.gender == 'Female') {
        caste_column += `
            CASE
                WHEN r."LOBCS" <> 0 AND r."LOBCO" = 0 AND r."LOBCH" = 0 THEN r."LOBCS"::TEXT
                WHEN c.university = '${formData.homeUniversity}' THEN r."LOBCH"::TEXT
                ELSE r."LOBCO"::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r."LOBCS" <> 0 AND r."LOBCO" = 0 AND r."LOBCH" = 0 THEN r."LOBCS"
                                 WHEN c.university = '${formData.homeUniversity}' THEN r."LOBCH"
                                 ELSE r."LOBCO"
                             END
                         LIMIT 1), '0'
                    ) || ')' AS lobc,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r."LOBCS" <> 0 AND r."LOBCO" = 0 AND r."LOBCH" = 0 THEN r."LOBCS"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."LOBCH"
                    ELSE r."LOBCO"
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r."LOBCS" <> 0 AND r."LOBCO" = 0 AND r."LOBCH" = 0 THEN r."LOBCS"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."LOBCH"
                    ELSE r."LOBCO"
                END = 0
            ) AND
        `;
    }else{
        caste_column += `
            NULL::TEXT AS lobc,
        `;
        caste_condition += `
            TRUE AND
        `;
    } 

    // GSEBC
    if (formData.caste == 'SEBC' && formData.gender == 'Male') {
        caste_column += `
            CASE
                WHEN r."GSEBCS" <> 0 AND r."GSEBCO" = 0 AND r."GSEBCH" = 0 THEN r."GSEBCS"::TEXT
                WHEN c.university = '${formData.homeUniversity}' THEN r."GSEBCH"::TEXT
                ELSE r."GSEBCO"::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r."GSEBCS" <> 0 AND r."GSEBCO" = 0 AND r."GSEBCH" = 0 THEN r."GSEBCS"
                                 WHEN c.university = '${formData.homeUniversity}' THEN r."GSEBCH"
                                 ELSE r."GSEBCO"
                             END
                         LIMIT 1), '0'
                    ) || ')' AS gsebc,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r."GSEBCS" <> 0 AND r."GSEBCO" = 0 AND r."GSEBCH" = 0 THEN r."GSEBCS"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."GSEBCH"
                    ELSE r."GSEBCO"
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r."GSEBCS" <> 0 AND r."GSEBCO" = 0 AND r."GSEBCH" = 0 THEN r."GSEBCS"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."GSEBCH"
                    ELSE r."GSEBCO"
                END = 0
            ) AND
        `;
    }else{
        caste_column += `
            NULL::TEXT AS gsebc,
        `;
        caste_condition += `
            TRUE AND
        `;
    }

    // LSEBC 
    if (formData.caste == 'SEBC' && formData.gender == 'Female') {
        caste_column += `
            CASE
                WHEN r."LSEBCS" <> 0 AND r."LSEBCO" = 0 AND r."LSEBCH" = 0 THEN r."LSEBCS"::TEXT
                WHEN c.university = '${formData.homeUniversity}' THEN r."LSEBCH"::TEXT
                ELSE r."LSEBCO"::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r."LSEBCS" <> 0 AND r."LSEBCO" = 0 AND r."LSEBCH" = 0 THEN r."LSEBCS"
                                 WHEN c.university = '${formData.homeUniversity}' THEN r."LSEBCH"
                                 ELSE r."LSEBCO"
                             END
                         LIMIT 1), '0'
                    ) || ')' AS lsebc,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r."LSEBCS" <> 0 AND r."LSEBCO" = 0 AND r."LSEBCH" = 0 THEN r."LSEBCS"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."LSEBCH"
                    ELSE r."LSEBCO"
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r."LSEBCS" <> 0 AND r."LSEBCO" = 0 AND r."LSEBCH" = 0 THEN r."LSEBCS"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."LSEBCH"
                    ELSE r."LSEBCO"
                END = 0
            ) AND
        `;
    }else{
        caste_column += `
            NULL::TEXT AS lsebc,
        `;
        caste_condition += `
            TRUE AND
        `;
    }

    // GST
    if (formData.caste == 'ST' && formData.gender == 'Male') {
        caste_column += `
            CASE
                WHEN r."GSTS" <> 0 AND r."GSTO" = 0 AND r."GSTH" = 0 THEN r."GSTS"::TEXT
                WHEN c.university = '${formData.homeUniversity}' THEN r."GSTH"::TEXT
                ELSE r."GSTO"::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r."GSTS" <> 0 AND r."GSTO" = 0 AND r."GSTH" = 0 THEN r."GSTS"
                                 WHEN c.university = '${formData.homeUniversity}' THEN r."GSTH"
                                 ELSE r."GSTO"
                             END
                         LIMIT 1), '0'
                    ) || ')' AS gst,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r."GSTS" <> 0 AND r."GSTO" = 0 AND r."GSTH" = 0 THEN r."GSTS"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."GSTH"
                    ELSE r."GSTO"
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r."GSTS" <> 0 AND r."GSTO" = 0 AND r."GSTH" = 0 THEN r."GSTS"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."GSTH"
                    ELSE r."GSTO"
                END = 0
            ) AND
        `;
    }else{
        caste_column += `
            NULL::TEXT AS gst,
        `;
        caste_condition += `
            TRUE AND
        `;
    }
    
    // LST
    if (formData.caste == 'ST' && formData.gender == 'Female') {
        caste_column += `
            CASE
                WHEN r."LSTS" <> 0 AND r."LSTO" = 0 AND r."LSTH" = 0 THEN r."LSTS"::TEXT
                WHEN c.university = '${formData.homeUniversity}' THEN r."LSTH"::TEXT
                ELSE r."LSTO"::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r."LSTS" <> 0 AND r."LSTO" = 0 AND r."LSTH" = 0 THEN r."LSTS"
                                 WHEN c.university = '${formData.homeUniversity}' THEN r."LSTH"
                                 ELSE r."LSTO"
                             END
                         LIMIT 1), '0'
                    ) || ')' AS lst,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r."LSTS" <> 0 AND r."LSTO" = 0 AND r."LSTH" = 0 THEN r."LSTS"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."LSTH"
                    ELSE r."LSTO"
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r."LSTS" <> 0 AND r."LSTO" = 0 AND r."LSTH" = 0 THEN r."LSTS"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."LSTH"
                    ELSE r."LSTO"
                END = 0
            ) AND
        `;
    }else{
        caste_column += `
            NULL::TEXT AS lst,
        `;
        caste_condition += `
            TRUE AND
        `;
    }

    // GSC
    if (formData.caste == 'SC' && formData.gender == 'Male') {
        caste_column += `
            CASE
                WHEN r."GSCS" <> 0 AND r."GSCO" = 0 AND r."GSCH" = 0 THEN r."GSCS"::TEXT
                WHEN c.university = '${formData.homeUniversity}' THEN r."GSTH"::TEXT
                ELSE r."GSCO"::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r."GSCS" <> 0 AND r."GSCO" = 0 AND r."GSCH" = 0 THEN r."GSCS"
                                 WHEN c.university = '${formData.homeUniversity}' THEN r."GSCH"
                                 ELSE r."GSCO"
                             END
                         LIMIT 1), '0'
                    ) || ')' AS gsc,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r."GSCS" <> 0 AND r."GSCO" = 0 AND r."GSCH" = 0 THEN r."GSCS"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."GSCH"
                    ELSE r."GSCO"
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r."GSCS" <> 0 AND r."GSCO" = 0 AND r."GSCH" = 0 THEN r."GSCS"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."GSCH"
                    ELSE r."GSCO"
                END = 0
            ) AND
        `;
    }else{
        caste_column += `
            NULL::TEXT AS gsc,
        `;
        caste_condition += `
            TRUE AND
        `;
    }

    // LSC
    if (formData.caste == 'SC' && formData.gender == 'Female') {
        caste_column += `
            CASE
                WHEN r."LSCS" <> 0 AND r."LSTO" = 0 AND r."LSCH" = 0 THEN r."LSCS"::TEXT
                WHEN c.university = '${formData.homeUniversity}' THEN r."LSCH"::TEXT
                ELSE r."LSCO"::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r."LSCS" <> 0 AND r."LSCO" = 0 AND r."LSCH" = 0 THEN r."LSCS"
                                 WHEN c.university = '${formData.homeUniversity}' THEN r."LSCH"
                                 ELSE r."LSCO"
                             END
                         LIMIT 1), '0'
                    ) || ')' AS lsc,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r."LSCS" <> 0 AND r."LSCO" = 0 AND r."LSCH" = 0 THEN r."LSCS"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."LSCH"
                    ELSE r."LSCO"
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r."LSCS" <> 0 AND r."LSCO" = 0 AND r."LSCH" = 0 THEN r."LSCS"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."LSCH"
                    ELSE r."LSCO"
                END = 0
            ) AND
        `;
    }else{
        caste_column += `
            NULL::TEXT AS lsc,
        `;
        caste_condition += `
            TRUE AND
        `;
    }

    // GNT1
    if (formData.caste == 'NT1' && formData.gender == 'Male') {
        caste_column += `
            CASE
                WHEN r."GNT1S" <> 0 AND r."GNT1O" = 0 AND r."GNT1H" = 0 THEN r."GNT1S"::TEXT
                WHEN c.university = '${formData.homeUniversity}' THEN r."GNT1H"::TEXT
                ELSE r."GNT1O"::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r."GNT1S" <> 0 AND r."GNT1O" = 0 AND r."GNT1H" = 0 THEN r."GNT1S"
                                 WHEN c.university = '${formData.homeUniversity}' THEN r."GNT1H"
                                 ELSE r."GNT1O"
                             END
                         LIMIT 1), '0'
                    ) || ')' AS gnt1,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r."GNT1S" <> 0 AND r."GNT1O" = 0 AND r."GNT1H" = 0 THEN r."GNT1S"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."GNT1H"
                    ELSE r."GNT1O"
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r."GNT1S" <> 0 AND r."GNT1O" = 0 AND r."GNT1H" = 0 THEN r."GNT1S"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."GNT1H"
                    ELSE r."GNT1O"
                END = 0
            ) AND
        `;
    }else{
        caste_column += `
            NULL::TEXT AS gnt1,
        `;
        caste_condition += `
            TRUE AND
        `;
    }

    // LNT1
    if (formData.caste == 'NT1' && formData.gender == 'Female') {
        caste_column += `
            CASE
                WHEN r."LNT1S" <> 0 AND r."LNT1O" = 0 AND r."LNT1H" = 0 THEN r."LNT1S"::TEXT
                WHEN c.university = '${formData.homeUniversity}' THEN r."LNT1H"::TEXT
                ELSE r."LNT1O"::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r."LNT1S" <> 0 AND r."LNT1O" = 0 AND r."LNT1H" = 0 THEN r."LNT1S"
                                 WHEN c.university = '${formData.homeUniversity}' THEN r."LNT1H"
                                 ELSE r."LNT1O"
                             END
                         LIMIT 1), '0'
                    ) || ')' AS lnt1,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r."LNT1S" <> 0 AND r."LNT1O" = 0 AND r."LNT1H" = 0 THEN r."LNT1S"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."LNT1H"
                    ELSE r."LNT1O"
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r."LNT1S" <> 0 AND r."LNT1O" = 0 AND r."LNT1H" = 0 THEN r."LNT1S"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."LNT1H"
                    ELSE r."LNT1O"
                END = 0
            ) AND
        `;
    }else{
        caste_column += `
            NULL::TEXT AS lnt1,
        `;
        caste_condition += `
            TRUE AND
        `;
    }

    // GNT2
    if (formData.caste == 'NT2' && formData.gender == 'Male') {
        caste_column += `
            CASE
                WHEN r."GNT2S" <> 0 AND r."GNT2O" = 0 AND r."GNT2H" = 0 THEN r."GNT2S"::TEXT
                WHEN c.university = '${formData.homeUniversity}' THEN r."GNT2H"::TEXT
                ELSE r."GNT2O"::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r."GNT2S" <> 0 AND r."GNT2O" = 0 AND r."GNT2H" = 0 THEN r."GNT2S"
                                 WHEN c.university = '${formData.homeUniversity}' THEN r."GNT2H"
                                 ELSE r."GNT2O"
                             END
                         LIMIT 1), '0'
                    ) || ')' AS gnt2,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r."GNT2S" <> 0 AND r."GNT2O" = 0 AND r."GNT2H" = 0 THEN r."GNT2S"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."GNT2H"
                    ELSE r."GNT2O"
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r."GNT2S" <> 0 AND r."GNT2O" = 0 AND r."GNT2H" = 0 THEN r."GNT2S"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."GNT2H"
                    ELSE r."GNT2O"
                END = 0
            ) AND
        `;
    }else{
        caste_column += `
            NULL::TEXT AS gnt2,
        `;
        caste_condition += `
            TRUE AND
        `;
    }

    // LNT2
    if (formData.caste == 'NT2' && formData.gender == 'Female') {
        caste_column += `
            CASE
                WHEN r."LNT2S" <> 0 AND r."LNT2O" = 0 AND r."LNT2H" = 0 THEN r."LNT2S"::TEXT
                WHEN c.university = '${formData.homeUniversity}' THEN r."LNT2H"::TEXT
                ELSE r."LNT2O"::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r."LNT2S" <> 0 AND r."LNT2O" = 0 AND r."LNT2H" = 0 THEN r."LNT2S"
                                 WHEN c.university = '${formData.homeUniversity}' THEN r."LNT2H"
                                 ELSE r."LNT2O"
                             END
                         LIMIT 1), '0'
                    ) || ')' AS lnt2,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r."LNT2S" <> 0 AND r."LNT2O" = 0 AND r."LNT2H" = 0 THEN r."LNT2S"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."LNT2H"
                    ELSE r."LNT2O"
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r."LNT2S" <> 0 AND r."LNT2O" = 0 AND r."LNT2H" = 0 THEN r."LNT2S"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."LNT2H"
                    ELSE r."LNT2O"
                END = 0
            ) AND
        `;
    }else{
        caste_column += `
            NULL::TEXT AS lnt2,
        `;
        caste_condition += `
            TRUE AND
        `;
    }

    // GNT3
    if (formData.caste == 'NT3' && formData.gender == 'Male') {
        caste_column += `
            CASE
                WHEN r."GNT3S" <> 0 AND r."GNT3O" = 0 AND r."GNT3H" = 0 THEN r."GNT3S"::TEXT
                WHEN c.university = '${formData.homeUniversity}' THEN r."GNT3H"::TEXT
                ELSE r."GNT3O"::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r."GNT3S" <> 0 AND r."GNT3O" = 0 AND r."GNT3H" = 0 THEN r."GNT3S"
                                 WHEN c.university = '${formData.homeUniversity}' THEN r."GNT3H"
                                 ELSE r."GNT3O"
                             END
                         LIMIT 1), '0'
                    ) || ')' AS gnt3,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r."GNT3S" <> 0 AND r."GNT3O" = 0 AND r."GNT3H" = 0 THEN r."GNT3S"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."GNT3H"
                    ELSE r."GNT3O"
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r."GNT3S" <> 0 AND r."GNT3O" = 0 AND r."GNT3H" = 0 THEN r."GNT3S"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."GNT3H"
                    ELSE r."GNT3O"
                END = 0
            ) AND
        `;
    }else{
        caste_column += `
            NULL::TEXT AS gnt3,
        `;
        caste_condition += `
            TRUE AND
        `;
    }

    // LNT3
    if (formData.caste == 'NT3' && formData.gender == 'Female') {
        caste_column += `
            CASE
                WHEN r."LNT3S" <> 0 AND r."LNT3O" = 0 AND r."LNT3H" = 0 THEN r."LNT3S"::TEXT
                WHEN c.university = '${formData.homeUniversity}' THEN r."LNT3H"::TEXT
                ELSE r."LNT3O"::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r."LNT3S" <> 0 AND r."LNT3O" = 0 AND r."LNT3H" = 0 THEN r."LNT3S"
                                 WHEN c.university = '${formData.homeUniversity}' THEN r."LNT3H"
                                 ELSE r."LNT3O"
                             END
                         LIMIT 1), '0'
                    ) || ')' AS lnt3,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r."LNT3S" <> 0 AND r."LNT3O" = 0 AND r."LNT3H" = 0 THEN r."LNT3S"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."LNT3H"
                    ELSE r."LNT3O"
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r."LNT3S" <> 0 AND r."LNT3O" = 0 AND r."LNT3H" = 0 THEN r."LNT3S"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."LNT3H"
                    ELSE r."LNT3O"
                END = 0
            ) AND
        `;
    }else{
        caste_column += `
            NULL::TEXT AS lnt3,
        `;
        caste_condition += `
            TRUE AND
        `;
    }

    // GVJ
    if (formData.caste == 'VJ' && formData.gender == 'Male') {
        caste_column += `
            CASE
                WHEN r."GVJS" <> 0 AND r."GVJO" = 0 AND r."GVJH" = 0 THEN r."GVJS"::TEXT
                WHEN c.university = '${formData.homeUniversity}' THEN r."GVJH"::TEXT
                ELSE r."GVJO"::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r."GVJS" <> 0 AND r."GVJO" = 0 AND r."GVJH" = 0 THEN r."GVJS"
                                 WHEN c.university = '${formData.homeUniversity}' THEN r."GVJH"
                                 ELSE r."GVJO"
                             END
                         LIMIT 1), '0'
                    ) || ')' AS gvj,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r."GVJS" <> 0 AND r."GVJO" = 0 AND r."GVJH" = 0 THEN r."GVJS"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."GVJH"
                    ELSE r."GVJO"
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r."GVJS" <> 0 AND r."GVJO" = 0 AND r."GVJH" = 0 THEN r."GVJS"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."GVJH"
                    ELSE r."GVJO"
                END = 0
            ) AND
        `;
    }else{
        caste_column += `
            NULL::TEXT AS gvj,
        `;
        caste_condition += `
            TRUE AND
        `;
    }


    // LVJ
    if (formData.caste == 'VJ' && formData.gender == 'Female') {
        caste_column += `
            CASE
                WHEN r."LVJS" <> 0 AND r."LVJO" = 0 AND r."LVJH" = 0 THEN r."LVJS"::TEXT
                WHEN c.university = '${formData.homeUniversity}' THEN r."LVJH"::TEXT
                ELSE r."LVJO"::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r."LVJS" <> 0 AND r."LVJO" = 0 AND r."LVJH" = 0 THEN r."LVJS"
                                 WHEN c.university = '${formData.homeUniversity}' THEN r."LVJH"
                                 ELSE r."LVJO"
                             END
                         LIMIT 1), '0'
                    ) || ')' AS lvj,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r."LVJS" <> 0 AND r."LVJO" = 0 AND r."LVJH" = 0 THEN r."LVJS"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."LVJH"
                    ELSE r."LVJO"
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r."LVJS" <> 0 AND r."LVJO" = 0 AND r."LVJH" = 0 THEN r."LVJS"
                    WHEN c.university = '${formData.homeUniversity}' THEN r."LVJH"
                    ELSE r."LVJO"
                END = 0
            ) AND
        `;
    }else{
        caste_column += `
            NULL::TEXT AS lvj,
        `;
        caste_condition += `
            TRUE AND
        `;
    }


    // PWD
    if (formData.specialReservation == 'PWD') {
        caste_column += `
            CASE
                WHEN r."PWDOPENS" <> 0 AND r."PWDOPENH" = 0 THEN r."PWDOPENS"::TEXT
                ELSE r."PWDOPENH"::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r."PWDOPENS" <> 0 AND r."PWDOPENH" = 0 THEN r."PWDOPENS"
                                 ELSE r."PWDOPENH"
                             END
                         LIMIT 1), '0'
                    ) || ')' AS pwd,
        `;

        caste_condition += `
            (
                (r."PWDOPENS" BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank} OR r."PWDOPENS" = 0)
                OR (r."PWDOPENH" BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank} OR r."PWDOPENH" = 0)  
            )
            AND 
        `;
    } else{
        caste_column += `
            NULL::TEXT AS pwd,
        `;
        caste_condition += `
            TRUE AND
        `;
    }
    
    // DEF
    if (formData.specialReservation == 'DEF') {
        caste_column += `
            r."DEFOPENS" || ' (' || COALESCE((SELECT m.percentile FROM merit_list AS m WHERE m."Rank" = r."DEFOPENS" LIMIT 1), '0') || ')' AS def,
        `;

        caste_condition += `
            (r."DEFOPENS" BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank} OR r."DEFOPENS" = 0)
            AND
        `;
    }else{
        caste_column += `
            NULL::TEXT AS def,
        `;
        caste_condition += `
            TRUE AND
        `;
    }

    // ORPHAN
    if (formData.specialReservation == 'ORPHAN') {
        caste_column += `
            r."ORPHAN" || ' (' || COALESCE((SELECT m.percentile FROM merit_list AS m WHERE m."Rank" = r."ORPHAN" LIMIT 1), '0') || ')' AS orphan,
        `;
        caste_condition += `
            (r."ORPHAN" BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank} OR r."ORPHAN" = 0)
            AND
        `;
    }else{
        caste_column += `
            NULL::TEXT AS orphan,
        `;
        caste_condition += `
            TRUE AND
        `;
    }

    // console.log("Generated SQL:", caste_column);
    // console.log("caste condition", caste_condition);

    try {
        // First query
        const { data: mhtData, error: mhtError } = await supabase.rpc('pcm_preference_list_mht', {
            homeuniversity: formData.homeuniversity,
            minrank: new_data_of_student.minRank,
            maxrank: new_data_of_student.maxRank,
            caste_column: caste_column,
            caste_condition: caste_condition
        });
        
        if (mhtError) throw mhtError;

        // Second query
        const { data: allIndiaData, error: allIndiaError } = await supabase.rpc('pcm_preference_list_all_india', {
            homeuniversity: formData.homeuniversity,
            minrank: new_data_of_student.allMinRank,
            maxrank: new_data_of_student.allMaxRank,
            caste_column: caste_column,
        });

        if (allIndiaError) throw allIndiaError;

        const all_choices = mhtData.concat(allIndiaData);
        // console.log(all_choices.length);

        const unique_choice = [
            ...new Map(all_choices.map(item=>[item.choice_code, item])).values()
        ];
        // console.log(unique_choice.length);
        const colleges =  college_filter(unique_choice, formData);
        // console.log(colleges.length);
        // console.log(colleges);
        return colleges;

    } catch (error) {
        console.error('Error fetching college data:', error);
        throw error; // Or handle it as you prefer
    }

}

function college_filter_by_city(colleges, city) {
    return colleges.filter(element => city.includes(element.city));
}

function college_filter_by_branch_category(colleges, branch_cat) {
    // return colleges.filter(element => element.branch_category == branch_cat);
    return colleges.filter(element => branch_cat.includes(element.branch_category));
}

function college_fillter_by_selected_branch(colleges, selected_branches) {
    return colleges.filter(element => selected_branches.includes(element.branch_name));
}

function college_filter(colleges, formData) {
    if (formData.city[0] != 'All') {
        colleges = college_filter_by_city(colleges, formData.city);
    }
    
    if (formData.selected_branches.length == 0) {
        if (formData.branchCategories[0] != 'All') {
            colleges = college_filter_by_branch_category(colleges, formData.branchCategories);
        }
    } else {
        colleges = college_fillter_by_selected_branch(colleges, formData.selected_branches);
    }

    // console.log(colleges);
    let college_list = [];

    colleges.forEach(element => {
        if (formData.gender == 'Female') {
            if (element.gopen !== '0 (0)' || element.lopen !== '0 (0)') {
                college_list.push(element);
            }
        } else {
            if (element.gopen !== '0 (0)') {
                if (element.branch_type != 'F') {
                    college_list.push(element);
                }
            }
        }
    });

    return college_list;
}

router.post('/College_list', async (req, res) => {
    const formData = req.body;
    // console.log(formData);

    clear_new_data_function();

    try {

        new_data_of_student.selected_branches_code = await getSelectedBranchCode(formData.selected_branches);
        
        getCasteColumns(formData.caste, formData.gender);
        if (formData.specialReservation != 'No') {
            new_data_of_student.specialReservation = formData.specialReservation;
        }

        new_data_of_student.minRank = 0;
        new_data_of_student.maxRank = formData.generalRank;
        new_data_of_student.allMinRank = 0;
        new_data_of_student.allMaxRank = formData.allIndiaRank;

        let colleges_1 = await getColleges(formData);
        colleges_1.sort((a, b) => a.choice_points - b.choice_points);

        new_data_of_student.minRank = formData.generalRank;
        new_data_of_student.maxRank = 200000;
        new_data_of_student.allMinRank = formData.allIndiaRank;
        new_data_of_student.allMaxRank = 200000;

        let colleges_2 = await getColleges(formData);
        colleges_2.sort((a, b) => b.choice_points - a.choice_points);


        let college_counts = 300;

        let college_counts_2;
        let college_counts_1;
        if(colleges_1.length < (college_counts / 2) && colleges_2.length > (college_counts / 2)){
            college_counts_2 = college_counts - colleges_1.length;
            colleges_2 = colleges_2.slice(0,college_counts_2);
        }else if(colleges_1.length > (college_counts / 2) && colleges_2.length < (college_counts / 2)){
            college_counts_1 = college_counts - colleges_2.length;
            colleges_1 = colleges_1.slice(0,college_counts_1);
        }else if(colleges_1.length < (college_counts / 2) && colleges_2.length < (college_counts / 2)){
            colleges_2 = colleges_2;
            colleges_1 = colleges_1;
        }else{
            college_counts /= 2;
            colleges_2 = colleges_2.slice(0,college_counts);
            colleges_1 = colleges_1.slice(0,college_counts);
        }


        // if(req.session.user.promoCode != ''){
        //     college_counts = 150;
        // }else{
        //     if(req.session.user.payment == '75'){
        //         college_counts = 75;
        //     }else{
        //         college_counts = 150;
        //     }
        // }
        let colleges = [...colleges_1, ...colleges_2];
        colleges.sort((a, b) => b.choice_points - a.choice_points);
        // console.log(colleges);
        res.json(colleges);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch colleges' });
    }
});

router.get('/student_name',async(req,res)=>{
    try {
        const phone = req.session.user.phone;
        const user = await User.findOne({phone_number : phone});
        const Name = user.first_name + ' ' + user.last_name;
        return res.json({name: Name});
    } catch (error) {
        console.log(error);
    }
});

router.post('/savePdf',upload.single('pdf'),async (req,res)=>{
    try {
        const name = JSON.parse(req.body.name);
        const exam = JSON.parse(req.body.exam);
        const is_verified = JSON.parse(req.body.is_verified);
        const pdfBuffer = req.file.buffer; 
        const pdf_id = JSON.parse(req.body.pdfID);
        // console.log(name);
        // console.log(pdfBuffer);
        const phone = req.session.user.phone;
        let isVerified;
        if(is_verified == 'true'){
            isVerified = true;
        }else{
            isVerified = false;
        }
        const promo_code = req.session.user.promoCode;
        const payment = req.session.user.payment;
        const newPreferenceList = new Pdf({
            pdfID: pdf_id,
            isVerified: isVerified,
            phone_number: phone,
            code: promo_code,
            examType: exam,
            payment:payment,
            title: name,
            pdf: pdfBuffer
        });
        await newPreferenceList.save();
        req.session.user.payment = '';
        req.session.user.promoCode = '';
        req.session.pdfID = pdf_id;
        // console.log(req.session.user);
        res.json({ 
            success: true,
            message: 'PDF stored successfully'
        });
    } catch (error) {
        console.error('Error storing PDF:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to store PDF: ' + error.message
        });
    }
    
});
    

module.exports = router;