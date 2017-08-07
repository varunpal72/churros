'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('social', 'likes', { skip: true }, (test) => {
  it('should allow get all likes on a particular update of a company', () => {
    return cloud.get(`/hubs/social/companies/16238355/updates/likes?updateKey=UPDATE-c16238355-6283339617404096512`);
  });
  test
    .withApi(`/hubs/social/companies/16238355/updates/likes?updateKey=UPDATE-c16238355-6283339617404096512?page=17pageSize=1`)
    .withOptions({ qs: { page: 1, pageSize: 1 } });
});
