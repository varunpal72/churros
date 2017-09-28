'use strict';

const suite = require('core/suite');
const payload = require('./assets/time-entries');
const expect = require('chakram').expect;
suite.forElement('helpdesk', 'time-entries', { payload: payload }, (test) => {
  test.should.supportCruds();
  test
  .withName(`should support searching ${test.api} by workType `)
  .withOptions({ qs: { where: 'workType = \'Regular\'' } })
  .withValidation((r) => {
  expect(r).to.have.statusCode(200);
  const validValues = r.body.filter(obj => obj.workType='Regular');
  expect(validValues.length).to.equal(r.body.length);
  }).should.return200OnGet();
  test.should.supportPagination('id');
});
