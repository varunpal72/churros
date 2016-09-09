'use strict';

const suite = require('core/suite');
const payload = require('./assets/brands');
const tools = require('core/tools');
const brandsUpdate = () => ({
  "name": "Honda"
});

const options = {
  churros: {
    updatePayload: brandsUpdate()
  }
};
payload.name = tools.random();
suite.forElement('ecommerce', 'products/brands', { payload: payload }, (test) => {

  test.should.supportSr();
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'name = \'BPL\'' } }).should.return200OnGet();
  test.withApi(test.api + '/count').should.return200OnGet();
  test.withApi(test.api + '/count').withOptions({ qs: { where: 'name = \'Yonex\'' } }).should.return200OnGet();
});
