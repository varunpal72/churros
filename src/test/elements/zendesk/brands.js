'use strict';

const suite = require('core/suite');
const payload = require('./assets/brands');
const options = { payload: payload };

suite.forElement('helpdesk', 'brands', options, (test) => {
  test.should.supportCruds();

});
// });
