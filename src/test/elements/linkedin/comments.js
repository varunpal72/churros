'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('social', 'comments', { skip: true }, (test) => {
  it('should allow get all comments on an update by a company', () => {
    return cloud.get(`/hubs/social/companies/16238355/updates/comments?updateKey=UPDATE-c16238355-6283339617404096512`);
  });
  test.should.supportPagination();
});
