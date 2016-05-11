'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/messages');
var chakram = require('chakram'),
    expect = chakram.expect;

suite.forElement('messaging', 'usage', {payload: payload}, (test) => {
  test.should.return200OnGet();
  test.should.supportPagination();

  it('should allow Read', () => {
    return cloud.get('/hubs/messaging/usage');
  });

  it('should allow query by Category', () => {
    let query = { where: "Category='totalprice'"};
    return cloud.withOptions({ qs: query }).get('/hubs/messaging/usage')
    .then(r => expect(r.body.length).to.eq(1))
  });
});
