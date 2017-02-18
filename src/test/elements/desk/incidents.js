'use strict';

const suite = require('core/suite');
const payload = require('./assets/incidents');
const chakram = require('chakram');
const expect = chakram.expect;

const incidentsUpdate = () => ({
  "subject": "Updated",
  "status": "pending",
  "custom_fields": {
    "level": "super"
  }
});

const options = { churros: { updatePayload: incidentsUpdate() } };

suite.forElement('helpdesk', 'incidents', { payload: payload }, (test) => {
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by email`)
    .withOptions({ qs: { where: 'email=\'support@desk.com\'' } })
    .withValidation((r) => expect(r.body).to.not.be.empty)
    .should.return200OnGet();
  test
    .withName(`should not support searching ${test.api} by updated_at using equals`)
    .withOptions({ qs: { where: 'updated_at=\'2015-10-22T16:40:10Z\'' } })
    .withValidation((r) => expect(r).to.have.statusCode(400))
    .should.return200OnGet();
});
