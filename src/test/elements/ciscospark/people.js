'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('collaboration', 'people',null, (test) => {
   
 it('should allow GET /people/me and SR for ' + test.api, () => {
    let peopleId,peopleEmail;
    return cloud.get(`${test.api}/me`)
      .then(r => peopleId = r.body.id)
      .then(r => cloud.get(`${test.api}/${peopleId}`))
      .then(r =>  peopleEmail = r.body.displayName)
      .then(r => cloud.withOptions({ qs: { displayName : peopleEmail } }).get(test.api));
  });
});
