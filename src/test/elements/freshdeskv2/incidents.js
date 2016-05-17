'use strict';

const suite = require('core/suite');
const payload = require('./assets/incidents');
const tools = require('core/tools');
payload.email = tools.randomEmail();
payload.name = tools.random();
var date = new Date();
date.setFullYear(date.getFullYear() + tools.randomInt());
payload.due_by = date.toISOString();
payload.fr_due_by = date.toISOString();
var types = ["Question", "Incident" , "Problem", "Feature Request", "Lead"];
payload.type = types[Math.floor(Math.random()*types.length)];

suite.forElement('helpdesk', 'incidents', { payload: payload }, (test) => {
  // checkout functions available under test.should which provide a lot of pre-canned tests
  //   more information here: https://github.com/cloud-elements/churros/blob/master/CONTRIBUTING.md#adding-tests-to-an-existing-suite

  test.should.supportCruds();
});
