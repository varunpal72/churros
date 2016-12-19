'use strict';
const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;
const payload = require('./assets/elementProduct.json');
const schema = require('./assets/elementProduct.schema.json');
const listSchema = require('./assets/elementProducts.schema.json');

const opts = { payload: payload, schema: schema };

suite.forPlatform('element-products', opts, (test) => {
  test.should.supportCrud();
  test.withOptions({schema: listSchema}).should.supportS();
});
