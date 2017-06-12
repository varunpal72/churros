'use strict';

const suite = require('core/suite');
const payload = require('./assets/problems');
const tools = require('core/tools');
const taskPayload = require('./assets/task');
const cloud = require('core/cloud');

payload.email = tools.randomEmail();

suite.forElement('helpdesk', 'problems', { payload: payload }, (test) => {
let problemId;
const options = {
    churros: {
      updatePayload: {
        "subject": tools.random()
      }
    }
  };
  test.withOptions({ qs: { page: 1 } }).should.return200OnGet();
 test.withOptions(options).should.supportCruds();

 before(() => cloud.post(test.api, payload)
    .then(r => problemId = r.body.id));
it(`should allow CRUDS for  + ${test.api}/tasks`, () => {
   return cloud.cruds(`${test.api}/${problemId}/tasks`,taskPayload);   
  });
after(() => cloud.delete(`${test.api}/${problemId}`));

});
