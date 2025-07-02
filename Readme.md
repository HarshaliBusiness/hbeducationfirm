const hashPassword = await bcrypt.hash(userData.password, 10);

promocode : NDkyZTk3ZjE


sudo nano /etc/nginx/conf.d/69.62.73.167.conf

sudo nginx -t

sudo systemctl restart nginx

cd /path/to/your/mvc/project

git pull origin main

pm2 restart all


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

    let table_name = `cap_${formData.round}`;

    // console.log("Generated SQL:", caste_column);
    // console.log("caste condition", caste_condition);

    try {
        const { data, error } = await supabase.rpc('get_branch_choices', {
            homeuniversity: formData.homeuniversity,
            minrank: new_data_of_student.minRank,
            maxrank: new_data_of_student.maxRank,
            table_name: table_name,
            caste_column: caste_column,
            caste_condition: caste_condition
            });
        
        if(error){
            console.log(error);
        }else{
            
            const colleges =  college_filter(data, formData);
            colleges.sort((a, b) => b.points - a.points);
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