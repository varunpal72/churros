'use strict';

const suite = require('core/suite');
const payload = require('./assets/incidents');
const tools = require('core/tools');
const cloud = require('core/cloud');
let email = tools.randomEmail();
payload.email = email;
payload.name = tools.random();
var date = new Date();
date.setFullYear(date.getFullYear() + tools.randomInt());
payload.due_by = date.toISOString();
payload.fr_due_by = date.toISOString();
var types = ["Question", "Incident", "Problem", "Feature Request", "Lead"];
payload.type = types[Math.floor(Math.random() * types.length)];

suite.forElement('helpdesk', 'incidents', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
  test.withName(`should support searching ${test.api} by updated_since`).withOptions({ qs: { where: 'updated_since=\'2016-01-01\'' } }).should.return200OnGet();
  it('should support GET /hubs/helpdesk/incidents/:id/comments ', () => {
    let id;
    return cloud.post(test.api, payload)
      .then(r => id = r.body.id)
      .then(r => cloud.get(`${test.api}/${id}/comments`))
      .then(r => cloud.delete(`${test.api}/${id}`));
  });
});
