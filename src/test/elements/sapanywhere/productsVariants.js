'use strict';

const suite = require('core/suite');
const payload = require('./assets/variants');
const tools = require('core/tools');
const variantsUpdate = () => ({
  "description": "Another test22",
  "name": "mode12"
});

const options = {
  churros: {
    updatePayload: variantsUpdate()
  }
};
payload.name = tools.random();
payload.description = tools.random();
suite.forElement('ecommerce', 'products/variants', { payload: payload }, (test) => {
  //test.should.supportCruds();
  //test.should.supportSr();

  test.should.supportSr();
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'name = \'color\'' } }).should.return200OnGet();
});
