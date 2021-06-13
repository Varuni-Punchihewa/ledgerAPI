const moment = require('moment-timezone');
const LedgerConstants = require('./constants');

/* *
 * Round up number to two decimal places
 * @param num Number to round up
 * @returns round up number to two decimal places
 */
function roundUpNumber(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

/* *
 * Checks whether a date is valid date in ISO format, and if true returns the formatted date with the timezone
 * @param date, String, to format
 * @param zone, String, time zone
 * @returns formatted date if it's a valid date, boolean value false otherwise
 */
function formatDate(date, zone) {
    let isDateInISOFormat = isValidISODate(date);

    if (isDateInISOFormat) {
        let formattedDate = moment(date);

        return isAvailable(zone) ? formattedDate.tz(zone).toISOString() : formattedDate.toISOString();
    } else {
        return false;
    }
}

/* *
 * Get the difference between two dates in days
 * @param startDate, valid Date format, Start Date
 * @param endDate, valid Date format, End Date 
 * @returns difference between the two given dates in days
 */
function getDurationAsDays(startDate, endDate) {
    return moment.duration(moment(endDate).diff(startDate)).asDays();
}

/* *
 * Add Days/Months to the given date
 * @param startDate, valid Date format, Start Date
 * @param type, valid date period, Date period
 * @param amount, Number, how many days/months to be incremented to the Start Date
 * @returns a new date after adding the given date period
 */
function increaseDate(startDate, type, amount) {
    let period = type === LedgerConstants.DatePeriods.Months ? LedgerConstants.DatePeriods.Months : LedgerConstants.DatePeriods.Days;

    return moment(startDate).add(amount, period).toISOString();
}

/* *
 * Subtract Days/Months to the given date
 * @param startDate, valid Date format, Start Date
 * @param type, valid date period, Date period
 * @param amount, Number, how many days/months to be decremented from the Start Date 
 * @returns a new date after subtracting the given date period
 */
function decreaseDate(startDate, type, amount) {
    let period = type === LedgerConstants.DatePeriods.Months ? LedgerConstants.DatePeriods.Months : LedgerConstants.DatePeriods.Days;

    return moment(startDate).subtract(amount, period).toISOString();
}

/* *
 * Checks whether Date is a valid Date in ISO format
 * @param date, Date to validate
 * @returns {boolean} True if valid ISO date, false otherwise
 */
function isValidISODate(date) {
    return moment(date, moment.ISO_8601).isValid();
}

/* *
 * Checks whether string is a valid number
 * @param str String to validate
 * @returns {boolean} True if string is a number, false otherwise
 */
function isANumber(str) {
    return /^\d+$/.test(str);
}

/* *
 * Checks whether string is undefined, null or empty
 * @param value String to validate
 * @returns {boolean} True if string is not undefined, not null and not empty, false otherwise
 */
function isAvailable(value) {
    let valid = false;

    if (value !== undefined && value !== null) {
        if (value.trim) {
            valid = value.trim() !== '';
        } else {
            valid = true;
        }
    }

    return valid;
};

/* *
 * Checks whether frequency is valid
 * @param frequency String to validate
 * @returns {boolean} True if string is a valid frequency type, false otherwise
 */
function validateFrequency(frequency) {
    let isValidated = false;

    frequency = frequency.toUpperCase();

    for (let key in LedgerConstants.Frequency) {
        if (LedgerConstants.Frequency[key] === frequency) {
            isValidated = true;
        }
    }

    return isValidated;
}

/* *
 * Checks whether time zone is valid
 * @param timezone String to validate
 * @returns {boolean} True if string is a valid time zone type, false otherwise
 */
function validateTimeZone(timezone) {
    return isAvailable(timezone) && moment.tz.zone(timezone);
}

module.exports = (function () {
    return {
        roundUpNumber: roundUpNumber,
        formatDate: formatDate,
        getDurationAsDays: getDurationAsDays,
        increaseDate: increaseDate,
        decreaseDate: decreaseDate,
        isValidISODate: isValidISODate,
        isANumber: isANumber,
        isAvailable: isAvailable,
        validateFrequency: validateFrequency,
        validateTimeZone: validateTimeZone
    }
})();