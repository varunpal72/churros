'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const cloud = require('core/cloud')

suite.forElement('expense', 'payments-digest', null, (test) => {
    it('should support Sr for /hubs/expense/payments', () => {
        let id;
        return cloud.withOptions({ qs: { where: `approvalStatus='R_NOTF'` } }).get(test.api)
            .then(r => id = r.body[0].ID)
            .then(r => cloud.get(`${test.api}/${id}`));
    });
    test
        .withName(`should support searching ${test.api} by approvalStatus`)
        .withOptions({ qs: { where: `approvalStatus='R_NOTF'` } })
        .withValidation((r) => {
            expect(r).to.have.statusCode(200);
            const validValues = r.body.filter(obj => obj.ApprovalStatusCode === 'R_NOTF');
            expect(validValues.length).to.equal(r.body.length);
        }).should.return200OnGet();

});
