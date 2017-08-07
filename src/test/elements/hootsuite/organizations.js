'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const membersPayload = require('./assets/members');
const teamsPayload = require('./assets/teams');
const addMemberPayload = require('./assets/addmember');

suite.forElement('social', 'organizations', (test) => {
  let organizationId, memberId, socialProfileId, teamId;
  it.skip(`should allow operations for oraganizations, teams, social-profiles and members`, () => {
    return cloud.get(`/hubs/social/me/organizations`)
      .then(r => organizationId = r.body[0].id)
      .then(r => cloud.get(`/hubs/social/me/social-profiles`))
      .then(r => socialProfileId = r.body[0].id)
      //teams
      .then(r => cloud.post(`${test.api}/${organizationId}/teams`, teamsPayload))
      .then(r => teamId = r.body.id)
      .then(r => cloud.post(`/hubs/social/teams/${teamId}/members`, addMemberPayload))
      //members
      .then(r => cloud.post(`/hubs/social/members`, membersPayload))
      .then(r => memberId = r.body.id)
      .then(r => cloud.get(`${test.api}/${organizationId}/members`))
      .then(r => cloud.get(`/hubs/social/members/${memberId}/organizations`))
      .then(r => cloud.get(`${test.api}/${organizationId}/members/${memberId}/teams`))
      .then(r => cloud.get(`${test.api}/${organizationId}/teams/${teamId}/members/${memberId}/permissions`))
      //social-profiles
      .then(r => cloud.get(`${test.api}/${organizationId}/members/${memberId}/social-profiles`))
      .then(r => cloud.get(`${test.api}/${organizationId}/members/${memberId}/social-profiles/${socialProfileId}/permissions`));
  });

});
