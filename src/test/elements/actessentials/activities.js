'use strict';

const suite = require('core/suite');
const payload = require('./assets/activities');

suite.forElement('marketing', 'activities', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
  test.withOptions({qs:{where: 'subject=\'churros\''}}).should.return200OnGet();
});
