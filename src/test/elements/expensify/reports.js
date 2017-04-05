'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/reports');
const expect = require('chakram').expect;

const options = {
  qs: {
    where: "startDate='2016-01-01'",
    pageSize: 1
  }
};

suite.forElement('payment', 'reports', { payload: payload }, (test) => {

   it(`should support CS for reports and PATCH /{test.api}/:reportID/status-reimbursed`, () => {
    return cloud.withOptions(options).get('/hubs/payment/reports')
      .then(r => cloud.post(test.api, payload))
      .then(r => {
        expect(r.body).to.not.be.empty;
        return cloud.patch(`/hubs/payment/reports/${r.body.id}/status-reimbursed`);
      });
  });
});
