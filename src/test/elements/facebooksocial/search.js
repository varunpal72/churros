'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('social', 'search', null, (test) => {
  it('should allow GET for hubs/social/status and then comments and likes by statusId ', () => {
    let statusId; 
    return cloud.get('/hubs/social/status')
      .then(r => statusId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/${statusId}/comments`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${statusId}/comments`))
      .then(r => cloud.get(`${test.api}/${statusId}/likes`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}/${statusId}/likes`));
  });

  it('should allow GET for /hubs/social/search/group', () => {
    return cloud.withOptions({ qs: { searchGroup: 'TryStack' } }).get(`${test.api}/group`)
      .then(r => cloud.withOptions({ qs: { searchGroup: 'TryStack', page: 1, pageSize: 1 } }).get(`${test.api}/group`));
  });
	
  it('should allow GET for /hubs/social/search/page', () => {
    return cloud.withOptions({ qs: { pageName: 'Linux' } }).get(`${test.api}/page`)
      .then(r => cloud.withOptions({ qs: { pageName: 'Linux', page: 1, pageSize: 1 } }).get(`${test.api}/page`));
  });
	
  it('should allow GET for /hubs/social/search/user', () => {
    return cloud.withOptions({ qs: { userName: 'Cloud Eles' } }).get(`${test.api}/user`)
      .then(r => cloud.withOptions({ qs: { userName: 'Cloud Eles', page: 1, pageSize: 1 } }).get(`${test.api}/user`));
  });
});
