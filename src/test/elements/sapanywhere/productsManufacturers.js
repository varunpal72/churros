'use strict';

const suite = require('core/suite');
const payload = require('./assets/manufacturers');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const manufacturerPayload = build({ name: tools.random() });

suite.forElement('ecommerce', 'products/manufacturers', { payload: manufacturerPayload, skip: true }, (test) => {
  const options = {
    churros: {
      updatePayload: {
        "name": "Adidas"
      }
    }
  };
  test.should.supportSr();
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'name = \'Adidas\'' } }).should.return200OnGet();
  test.withApi(test.api + '/count').should.return200OnGet();
  test.withApi(test.api + '/count').withOptions({ qs: { where: 'name = \'Adidas\'' } }).should.return200OnGet();
});
