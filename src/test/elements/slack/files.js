'use strict';

const suite = require('core/suite');
// const cloud = require('core/cloud');
const payload = require('./assets/files.json');

suite.forElement('collaboration', 'channels', payload, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();

});
