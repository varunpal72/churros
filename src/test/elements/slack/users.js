'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/users');

suite.forElement('collaboration', 'channels', payload, (test) => {
  test.should.supportCruds();
  
});
