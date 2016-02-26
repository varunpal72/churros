'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;
const options = {
  qs: {}
};

suite.forElement('ecommerce', 'reports', null, (test) => {
  it('should allow retrieval of reports and report names', () => {
    let reportName;
    return cloud.get('/hubs/ecommerce/reports/names')
      .then(r => {
        expect(r.body.reports).to.not.be.empty;
        expect(r).to.have.statusCode(200);
        reportName = r.body.reports[0];
      })
      .then(r => {
        options.qs.reportName = reportName;
        return cloud.withOptions(options).get('/hubs/ecommerce/reports');
      })
      .then(r => {
        expect(r).to.have.statusCode(200);
        expect(r.body).to.be.a('object');
      });
  });
});