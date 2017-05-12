'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = require('./assets/tax-rates');
const chakram = require('chakram');
const build = (overrides) => Object.assign({}, payload, overrides);
const taxRatesPayload = build({ reference: "re" + tools.randomInt() });

suite.forElement('finance', 'tax-rates', { payload: taxRatesPayload }, (test) => {
  let name;
  test.should.supportCrus(chakram.put);
  test.should.supportPagination();
  it(`should support GET ${test.api}`, () => {
    return cloud.get(test.api)
      .then(r => name = r.body[0].name)
  });
});
//where clause doesnot work
