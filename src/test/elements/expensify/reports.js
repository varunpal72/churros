'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

const options = {
  qs: {
    where: "startDate='2016-01-01'",
    pageSize: 1
  }
};

suite.forElement('payment', 'reports', {}, (test) => {

  it('should allow retrieval of reports and change status to reiumbursed', () => {
    return cloud.withOptions(options).get('/hubs/payment/reports')
      .then(r => {
        expect(r.body).to.not.be.empty;
        return cloud.patch('/hubs/payment/reports/'+r.body[0].id+'/status-reimbursed');
      });
  });
});
