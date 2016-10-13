'use strict';

const suite = require('core/suite');
const tools = require('core/tools');

suite.forElement('marketing', 'users', { skip: true, payload: {'email': tools.randomEmail()}}, (test) => {
  test.should.return200OnPost();
});
