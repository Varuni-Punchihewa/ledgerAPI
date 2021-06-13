const utils = require('../utils/utils');
const LedgerConstants = require('../utils/constants');

const NoOfDaysPerWeek = 7;
const NoOfDaysPerFortnight = 14;

function getLedger(startDate, endDate, frequency, weeklyRent, timeZone) {
    startDate = utils.formatDate(startDate, timeZone);
    endDate = utils.formatDate(endDate, timeZone);
    frequency = frequency.toUpperCase();
    weeklyRent = Number(weeklyRent);

    return getLineItems(frequency, startDate, endDate, weeklyRent);
}

function getLineItems(frequency, startDate, endDate, weeklyRent) {
    let noOfDays = utils.getDurationAsDays(startDate, endDate) + 1;
    let itemsArray;

    if (frequency === LedgerConstants.Frequency.Weekly) {
        itemsArray = _getLineItems(noOfDays, NoOfDaysPerWeek, startDate, weeklyRent);
    } else if (frequency === LedgerConstants.Frequency.Fortnightly) {
        itemsArray = _getLineItems(noOfDays, NoOfDaysPerFortnight, startDate, weeklyRent * 2);
    } else {
        itemsArray = _getMonthlyLineItems(noOfDays, startDate, endDate, weeklyRent);
    }

    return itemsArray;
}

function _getMonthlyLineItems(noOfDays, startDate, endDate, weeklyRent) {
    let itemsArray = [];
    let futureMonth = utils.increaseDate(startDate, LedgerConstants.DatePeriods.Months, 1);
    let daysDifference = utils.getDurationAsDays(startDate, futureMonth);
    let noOfMonths = 1;

    if (noOfDays > daysDifference) {
        while (noOfDays > daysDifference) {
            noOfMonths++;

            futureMonth = utils.increaseDate(startDate, LedgerConstants.DatePeriods.Months, noOfMonths);
            daysDifference = utils.getDurationAsDays(startDate, futureMonth);
        }

        noOfMonths--;

        let nextStartDate;

        for (let monthCount = 1; monthCount <= noOfMonths; monthCount++) {
            let periodicStartDate = monthCount === 1 ? startDate : nextStartDate;

            nextStartDate = utils.increaseDate(startDate, LedgerConstants.DatePeriods.Months, monthCount);

            let periodicEndDate = utils.decreaseDate(nextStartDate, LedgerConstants.DatePeriods.Days, 1);
            let rent = (weeklyRent / NoOfDaysPerWeek) * utils.getDurationAsDays(periodicStartDate, nextStartDate);

            let itemObj = {
                start_date: periodicStartDate,
                end_date: periodicEndDate,
                total_amount: utils.roundUpNumber(rent)
            }

            itemsArray.push(itemObj);
        }

        let lastMonth = utils.increaseDate(startDate, LedgerConstants.DatePeriods.Months, noOfMonths);
        let extraDays = utils.getDurationAsDays(lastMonth, endDate);
        let rent = (weeklyRent / NoOfDaysPerWeek) * extraDays;

        let itemObj = {
            start_date: nextStartDate,
            end_date: endDate,
            total_amount: utils.roundUpNumber(rent)
        }

        itemsArray.push(itemObj);
    } else {
        let remainingRent = (weeklyRent / NoOfDaysPerWeek) * noOfDays;

        let itemObj = {
            start_date: startDate,
            end_date: futureMonth,
            total_amount: utils.roundUpNumber(remainingRent)
        }

        itemsArray.push(itemObj);
    }

    return itemsArray;
}

function _getLineItems(noOfDays, daysInFrequency, startDate, rent) {
    let noOfFrequencies = Math.trunc(noOfDays / daysInFrequency);
    let remainingNoOfDays = noOfDays % daysInFrequency;
    let prevEndDate;
    let itemsArray = [];

    for (let item = 0; item < noOfFrequencies; item++) {
        let periodicStartDate = item === 0 ? startDate : utils.increaseDate(prevEndDate, LedgerConstants.DatePeriods.Days, 1);
        let periodicEndDate = utils.increaseDate(periodicStartDate, LedgerConstants.DatePeriods.Days, daysInFrequency - 1);

        prevEndDate = periodicEndDate;

        let itemObj = {
            start_date: periodicStartDate,
            end_date: periodicEndDate,
            total_amount: utils.roundUpNumber(rent)
        }

        itemsArray.push(itemObj);
    }

    if (remainingNoOfDays !== 0) {
        let remainingRent = (rent / daysInFrequency) * remainingNoOfDays;
        let periodicStartDate = prevEndDate ? utils.increaseDate(prevEndDate, LedgerConstants.DatePeriods.Days, 1) : startDate;
        let periodicEndDate = utils.increaseDate(periodicStartDate, LedgerConstants.DatePeriods.Days, remainingNoOfDays - 1);

        let itemObj = {
            start_date: periodicStartDate,
            end_date: periodicEndDate,
            total_amount: utils.roundUpNumber(remainingRent)
        }

        itemsArray.push(itemObj);
    }

    return itemsArray;
}

module.exports = (function () {
    return {
        getLedger: getLedger
    }
})();