'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');

const payload = (name) => ({
 "name": name,
 "description": tools.random()
});

suite.forElement('finance', 'terms', { payload: payload() }, (test) => {
  test.should.supportSr();
  it(`should allow CUD for ${test.api}`, () => {
    let termName = "ChurrosTest";
    return cloud.post(test.api, payload(termName))
    .then(r => cloud.patch(`${test.api}/${termName}`, payload(termName)))
    .then(r => cloud.delete(`${test.api}/${termName}`));
  });
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'whenmodified>\'08/13/2016 05:26:37\'' } }).should.return200OnGet();
});
