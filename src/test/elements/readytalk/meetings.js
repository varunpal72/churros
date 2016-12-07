'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('marketing', 'meetings', null, (test) => {
  test.should.supportSr();
  it('it should support POST a contact inside a list', () => {
    return cloud.get(`${test.api}?pageSize=5&page=1`);
  });
});
