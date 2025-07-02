const express = require('express');
const router = express.Router();
const {db, supabase} = require('../database/db');
const isLoggedIn = require('../middleware/auth');
const {User, promoCode, Pdf ,specialReservation} = require('../database/schema');
const multer = require('multer');
const upload = multer({ limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB limit

router.get('/', isLoggedIn,(req,res)=>{
  res.render('prefernceListPCB');
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



router.get('/fetchcity', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('phamacy_college_info')
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
            .from('phamacy_college_info')
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

    if (formData.generalRank < 2000) {
        subMinRank = 0;
    }else if(formData.generalRank < 7000){
        subMinRank = 2200;
    }else if(formData.generalRank < 15000){
        subMinRank = 2600;
    }else if(formData.generalRank < 23000){
        subMinRank = 3000;
    }else if(formData.generalRank < 30000){
        subMinRank = 4000;
    }else if(formData.generalRank < 35000){
        subMinRank = 4500;
    }else if(formData.generalRank < 40000){
        subMinRank = 5000;
    }else {
        subMinRank = 6000;
    }
    

    minRank -= subMinRank;
    new_data_of_student.minRank = minRank;
    new_data_of_student.maxRank = 100000;


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
            r.EWS || ' (' || COALESCE((SELECT m.percentile FROM pharmacy_merit_list AS m WHERE m."Rank" = r.EWS LIMIT 1), '0') || ')' AS ews,
        `;
        caste_condition += `
            (r.EWS BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank} OR r.EWS = 0)
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
    
    // LOPEN
    if (formData.gender == 'Female') {
        caste_column += `
                CASE
                    WHEN r.LOPENS <> 0 AND r.LOPENH = 0 THEN r.LOPENS::TEXT
                    ELSE r.LOPENH::TEXT
                END || ' (' || COALESCE(
                            (SELECT m.percentile 
                            FROM pharmacy_merit_list AS m 
                            WHERE m."Rank" = 
                                CASE
                                    WHEN r.LOPENS <> 0 AND r.LOPENH = 0 THEN r.LOPENS
                                    ELSE r.LOPENH
                                END
                            LIMIT 1), '0'
                        ) || ')' AS LOPEN,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r.LOPENS <> 0 AND r.LOPENH = 0 THEN r.LOPENS
                    ELSE r.LOPENH
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r.LOPENS <> 0 AND r.LOPENH = 0 THEN r.LOPENS
                    ELSE r.LOPENH
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
                WHEN r.GOBCS <> 0 AND r.GOBCH = 0 THEN r.GOBCS::TEXT
                ELSE r.GOBCH::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM pharmacy_merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r.GOBCS <> 0 AND r.GOBCH = 0 THEN r.GOBCS
                                 ELSE r.GOBCH
                             END
                         LIMIT 1), '0'
                    ) || ')' AS gobc,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r.GOBCS <> 0  AND r.GOBCH = 0 THEN r.GOBCS
                    ELSE r.GOBCH
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r.GOBCS <> 0 AND r.GOBCH = 0 THEN r.GOBCS
                    ELSE r.GOBCH
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
                WHEN r.LOBCS <> 0  AND r.LOBCH = 0 THEN r.LOBCS::TEXT
               
                ELSE r.LOBCH::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM pharmacy_merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r.LOBCS <> 0 AND r.LOBCH = 0 THEN r.LOBCS
                                 ELSE r.LOBCH
                             END
                         LIMIT 1), '0'
                    ) || ')' AS lobc,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r.LOBCS <> 0 AND r.LOBCH = 0 THEN r.LOBCS
                    ELSE r.LOBCH
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r.LOBCS <> 0 AND r.LOBCH = 0 THEN r.LOBCS
                    ELSE r.LOBCH
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
                WHEN r.GSEBCS <> 0  AND r.GSEBCH = 0 THEN r.GSEBCS::TEXT
                ELSE r.GSEBCH::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM pharmacy_merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r.GSEBCS <> 0 AND r.GSEBCH = 0 THEN r.GSEBCS
                                 ELSE r.GSEBCH
                             END
                         LIMIT 1), '0'
                    ) || ')' AS GSEBC,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r.GSEBCS <> 0 AND r.GSEBCH = 0 THEN r.GSEBCS
                    ELSE r.GSEBCH
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r.GSEBCS <> 0  AND r.GSEBCH = 0 THEN r.GSEBCS
                    ELSE r.GSEBCH
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
                WHEN r.LSEBCS <> 0 AND r.LSEBCH = 0 THEN r.LSEBCS::TEXT
                ELSE r.LSEBCH::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM pharmacy_merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r.LSEBCS <> 0  AND r.LSEBCH = 0 THEN r.LSEBCS
                                 ELSE r.LSEBCH
                             END
                         LIMIT 1), '0'
                    ) || ')' AS LSEBC,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r.LSEBCS <> 0 AND r.LSEBCH = 0 THEN r.LSEBCS
                    ELSE r.LSEBCH
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r.LSEBCS <> 0 AND r.LSEBCH = 0 THEN r.LSEBCS
                    ELSE r.LSEBCH
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
                WHEN r.GSTS <> 0 AND r.GSTH = 0 THEN r.GSTS::TEXT
                ELSE r.GSTH::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM pharmacy_merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r.GSTS <> 0  AND r.GSTH = 0 THEN r.GSTS
                                 ELSE r.GSTH
                             END
                         LIMIT 1), '0'
                    ) || ')' AS GST,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r.GSTS <> 0 AND r.GSTH = 0 THEN r.GSTS
                    ELSE r.GSTH
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r.GSTS <> 0 AND r.GSTH = 0 THEN r.GSTS
                    ELSE r.GSTH
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
                WHEN r.LSTS <> 0  AND r.LSTH = 0 THEN r.LSTS::TEXT
                ELSE r.LSTH::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM pharmacy_merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r.LSTS <> 0 AND r.LSTH = 0 THEN r.LSTS
                                 ELSE r.LSTH
                             END
                         LIMIT 1), '0'
                    ) || ')' AS LST,
        `;
        caste_condition += `
            (
                CASE 
                    WHEN r.LSTS <> 0 AND r.LSTH = 0 THEN r.LSTS
                    ELSE r.LSTH
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r.LSTS <> 0  AND r.LSTH = 0 THEN r.LSTS
                    ELSE r.LSTH
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
                WHEN r.GSCS <> 0 AND r.GSCO = 0 AND r.GSCH = 0 THEN r.GSCS::TEXT
                WHEN c.university = '${formData.homeUniversity}' THEN r.GSCH::TEXT
                ELSE r.GSCH::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM pharmacy_merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r.GSCS <> 0 AND r.GSCH = 0 THEN r.GSCS
                                 ELSE r.GSCH
                             END
                         LIMIT 1), '0'
                    ) || ')' AS GSC,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r.GSCS <> 0 AND r.GSCH = 0 THEN r.GSCS
                    ELSE r.GSCH
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r.GSCS <> 0 AND r.GSCH = 0 THEN r.GSCS
                    ELSE r.GSCH
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
                WHEN r.LSCS <> 0 AND r.LSCH = 0 THEN r.LSCS::TEXT
                ELSE r.LSCH::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM pharmacy_merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r.LSCS <> 0 AND r.LSCH = 0 THEN r.LSCS
                                 ELSE r.LSCH
                             END
                         LIMIT 1), '0'
                    ) || ')' AS LSC,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r.LSCS <> 0 AND r.LSCH = 0 THEN r.LSCS
                    ELSE r.LSCH
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r.LSCS <> 0 AND  r.LSCH = 0 THEN r.LSCS
                    ELSE r.LSCO
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
                WHEN r.GNT1S <> 0  AND r.GNT1H = 0 THEN r.GNT1S::TEXT
                ELSE r.GNT1H::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM pharmacy_merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r.GNT1S <> 0  AND r.GNT1H = 0 THEN r.GNT1S
                                 ELSE r.GNT1H
                             END
                         LIMIT 1), '0'
                    ) || ')' AS GNT1,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r.GNT1S <> 0 AND r.GNT1H = 0 THEN r.GNT1S
                    ELSE r.GNT1H
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r.GNT1S <> 0 AND r.GNT1H = 0 THEN r.GNT1S
                    ELSE r.GNT1H
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
                WHEN r.LNT1S <> 0 AND r.LNT1H = 0 THEN r.LNT1S::TEXT
                ELSE r.LNT1H::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM pharmacy_merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r.LNT1S <> 0  AND r.LNT1H = 0 THEN r.LNT1S
                                 ELSE r.LNT1H
                             END
                         LIMIT 1), '0'
                    ) || ')' AS LNT1,
        `;
        caste_condition += `
            (
                CASE 
                    WHEN r.LNT1S <> 0 AND r.LNT1H = 0 THEN r.LNT1S
                    ELSE r.LNT1H
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r.LNT1S <> 0 AND r.LNT1H = 0 THEN r.LNT1S
                    ELSE r.LNT1H
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
                WHEN r.GNT2S <> 0 AND r.GNT2H = 0 THEN r.GNT2S::TEXT
                ELSE r.GNT2H::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM pharmacy_merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r.GNT2S <> 0 AND r.GNT2H = 0 THEN r.GNT2S
                                 ELSE r.GNT2H
                             END
                         LIMIT 1), '0'
                    ) || ')' AS GNT2,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r.GNT2S <> 0  AND r.GNT2H = 0 THEN r.GNT2S
                    ELSE r.GNT2H
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r.GNT2S <> 0  AND r.GNT2H = 0 THEN r.GNT2S
                    ELSE r.GNT2H
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
                WHEN r.LNT2S <> 0 AND r.LNT2H = 0 THEN r.LNT2S::TEXT
                ELSE r.LNT2H::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM pharmacy_merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r.LNT2S <> 0 AND r.LNT2H = 0 THEN r.LNT2S
                                 ELSE r.LNT2H
                             END
                         LIMIT 1), '0'
                    ) || ')' AS LNT2,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r.LNT2S <> 0  AND r.LNT2H = 0 THEN r.LNT2S
                    ELSE r.LNT2H
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r.LNT2S <> 0  AND r.LNT2H = 0 THEN r.LNT2S
                    ELSE r.LNT2H
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
                WHEN r.GNT3S <> 0 AND r.GNT3H = 0 THEN r.GNT3S::TEXT
                ELSE r.GNT3H::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM pharmacy_merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r.GNT3S <> 0 AND r.GNT3H = 0 THEN r.GNT3S
                                 ELSE r.GNT3H
                             END
                         LIMIT 1), '0'
                    ) || ')' AS GNT3,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r.GNT3S <> 0 AND r.GNT3H = 0 THEN r.GNT3S
                    ELSE r.GNT3H
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r.GNT3S <> 0  AND r.GNT3H = 0 THEN r.GNT3S
                    ELSE r.GNT3H
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
                WHEN r.LNT3S <> 0 AND r.LNT3H = 0 THEN r.LNT3S::TEXT
                ELSE r.LNT3H::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM pharmacy_merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r.LNT3S <> 0 AND r.LNT3H = 0 THEN r.LNT3S
                                 ELSE r.LNT3H
                             END
                         LIMIT 1), '0'
                    ) || ')' AS LNT3,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r.LNT3S <> 0  AND r.LNT3H = 0 THEN r.LNT3S
                    ELSE r.LNT3H
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r.LNT3S <> 0 AND r.LNT3H = 0 THEN r.LNT3S
                    ELSE r.LNT3H
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
                WHEN r.GVJS <> 0 AND r.GVJH = 0 THEN r.GVJS::TEXT
                ELSE r.GVJH::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM pharmacy_merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r.GVJS <> 0 AND r.GVJH = 0 THEN r.GVJS
                                 ELSE r.GVJH
                             END
                         LIMIT 1), '0'
                    ) || ')' AS GVJ,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r.GVJS <> 0 AND r.GVJH = 0 THEN r.GVJS
                    ELSE r.GVJH
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r.GVJS <> 0 AND r.GVJH = 0 THEN r.GVJS
                    ELSE r.GVJH
                END = 0
            ) AND
        `;
    }else{
        caste_column += `
            NULL::TEXT AS GVJ,
        `;
        caste_condition += `
            TRUE AND
        `;
    }

    // LVJ
    if (formData.caste == 'VJ' && formData.gender == 'Female') {
        caste_column += `
            CASE
                WHEN r.LVJS <> 0 AND r.LVJH = 0 THEN r.LVJS::TEXT
                ELSE r.LVJH::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM pharmacy_merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r.LVJS <> 0  AND r.LVJH = 0 THEN r.LVJS
                                 ELSE r.LVJH
                             END
                         LIMIT 1), '0'
                    ) || ')' AS LVJ,
        `;

        caste_condition += `
            (
                CASE 
                    WHEN r.LVJS <> 0  AND r.LVJH = 0 THEN r.LVJS
                    ELSE r.LVJH
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r.LVJS <> 0 AND r.LVJH = 0 THEN r.LVJS
                    ELSE r.LVJH
                END = 0
            ) AND
        `;
    }else{
        caste_column += `
            NULL::TEXT AS LVJ,
        `;
        caste_condition += `
            TRUE AND
        `;
    }

    // PWD
    if (formData.specialReservation == 'PWD') {
        // caste_column += `
        //     CASE
        //         WHEN r.PWDOPENS <> 0 AND r.PWDOPENH = 0 THEN r.PWDOPENS::TEXT
        //         ELSE r.PWDOPENH::TEXT
        //     END || ' (' || COALESCE(
        //                 (SELECT m.percentile 
        //                 pharmacy_merit_list AS m WHERE m."Rank" = 
        //                      CASE
        //                          WHEN r.PWDOPENS <> 0 AND r.PWDOPENH = 0 THEN r.PWDOPENS
        //                          ELSE r.PWDOPENH
        //                      END
        //                  LIMIT 1), '0'
        //             ) || ')' AS pwd,
        // `;

        caste_column += `
            CASE
                WHEN r.PWDOPENS <> 0 AND r.PWDOPENH = 0 THEN r.PWDOPENS::TEXT
                ELSE r.PWDOPENH::TEXT
            END || ' (' || COALESCE(
                        (SELECT m.percentile 
                         FROM pharmacy_merit_list AS m 
                         WHERE m."Rank" = 
                             CASE
                                 WHEN r.PWDOPENS <> 0 AND r.PWDOPENH = 0 THEN r.PWDOPENS
                                 ELSE r.PWDOPENH
                             END
                         LIMIT 1), '0'
                    ) || ')' AS pwd,
        `;

        // caste_condition += `
        //     (
        //         (r.PWDOPENS BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank} OR r.PWDOPENS = 0)
        //         OR (r.PWDOPENH BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank} OR r.PWDOPENH = 0)  
        //     )
        //     AND 
        // `;

        caste_condition += `
            (
                CASE 
                    WHEN r.PWDOPENS <> 0 AND r.PWDOPENH = 0 THEN r.PWDOPENS
                    ELSE r.PWDOPENH
                END BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank}
                OR 
                CASE 
                    WHEN r.PWDOPENS <> 0 AND r.PWDOPENH = 0 THEN r.PWDOPENS
                    ELSE r.PWDOPENH
                END = 0
            ) AND
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
            r.DEFOPENS || ' (' || COALESCE((SELECT m.percentile FROM pharmacy_merit_list AS m WHERE m."Rank" = r.DEFOPENS LIMIT 1), '0') || ')' AS def,
        `;

        caste_condition += `
            (r.DEFOPENS BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank} OR r.DEFOPENS = 0)
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
            r.ORPHAN || ' (' || COALESCE((SELECT m.percentile FROM pharmacy_merit_list AS m WHERE m."Rank" = r.ORPHAN LIMIT 1), '0') || ')' AS orphan,
        `;
        caste_condition += `
            (r.ORPHAN BETWEEN ${new_data_of_student.minRank} AND ${new_data_of_student.maxRank} OR r.ORPHAN = 0)
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

    // let table_name = `cap_${formData.round}`;

    // console.log("Generated SQL:", caste_column);
    // console.log("caste condition", caste_condition);
    try {
        const { data, error } = await supabase.rpc('pcb_preference_list_pharmacy', {
                homeuniversity: formData.homeuniversity,
                minrank: new_data_of_student.minRank,
                maxrank: new_data_of_student.maxRank,
                caste_column: caste_column,
                caste_condition: caste_condition
            });
        
        if(error){
            console.log(error);
        }else{
            
            // console.log(data);
            const colleges =  college_filter(data, formData);
            colleges.sort((a, b) => b.choice_points - a.choice_points);
            // console.log(colleges);
            return colleges;
        }
               
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ 
            error: 'Internal server error',
            message: err.message 
        });
    }
}

function college_filter_by_city(colleges, city) {
    return colleges.filter(element => city.includes(element.city));
}

function college_filter_by_branch_category(colleges, branch_cat) {
    return colleges.filter(element => branch_cat.includes(element.branch_category));
}


function college_filter(colleges, formData) {
    if (formData.city[0] != 'All') {
        colleges = college_filter_by_city(colleges, formData.city);
    }
    
    if (formData.branchCategories[0] != 'All') {
       
        colleges = college_filter_by_branch_category(colleges, formData.branchCategories);
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
        calculateRankRange(formData);

        getCasteColumns(formData.caste, formData.gender);
       
        let colleges = await getColleges(formData);

        colleges.sort((a, b) => b.choice_points - a.choice_points);
        let college_counts;
        if(req.session.user.promoCode != ''){
            college_counts = 150;
        }else{
            if(req.session.user.payment == '75'){
                college_counts = 75;
            }else{
                college_counts = 150;
            }
        }

        colleges = colleges.slice(0,college_counts);
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
        const pdfBuffer = req.file.buffer; // Access the uploaded file buffer

        // console.log(name);
        // console.log(pdfBuffer);
        const phone = req.session.user.phone;
    
        const promo_code = req.session.user.promoCode;
        const payment = req.session.user.payment;
        const newPreferenceList = new Pdf({
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