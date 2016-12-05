'use strict';

const suite = require('core/suite');
const payload = require('./assets/activities');
const cloud = require('core/cloud');

suite.forElement('marketing','activities',{payload:payload}, (test) => {
  it('should allow CR for /activities and GET /activity-type', () => {
    let id;
    return cloud.get('/hubs/marketing/activity-types')
	   .then(r => id =r.body[0].id)
           .then(r => cloud.withOptions({ qs:{where : "activityTypeIds in ("+`${id}` +" ) and fromDate = '2012-11-25T11:39:58Z'"}}).get(`     		   ${test.api}`))
           .then(r => cloud.post(test.api,payload));
});

});
