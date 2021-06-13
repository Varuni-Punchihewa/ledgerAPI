const express = require('express');
const router = express.Router();
const dataStore = require('../models/ledger-data-store');
const utils = require('../utils/utils');
const lang = require('../models/shared/language/language-data-store');

// Get data
router.get('/', (req, res) => {
    ({ start_date, end_date, frequency, weekly_rent, timezone } = req.query);

    let isParamsValidated = validateParams(start_date, end_date, frequency, weekly_rent, timezone);

    if (isParamsValidated === true) {
        let ledgerItems = dataStore.getLedger(start_date, end_date, frequency, weekly_rent, timezone);

        res.json(ledgerItems);
    } else {
        res.send(isParamsValidated);
    }
});

function validateParams(start_date, end_date, frequency, weekly_rent, timezone) {
    let errorMessage = [];
    let isStartDateValidated = utils.formatDate(start_date, timezone);
    let isEndDateValidated = utils.formatDate(end_date, timezone);
    let isFrequencyValidated = utils.validateFrequency(frequency);
    let isWeeklyRentValidated = utils.isANumber(weekly_rent);
    let isTimeZoneValidated = utils.validateTimeZone(timezone);

    if (isStartDateValidated === false) {
        errorMessage.push(lang.messages.invalidDate);
    }

    if (isEndDateValidated === false) {
        errorMessage.push(lang.messages.invalidDate);
    }

    if (!isFrequencyValidated) {
        errorMessage.push(lang.messages.invalidFrequency);
    }

    if (!isWeeklyRentValidated) {
        errorMessage.push(lang.messages.invalidRent);
    }

    if (!isTimeZoneValidated) {
        errorMessage.push(lang.messages.invalidTimeZone);
    }

    if (errorMessage.length !== 0) {
        return errorMessage;
    } else {
        return true;
    }
}

module.exports = router;