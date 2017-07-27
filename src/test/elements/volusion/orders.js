'use strict';

const suite = require('core/suite');
const payload = require('./assets/orders');

suite.forElement('ecommerce', 'orders', { payload: payload }, (test) => {

  test.should.supportCrs();
  test.withOptions({ qs: { where: 'OrderDateUtc>=\'3/15/2014 6:51:29 PM\'' } }).should.return200OnGet();
 
});
