'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/members');
const chakram = require('chakram');
const expect = chakram.expect;

suite.forElement('documents', 'members', { payload: payload }, (test) => {
  let memberId = 'dbmid:AADkTHIEUNMxlMLbejOdxXt8bZsciJP1sRE';
  let email = 'devteammember@cloud-elements.com';
  let external_id = 'company_id:342432';

  test.should.return200OnGet();
  it('should support CD for ${test.api}', () => {
    let newMemberId;
    return cloud.post(test.api, payload)
      .then(r => newMemberId = r.body.complete[0].profile.team_member_id)
      .then(r => cloud.delete(`${test.api}/${newMemberId}`));
  });
  // member is unsuspended twice to make sure it's in a state where it can be tested next time.
  it('should support PATCH for ${test.api}/members/{id}/suspend/{wipe_data}', () => {
    return cloud.patch(`${test.api}/${memberId}/suspend/false`);
  });
  it('should allow PATCH for ${test.api}/members/{id}/unsuspend', () => {
    return cloud.patch(`${test.api}/${memberId}/unsuspend`);
  });
  it('should support PATCH for ${test.api}/members/{id}/suspend/{wipe_data}', () => {
    return cloud.patch(`${test.api}/${memberId}/suspend/true`);
  });
  it('should allow PATCH for ${test.api}/members/{id}/unsuspend', () => {
    return cloud.patch(`${test.api}/${memberId}/unsuspend`);
  });
  test.withOptions({ qs: {where: `team_member_id = \'${memberId}\'` } }).withApi(`/hubs/documents/members`).should.return200OnGet();
  test.withOptions({ qs: {where: `email = \'${email}\'` } }).withApi(`/hubs/documents/members`).should.return200OnGet();
  test.withOptions({ qs: {where: `external_id = \'${external_id}\'` } }).withApi(`/hubs/documents/members`).should.return200OnGet();
  it('should support cursor pagination', () => {
    const options = { qs: { pageSize: 1}};
    return cloud.withOptions(options).get(test.api)
      .then(r => {
        expect(r.body).to.not.be.null;
        options.qs.nextPage = r.response.headers['elements-next-page-token'];
        return cloud.withOptions(options).get(test.api);
      });
  });
});

/* Commented out the old scripts as they do not support some worst case scenarios*/
/*
// member is unsuspended twice to make sure it's in a state where it can be tested next time.
suite.forElement('documents', 'members', { payload: payload }, (test) => {
  it('should support CRUDS for members', () => {
    let memberId;
    return cloud.post(test.api, payload)
      .then(r => memberId = r.body.complete[0].profile.team_member_id)
      .then(r => cloud.delete(`${test.api}/${memberId}`))
      .then(r => cloud.get(test.api))
      .then(r => memberId = r.body[r.body.length - 1].profile.team_member_id)
      //.then(r => cloud.get(`${test.api}/${memberId}`))
      .then(r => cloud.patch(`${test.api}/${memberId}/suspend/false`))
      .then(r => cloud.patch(`${test.api}/${memberId}/unsuspend`))
      .then(r => cloud.patch(`${test.api}/${memberId}/suspend/true`))
      .then(r => cloud.patch(`${test.api}/${memberId}/unsuspend`));
  });
});
*/
