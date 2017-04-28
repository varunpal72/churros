'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

suite.forElement('finance', 'reports', null, (test) => {
  test
    .withName(`should support searching ${test.api} for report Balance Sheet Standard`)
    .withOptions({ qs: { where: `ReportName='Balance Sheet Standard' and ReportPeriodStart = '2016-01-01T00:00:00' and ReportPeriodEnd = '2016-12-31T00:00:00'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      expect(r.body).to.not.be.null;
      expect(r.body.length).to.equal(1);
      expect(r.body[0].ReportTitle).to.equal('Balance Sheet');
      console.log(r.body[0].ReportTitle);
    }).should.return200OnGet();
  test
    .withName(`should support searching ${test.api} for Profit and Loss by Class`)
    .withOptions({ qs: { where: `ReportName='Profit and Loss by Class' and ReportPeriodStart = '2016-01-01T00:00:00' and ReportPeriodEnd = '2016-12-31T00:00:00'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      expect(r.body).to.not.be.null;
      expect(r.body.length).to.equal(1);
      expect(r.body[0].ReportTitle).to.equal('Profit & Loss by Class');
      console.log(r.body[0].ReportTitle);
    }).should.return200OnGet();
  test
    .withName(`should support searching ${test.api} for Sales by Customer Summary`)
    .withOptions({ qs: { where: `ReportName='Sales by Customer Summary' and ReportPeriodStart = '2016-01-01T00:00:00' and ReportPeriodEnd = '2016-12-31T00:00:00'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      expect(r.body).to.not.be.null;
      expect(r.body.length).to.equal(1);
      console.log(r.body[0].ReportTitle);
      expect(r.body[0].ReportTitle).to.equal('Sales by Customer Summary');
    }).should.return200OnGet();
  test
    .withName(`should support searching ${test.api} for Sales by Rep Summary`)
    .withOptions({ qs: { where: `ReportName='Sales by Rep Summary' and ReportPeriodStart = '2016-01-01T00:00:00' and ReportPeriodEnd = '2016-12-31T00:00:00'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      expect(r.body).to.not.be.null;
      expect(r.body.length).to.equal(1);
      console.log(r.body[0].ReportTitle);
      expect(r.body[0].ReportTitle).to.equal('Sales by Rep Summary');
    }).should.return200OnGet();
  test
    .withName(`should support searching ${test.api} for Sales by Item Summary`)
    .withOptions({ qs: { where: `ReportName='Sales by Item Summary' and ReportPeriodStart = '2016-01-01T00:00:00' and ReportPeriodEnd = '2016-12-31T00:00:00'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      expect(r.body).to.not.be.null;
      expect(r.body.length).to.equal(1);
      console.log(r.body[0].ReportTitle);
      expect(r.body[0].ReportTitle).to.equal('Sales by Item Summary');
    }).should.return200OnGet();
  test
    .withName(`should support searching ${test.api} for AP Aging Summary`)
    .withOptions({ qs: { where: `ReportName='AP Aging Summary' and ReportPeriodStart = '2016-01-01T00:00:00' and ReportPeriodEnd = '2016-12-31T00:00:00'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      expect(r.body).to.not.be.null;
      expect(r.body.length).to.equal(1);
      console.log(r.body[0].ReportTitle);
      expect(r.body[0].ReportTitle).to.equal('A/P Aging Summary');
    }).should.return200OnGet();
  test
    .withName(`should support searching ${test.api} for AR Aging Summary`)
    .withOptions({ qs: { where: `ReportName='AR Aging Summary' and ReportPeriodStart = '2016-01-01T00:00:00' and ReportPeriodEnd = '2016-12-31T00:00:00'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      expect(r.body).to.not.be.null;
      expect(r.body.length).to.equal(1);
      console.log(r.body[0].ReportTitle);
      expect(r.body[0].ReportTitle).to.equal('A/R Aging Summary');
    }).should.return200OnGet();
  test
    .withName(`should support searching ${test.api} for Profit and Loss Budget vs. Actual`)
    .withOptions({ qs: { where: `FiscalYear = '2016' and ReportName='Profit and Loss Budget vs. Actual' and ReportPeriodStart = '2016-01-01T00:00:00' and ReportPeriodEnd = '2016-12-31T00:00:00'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      expect(r.body).to.not.be.null;
      expect(r.body.length).to.equal(1);
      console.log(r.body[0].ReportTitle);
      expect(r.body[0].ReportTitle).to.equal('Profit & Loss Budget vs. Actual');
    }).should.return200OnGet();
  test
    .withName(`should support searching ${test.api} for Customer Balance Summary`)
    .withOptions({ qs: { where: `FiscalYear = '2016' and ReportName='Customer Balance Summary' and ReportPeriodStart = '2016-01-01T00:00:00' and ReportPeriodEnd = '2016-12-31T00:00:00'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      expect(r.body).to.not.be.null;
      expect(r.body.length).to.equal(1);
      console.log(r.body[0].ReportTitle);
      expect(r.body[0].ReportTitle).to.equal('Customer Balance Summary');
    }).should.return200OnGet();
  test
    .withName(`should support searching ${test.api} for Sales by Customer Summary`)
    .withOptions({ qs: { where: `FiscalYear = '2016' and ReportName='Sales by Customer Summary' and ReportPeriodStart = '2016-01-01T00:00:00' and ReportPeriodEnd = '2016-12-31T00:00:00'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      expect(r.body).to.not.be.null;
      expect(r.body.length).to.equal(1);
      console.log(r.body[0].ReportTitle);
      expect(r.body[0].ReportTitle).to.equal('Sales by Customer Summary');
    }).should.return200OnGet();
});
