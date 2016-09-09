'use strict';

const suite = require('core/suite');
const payload = require('./assets/customers');

const tools = require('core/tools');


const mobNumber = '9876543';

const customersUpdate = () => ({
  "lastName": "Lallana_2"
});

payload.lastName = tools.random();
payload.firstName = tools.random();
payload.mobile = '' + mobNumber + '' + tools.randomInt();

const options = {
  churros: {
    updatePayload: customersUpdate()
  }
};
suite.forElement('ecommerce', 'customers', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportSr();
  test.withOptions(options).should.supportCrus();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'firstName = \'Brian\'' } }).should.return200OnGet();
  test.withApi(test.api + '/count').should.return200OnGet();
  test.withApi(test.api + '/count').withOptions({ qs: { where: 'firstName = \'Brian\'' } }).should.return200OnGet();

});
