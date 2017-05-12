'use strict';

const suite = require('core/suite');
const payload = require('./assets/opportunities');
const tools = require('core/tools');
const chakram = require('chakram');
const expect = require('chakram').expect;
const build = (overrides) => Object.assign({}, payload, overrides);
const oppPayload = build({ Oppo_Description: tools.random(), Oppo_Note: tools.random() });

suite.forElement('crm', 'opportunities', { payload: oppPayload }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "Oppo_Description": tools.random()
      }
    }
  };
  test.withOptions(options).should.supportCruds();
  test.withOptions(options).should.supportCruds(chakram.put);
  test.should.supportNextPagePagination(1);
  test.withName(`should support searching ${test.api} by Opportunity status`)
    .withOptions({ qs: { where: `Oppo_Status ='Won'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.Oppo_Status = 'Won');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
});
