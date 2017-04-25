'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');

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

const couponGenerate = (ruleId) => ({
  "couponSpec": {
    "rule_id": ruleId,
    "quantity": 5,
    "length": 5
  }
});

const couponPost = (ruleId) => ({
  "coupon": {
    "rule_id": ruleId,
    "code": tools.random(),
    "usage_limit": 0,
    "usage_per_customer": 0,
    "times_used": 0,
    "is_primary": false,
    "type": 0
  }
});

const deleteByCodes = (couponCodes) => ({
  "codes": couponCodes,
  "ignoreInvalidCoupons": true
});

const deleteByIds = (couponId) => ({
  "ids": [
    couponId
  ],
  "ignoreInvalidCoupons": true
});

const customerGroups = () => ({
  "group": {
    "code": tools.random()
  }
});

suite.forElement('ecommerce', 'coupons', (test) => {
  it(`should allow CD for /hubs/ecommerce/coupons-generate`, () => {
    let ruleId, couponCodes, customerGroupId;
    let autoGen = true;
    return cloud.post(`/hubs/ecommerce/customer-groups`, customerGroups())
      .then(r => customerGroupId = r.body.id)
      .then(r => cloud.post(`/hubs/ecommerce/sales-rules`, salesRulePost(customerGroupId, autoGen)))
      .then(r => ruleId = r.body.id)
      .then(r => cloud.post(`/hubs/ecommerce/coupons-generate`, couponGenerate(ruleId)))
      .then(r => couponCodes = r.body)
      .then(r => cloud.post(`/hubs/ecommerce/coupons-delete-by-codes`, deleteByCodes(couponCodes)))
      .then(r => cloud.delete(`/hubs/ecommerce/sales-rules/${ruleId}`))
      .then(r => cloud.delete(`/hubs/ecommerce/customer-groups/${customerGroupId}`));
  });

  it(`should allow CRUDS for ${test.api}`, () => {
    let ruleId, customerGroupId;
    let autoGen = false;
    return cloud.post(`/hubs/ecommerce/customer-groups`, customerGroups())
      .then(r => customerGroupId = r.body.id)
      .then(r => cloud.post(`/hubs/ecommerce/sales-rules`, salesRulePost(customerGroupId, autoGen)))
      .then(r => ruleId = r.body.id)
      .then(r => cloud.cruds(test.api, couponPost(ruleId)))
      .then(r => cloud.delete(`/hubs/ecommerce/sales-rules/${ruleId}`))
      .then(r => cloud.delete(`/hubs/ecommerce/customer-groups/${customerGroupId}`));
  });

  it(`should allow POST for /hubs/ecommerce/coupons/deleteByIds`, () => {
    let ruleId, couponId, customerGroupId;
    let autoGen = false;
    return cloud.post(`/hubs/ecommerce/customer-groups`, customerGroups())
      .then(r => customerGroupId = r.body.id)
      .then(r => cloud.post(`/hubs/ecommerce/sales-rules`, salesRulePost(customerGroupId, autoGen)))
      .then(r => ruleId = r.body.id)
      .then(r => cloud.post(`${test.api}`, couponPost(ruleId)))
      .then(r => couponId = r.body.id)
      .then(r => cloud.post(`/hubs/ecommerce/coupons-delete-by-ids`, deleteByIds(couponId)))
      .then(r => cloud.delete(`/hubs/ecommerce/sales-rules/${ruleId}`))
      .then(r => cloud.delete(`/hubs/ecommerce/customer-groups/${customerGroupId}`));
  });
  test.withOptions({ qs: {orderBy : 'rule_id'} }).should.return200OnGet();
  test.withOptions({ qs: {orderBy : 'rule_id desc'} }).should.return200OnGet();
});
