'use strict';

const suite = require('core/suite');
const payload = require('./assets/lists');
const tools = require('core/tools');
const chakram = require('chakram');
const expect = require('chakram').expect;
const build = (overrides) => Object.assign({}, payload, overrides);
const listsPayload = build({ name: tools.random() });

suite.forElement('marketing', 'lists', { payload: listsPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "name": tools.random(),
        "status": "ACTIVE"
      }
    }
  };
  test.withOptions(options).should.supportCruds(chakram.put);
  test.should.supportNextPagePagination(1);
  test.withName(`should support searching ${test.api} by lists modified date`)
    .withOptions({ qs: { where: `modified_since ='2016-03-11T20:41:42.000Z'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.status = '2016-03-11T20:41:42.000Z');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();

});
