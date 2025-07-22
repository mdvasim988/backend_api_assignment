function wheelSpecsValidation(req, res, next) 
{
    const requiredFields = [
        'treadDiameterNew',
        'lastShopIssueSize',
        'condemningDia',
        'wheelGauge',
        'variationSameAxle',
        'variationSameBogie',
        'variationSameCoach',
        'wheelProfile',
        'intermediateWWP',
        'bearingSeatDiameter',
        'rollerBearingOuterDia',
        'rollerBearingBoreDia',
        'rollerBearingWidth',
        'axleBoxHousingBoreDia',
        'wheelDiscWidth'
    ];

    const { formNumber, submittedBy, submittedDate, fields } = req.body;
    if (!formNumber || !submittedBy || !submittedDate || !fields) 
    {
        return res.status(400).json({
            success: false,
            message: "Missing required top-level fields (formNumber, submittedBy, submittedDate, fields)."
        });
    }

    const missingFields = requiredFields.filter(key => !fields[key]);
    if (missingFields.length > 0) 
    {
        return res.status(400).json({
            success: false,
            message: `Missing required measurement fields: ${missingFields.join(', ')}`
        });
    }

    return next();
}

function bogieChecksheetValidation(req, res, next) 
{    
    const { formNumber, inspectionBy, inspectionDate, bogieDetails, bogieChecksheet, bmbcChecksheet } = req.body;
    if (!formNumber || !inspectionBy || !inspectionDate || !bogieDetails || !bogieChecksheet || !bmbcChecksheet) 
    {
        return res.status(400).json({
            success: false,
            message: "Missing required top-level fields."
        });
    }

    const bogieDetailFields = ['bogieNo', 'dateOfIOH', 'deficitComponents', 'incomingDivAndDate', 'makerYearBuilt'];
    const missingBogieDetails = bogieDetailFields.filter(key => !bogieDetails[key]);

    const bogieChecksheetFields = ['axleGuide', 'bogieFrameCondition', 'bolster', 'bolsterSuspensionBracket', 'lowerSpringSeat'];
    const missingBogieChecksheet = bogieChecksheetFields.filter(key => !bogieChecksheet[key]);

    const bmbcFields = ['adjustingTube', 'cylinderBody', 'pistonTrunnion', 'plungerSpring'];
    const missingBMBC = bmbcFields.filter(key => !bmbcChecksheet[key]);

    const allMissing = [
    ...missingBogieDetails.map(f => `bogieDetails.${f}`),
    ...missingBogieChecksheet.map(f => `bogieChecksheet.${f}`),
    ...missingBMBC.map(f => `bmbcChecksheet.${f}`)
    ];

    if (allMissing.length > 0) 
    {
        return res.status(400).json({
            success: false,
            message: `Missing required nested fields: ${allMissing.join(', ')}`
        });
    }

    return next();
}

export {
    wheelSpecsValidation,
    bogieChecksheetValidation
}