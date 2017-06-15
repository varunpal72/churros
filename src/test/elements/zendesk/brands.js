'use strict';

const suite = require('core/suite');
const payload = require('./assets/brands');
const options = { payload: payload };
const cloud = require('core/cloud');

suite.forElement('helpdesk', 'brands', options, (test) => {
  test.should.supportCruds();

});
