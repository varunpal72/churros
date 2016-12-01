'use strict';

const suite = require('core/suite');
//const payload = require('./assets/activities');
const cloud = require('core/cloud');
const tools = require('core/tools');

//const build = (overrides) => Object.assign({}, payload, overrides);
//const activitiesPayload = build({ key:tools.random()});
suite.forElement('marketing','campaigns',null, (test) => {
  it('should allow CR for /activities and GET /activity-type', () => {
    let id;
    return cloud.get(`${test.api}`)
	.then(r =>id= r.body[0].id )
	.then(r => cloud.get(`${test.api}/${id}`));
      
 });
});
