'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const winston = require('winston');

const organizationsUpdate = (rando) => ({
  "name": "Cloud-Elements update" + rando,
  "domains": [
    "acmeinc.com",
    "acmeinc.net"
  ]
});

const organizationsCreate = (rando) => ({
  "name": "Cloud-Elements " + rando,
  "domains": [
    "acmeinc.com",
    "acmeinc.net"
  ]
})

suite.forElement('helpdesk', 'organizations', organizationsCreate(), (test) => {
  let organiztionId;
  it('should allow CRUS for organizations', () => {
    return cloud.post(test.api, organizationsCreate(tools.randomInt().toString()))
      .then(r => organiztionId = r.body.id)
      .then(r => cloud.get(`${test.api}/${organiztionId}`))
      .then(r => cloud.patch(`${test.api}/${organiztionId}`, organizationsUpdate(tools.randomInt().toString())))
      .then(r => cloud.get(test.api))
      .then(r => cloud.get(`${test.api}/${organiztionId}/contacts`))
      .then(r => cloud.get(`${test.api}/${organiztionId}/incidents`));
  });
  test.should.supportPagination();
  test.withApi(`${test.api}/search`).withOptions({ qs: { query: 'desk.com' } }).should.return200OnGet();
});
