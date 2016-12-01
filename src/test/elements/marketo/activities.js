'use strict';

const suite = require('core/suite');
const payload = require('./assets/activities');
const cloud = require('core/cloud');
const tools = require('core/tools');

//const build = (overrides) => Object.assign({}, payload, overrides);
//const activitiesPayload = build({ key:tools.random()});
suite.forElement('marketing','activities',{payload:payload}, (test) => {
  it('should allow CR for /activities and GET /activity-type', () => {
    let activitiesId;
    return cloud.get('/hubs/marketing/activity-types')
           .then(r => cloud.withOptions({ qs:{where : "activityTypeIds in (12,13) and fromDate = '2012-11-25T11:39:58Z'"}}).get(`${test.api}`))
           .then(r => cloud.post(test.api,payload));
});

});
