'use strict';

const suite = require('core/suite');
const payload = require('./assets/lists');


suite.forElement('marketing', 'lists', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
