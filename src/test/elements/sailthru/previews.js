'use strict';

const suite = require('core/suite');
const payload = require('./assets/emails');

suite.forElement('marketing', 'previews', { skip: true, payload: payload }, (test) => {
  test.should.return200OnPost();
});
