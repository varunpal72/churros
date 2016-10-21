'use strict';

const suite = require('core/suite');
const payload = require('./assets/notes');

suite.forElement('marketing', 'notes', { payload: payload }, (test) => {
  test.should.supportCrud();
  //looks like it supports WHERE
});
