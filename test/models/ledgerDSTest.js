const assert = require('chai').assert;
const ledger = require('../../models/ledger-data-store');
const utils = require('../../utils/utils');

let resultArr = ledger.getLedger('2020-03-28', '2020-05-27', 'fortnightly', 555);
let resultArrForInconsistentMonths = ledger.getLedger('2020-08-31', '2020-11-15', 'monthly', 555, 'America/Los_Angeles');

describe('Ledger Data Store', function () {
    it('Line Items should be an array', function () {
        assert.isArray(resultArr, 'Expected an array to be returned');
    });

    it('Total Amount of the Line Item should be numeric', function () {
        resultArr.forEach(item => {
            assert.isNumber(item.total_amount, 'Expected total amount to be numeric');
        });
    });

    it('A Line Item should have a start date, end date & total amount', function () {
        resultArr.forEach(item => {
            assert.hasAllKeys(item, ['start_date', 'end_date', 'total_amount']);
        });
    });

    it('A lease started on 2020-03-28 & ends on 2020-05-27, paid fortnightly basis $555 per week', function () {
        let expectedArr = [
            {
                start_date: utils.formatDate('2020-03-28', 'America/Los_Angeles'),
                end_date: utils.formatDate('2020-04-10'),
                total_amount: 1110
            },
            {
                start_date: utils.formatDate('2020-04-11'),
                end_date: utils.formatDate('2020-04-24'),
                total_amount: 1110
            },
            {
                start_date: utils.formatDate('2020-04-25'),
                end_date: utils.formatDate('2020-05-08'),
                total_amount: 1110
            },
            {
                start_date: utils.formatDate('2020-05-09'),
                end_date: utils.formatDate('2020-05-22'),
                total_amount: 1110
            },
            {
                start_date: utils.formatDate('2020-05-23'),
                end_date: utils.formatDate('2020-05-27'),
                total_amount: 396.43
            }
        ]

        resultArr.forEach((item, index) => {
            assert.deepEqual(item, expectedArr[index]);
        });
    });

    it('A payment frequency of monthly starting on 31st August should have the next payment on 30th Sept', function () {
        let actualNextLineItemStartDate = resultArrForInconsistentMonths[1].start_date;
        let expectedNextLineItemStartDate = utils.formatDate('2020-09-30');

        assert.strictEqual(actualNextLineItemStartDate, expectedNextLineItemStartDate, 'Dates should be strictly equal');
    });

    it('A payment frequency of monthly starting on 31st August should have the third payment on 31st Oct', function () {
        let actualNextLineItemStartDate = resultArrForInconsistentMonths[2].start_date;
        let expectedNextLineItemStartDate = utils.formatDate('2020-10-31');

        assert.strictEqual(actualNextLineItemStartDate, expectedNextLineItemStartDate, 'Dates should be strictly equal');
    });
});