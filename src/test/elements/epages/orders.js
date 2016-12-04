'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = require('./assets/orders');
const build = (overrides) => Object.assign({}, payload, overrides);
const orderPayload = build({ value: tools.randomStr() });

suite.forElement('ecommerce', 'orders', { payload: orderPayload, skip: true }, (test) => {
  test.should.supportPagination();
  it(`should allow SRU for ${test.api}`, () => {
    let id;
    return cloud.withOptions({ qs: { where: 'locale = \'en_US\'' } }).get(`${test.api}`)
      .then(r => id = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${id}`))
      .then(r => cloud.patch(`${test.api}/${id}`, payload));
  });
});