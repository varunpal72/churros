'use strict';

const suite = require('core/suite');
const payload =  require('./assets/emails');


suite.forElement('marketing', 'emails', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearchForMultipleRecords('name');
});
