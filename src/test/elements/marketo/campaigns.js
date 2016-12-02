'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');


suite.forElement('marketing','campaigns',null, (test) => {
  it('should allow CR for /activities and GET /activity-type', () => {
    let id;
    return cloud.get(`${test.api}`)
	.then(r =>id= r.body[0].id )
	.then(r => cloud.get(`${test.api}/${id}`))
        .then(r => cloud.get('/hubs/marketing/activity-type'));
      
 });
});
