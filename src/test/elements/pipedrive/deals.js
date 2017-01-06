'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('crm', 'deals', null, (test) => {
  test.should.return200OnGet();
});
