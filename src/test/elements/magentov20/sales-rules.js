'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

const salesRulePost = (customerGroupId, autoGen) => ({
  "rule": {
    "name": tools.random(),
    "website_ids": [
      1
    ],
    "customer_group_ids": [
      customerGroupId
    ],
    "uses_per_customer": 0,
    "is_active": true,
    "condition": {
      "condition_type": "Magento\\SalesRule\\Model\\Rule\\Condition\\Combine",
      "aggregator_type": "all",
      "value": "1",
      "conditions": [
        {}
      ],
      "extension_attributes": {}
    },
    "action_condition": {
      "condition_type": "Magento\\SalesRule\\Model\\Rule\\Condition\\Product\\Combine",
      "aggregator_type": "all",
      "value": "1",
      "conditions": [
        {}
      ],
      "extension_attributes": {}
    },
    "stop_rules_processing": false,
    "is_advanced": true,
    "sort_order": 0,
    "simple_action": "by_percent",
    "discount_amount": 0,
    "discount_step": 0,
    "apply_to_shipping": false,
    "times_used": 0,
    "is_rss": true,
    "coupon_type": "SPECIFIC_COUPON",
    "use_auto_generation": autoGen,
    "uses_per_coupon": 0,
    "simple_free_shipping": "0",
    "extension_attributes": {}
  }
});

const customerGroups = () => ({
  "group": {
    "code": tools.random()
  }
});

suite.forElement('ecommerce', 'sales-rules', (test) => {
  let customerGroupId,ruleId,name;
  it(`should allow CRUDS for ${test.api}`, () => {
    let autoGen = false;
    return cloud.post(`/hubs/ecommerce/customer-groups`, customerGroups())
      .then(r => customerGroupId = r.body.id)
      .then(r => cloud.post(test.api, salesRulePost(customerGroupId, autoGen)))
      .then(r =>{ name = r.body.name; ruleId = r.body.rule_id;})
      .then(r => cloud.get(`${test.api}/${ruleId}`))
      .then(r => cloud.patch(`${test.api}/${ruleId}`,salesRulePost(customerGroupId, autoGen)))
      .then(r => cloud.delete(`${test.api}/${ruleId}`))
      .then(r => cloud.delete(`/hubs/ecommerce/customer-groups/${customerGroupId}`));
  });
  test
   .withName(`should support searching ${test.api} by name`)
   .withOptions({ qs: { where: `name='${name}'`} })
   .withValidation((r) => {
   expect(r).to.have.statusCode(200);
   const validValues = r.body.filter(obj => obj.name === '${name}');
   expect(validValues.length).to.equal(r.body.length);
   }).should.return200OnGet();
  test.should.supportPagination();
});
