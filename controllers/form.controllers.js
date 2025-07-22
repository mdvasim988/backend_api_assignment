import db from "../db/index.js"

async function handleCreateWheelSpecification(req, res) 
{ 
    try
    {
        const { formNumber, submittedBy, submittedDate, fields } = req.body;

        const existing = await db.oneOrNone('SELECT id FROM wheel_specification WHERE form_number = $1', [formNumber]);
        if (existing) 
        {
            return res.status(409).json({
                success: false,
                message: "Form with this formNumber already exists."
            });
        }

        const wheel = await db.one( 'INSERT INTO wheel_specification(form_number, submitted_by, submitted_date) VALUES($1, $2, $3) RETURNING id',
            [formNumber, submittedBy, submittedDate]);

        await db.none(`INSERT INTO wheel_measurements(wheel_id, tread_diameter_new, last_shop_issue_size, condemning_diameter, wheel_gauge, 
            variation_same_axle_mm, variation_same_bogie_mm, variation_same_coach_mm, flange_thickness, intermediate_wwp_range, bearing_seat_diameter_range, 
            roller_bearing_outer_diameter, roller_bearing_bore_diameter, roller_bearing_width, axle_box_housing_bore_diameter, wheel_disc_width) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,[ wheel.id, fields.treadDiameterNew, fields.lastShopIssueSize, 
                fields.condemningDia, fields.wheelGauge, fields.variationSameAxle, fields.variationSameBogie, fields.variationSameCoach, fields.wheelProfile, 
                fields.intermediateWWP, fields.bearingSeatDiameter, fields.rollerBearingOuterDia, fields.rollerBearingBoreDia, fields.rollerBearingWidth, 
                fields.axleBoxHousingBoreDia, fields.wheelDiscWidth ]);


        res.status(201).json({
            "success": true,
            "message": "Wheel specification submitted successfully.",
            "data": {
                "formNumber": formNumber,
                "status": "Saved",
                "submittedBy": submittedBy,
                "submittedDate": submittedDate
            }
        });
    }
    catch(err)
    {
        res.status(500).json({ message : "Internal Server error", errm: err.message });
    }   
}

async function handleGetWheelSpecifications(req, res) 
{
    try 
    {
        const qParams = req.query;
        const qconditions = [];
        const values = [];

        if (qParams.formNumber) 
        {
            values.push(qParams.formNumber);
            qconditions.push('ws.form_number = $' + values.length);
        }
        if (qParams.submittedBy) 
        {
            values.push(qParams.submittedBy);
            qconditions.push('ws.submitted_by = $' + values.length);
        }
        if (qParams.submittedDate) 
        {
            values.push(qParams.submittedDate);
            qconditions.push('ws.submitted_date = $' + values.length);
        }

        const whereClause = qconditions.length ? 'WHERE ' + qconditions.join(' AND ') : '';
        const query = `SELECT ws.id AS wheel_id,ws.form_number,ws.submitted_by,ws.submitted_date,wm.* FROM wheel_specification ws
                      JOIN wheel_measurements wm ON wm.wheel_id = ws.id ${whereClause}`;

        const resultset = await db.any(query, values);
        if (!resultset.length) 
        {
            return res.status(404).json({
                success: false,
                message: 'No wheel specification forms found.',
            });
        }

        const results = resultset.map((row) => {
            const { wheel_id, form_number, submitted_by, submitted_date, id, wheel_id: _, ...fields } = row;
            return {
                formNumber: form_number,
                submittedBy: submitted_by,
                submittedDate: submitted_date instanceof Date ? submitted_date.toLocaleDateString("en-CA").split('T')[0] : submitted_date,
                fields
            };
        });

        res.status(200).json({
            success: true,
            message: 'Filtered wheel specification forms fetched successfully.',
            data: results
        });

    } 
    catch (err) 
    {
        res.status(500).json({
        message: 'Internal server error',
        errm: err.message,
        });
    }
}

async function handleCreateBogieChecksheet(req, res) 
{
    try
    {
        const { formNumber, inspectionBy, inspectionDate, bogieDetails, bogieChecksheet, bmbcChecksheet } = req.body;

        const existing = await db.oneOrNone(`SELECT id FROM bogie_forms WHERE form_number = $1`, [formNumber]);
        if (existing) 
        {
            return res.status(409).json({
                success: false,
                message: "Form with this formNumber already exists."
            });
        }

        const form = await db.one( 'INSERT INTO bogie_forms(form_number, inspection_by, inspection_date) VALUES($1, $2, $3) RETURNING id',
            [formNumber, inspectionBy, inspectionDate]);

        await db.none(`INSERT INTO bogie_details (form_id, bogie_no, date_of_ioh, deficit_components, incoming_div_and_date, maker_year_built) 
            VALUES ($1, $2, $3, $4, $5, $6)`,[ form.id, bogieDetails.bogieNo, bogieDetails.dateOfIOH, bogieDetails.deficitComponents, bogieDetails.incomingDivAndDate,
                bogieDetails.makerYearBuilt ]);

        await db.none(`INSERT INTO bmbc_checksheet (form_id, adjusting_tube, cylinder_body, piston_trunnion, plunger_spring) VALUES ($1, $2, $3, $4, $5)`,
            [ form.id, bmbcChecksheet.adjustingTube, bmbcChecksheet.cylinderBody, bmbcChecksheet.pistonTrunnion, bmbcChecksheet.plungerSpring ]);

        await db.none(`INSERT INTO bogie_checksheet (form_id, axle_guide, bogie_frame_condition, bolster, bolster_suspension_bracket, lower_spring_seat) 
            VALUES ($1, $2, $3, $4, $5, $6)`, [form.id, bogieChecksheet.axleGuide, bogieChecksheet.bogieFrameCondition, bogieChecksheet.bolster,
                bogieChecksheet.bolsterSuspensionBracket, bogieChecksheet.lowerSpringSeat]);

        res.status(201).json({
            "success": true,
            "message": "Bogie checksheet submitted successfully.",
            "data": {
                "formNumber": formNumber,
                "inspectionBy": inspectionBy,
                "inspectionDate": inspectionDate,
                "status": "Saved"
            }
        });
    }
    catch(err) 
    {
        res.status(500).json({ message : "Internal server error", errm: err.message });
    }   
}

export default {
    handleGetWheelSpecifications,
    handleCreateWheelSpecification,
    handleCreateBogieChecksheet
}