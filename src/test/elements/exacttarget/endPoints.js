'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('marketing', 'endPoints', { payload: null},(test) => {
  test.should.supportS();
});

