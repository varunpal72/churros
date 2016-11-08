'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/messages');

suite.forElement('messaging', 'countryCodes', {payload: payload}, (test) => {
  test.should.return200OnGet();
  test.should.supportPagination();

  it('should allow Read', () => {
    return cloud.get('/hubs/messaging/countryCodes');
  });
});
