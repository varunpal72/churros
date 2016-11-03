'use strict';

const suite = require('core/suite');

suite.forElement('social', 'places', null, (test) => {
  test.withOptions({ qs: { where: `lat = '37.7821120598956' and long = '-122.400612831116'` } }).should.return200OnGet();
  test.withApi(`${test.api}/df51dec6f4ee2b2c`).should.return200OnGet();
});
