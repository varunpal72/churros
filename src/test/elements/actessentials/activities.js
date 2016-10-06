'use strict';

const suite = require('core/suite');
const payload = require('./assets/activities');
const chakram = require('chakram');

suite.forElement('marketing', 'activities', { payload: payload }, (test) => {
  test.should.supportCruds(chakram.patch);
  test.should.supportPagination();
  test.withOptions({qs:{where: 'subject=\'churros\''}}).should.return200OnGet();
});
