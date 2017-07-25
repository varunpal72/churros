'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('social', 'companies', { skip: true }, (test) => {
  it('should allow get all companies', () => {
    return cloud.get(`/hubs/social/companies`);
  });
  test.should.supportPagination();
});
