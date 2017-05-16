'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const expect = require('chakram').expect;
const salesRulePost = require(`./assets/sales-rules`);

const customerGroups = () => ({
  "group": {
    "code": tools.random()
  }
});

suite.forElement('ecommerce', 'sales-rules', { payload: salesRulePost }, (test) => {
  let ruleId, customerGroupId, name;

  it(`should allow CRUDS for ${test.api}`, () => {
    salesRulePost.rule.name = tools.random();
    return cloud.post(`/hubs/ecommerce/customer-groups`, customerGroups())
      .then(r => {
        customerGroupId = r.body.id;
        salesRulePost.rule.customer_group_ids[0] = customerGroupId;
      })
      .then(r => cloud.post(test.api, salesRulePost))
      .then(r => {
        name = r.body.name;
        ruleId = r.body.id;
      })
      .then(r => cloud.get(`${test.api}/${ruleId}`))
      .then(r => cloud.patch(`${test.api}/${ruleId}`, salesRulePost))
      .then(r => cloud.delete(`${test.api}/${ruleId}`))
      .then(r => cloud.delete(`/hubs/ecommerce/customer-groups/${customerGroupId}`));
  });
  test
    .withName(`should support searching ${test.api} by name`)
    .withOptions({ qs: { where: `name='${name}'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.name === '${name}');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
  test.should.supportPagination();
});
