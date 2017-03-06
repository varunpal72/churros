const payload = require('./assets/order.json');
const suite = require('core/suite');

suite.forElement('ecommerce', 'orders', { payload: payload}, (test) => {
  test.should.supportCr();

});
