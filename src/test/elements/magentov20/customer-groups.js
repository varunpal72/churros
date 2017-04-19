'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');

const payload = () => ({
  "group": {
    "code": tools.random(),
    "tax_class_id": 3,
    "tax_class_name": "Retail Customer"
  }
});

suite.forElement('ecommerce', 'customer-groups', { payload: payload() }, (test) => {
  test.should.supportCruds();
  it(`should allow SR for /hubs/ecommerce/customer-groups-default`, () => {
    return cloud.get(`/hubs/ecommerce/customer-groups-default`)
      .then(r => cloud.get(`/hubs/ecommerce/customer-groups-default/${r.body.id}`));
  });
  it(`should allow GET for ${test.api}/{id}/permissions`, () => {
    return cloud.get(`${test.api}`)
      .then(r => cloud.get(`${test.api}/${r.body[0].id}/permissions`));
  });
  test.should.supportPagination();
});
