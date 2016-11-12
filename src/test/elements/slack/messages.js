'use strict';

const suite = require('core/suite');
const payload = require('./assets/messages');
// const cloud = require('core/cloud');

suite.forElement('collaboration', 'messages', payload, (test) => {
  test.should.supportCruds();
  test.withOptions({qs: {group: true}}).should.supportCruds();

});
