'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const model = require('core/model');

// suite.forElement('helpdesk', 'agents', (test) => {
//   let agentId;
//   it('should allow get for /agents', () => {
//     return cloud.withOptions({qs:{where:`username='test'`}}).get('/hubs/helpdesk/agents')
//     .then(r => cloud.withOptions({qs:{where:`username='test'`, page: 1, pageSize: 1 }}).get('/hubs/helpdesk/agents'))
//     .then(r => agentId = r.body[0].key)
//     .then(r => cloud.get("/hubs/helpdesk/agents/" + agentId));
//   });
// });

suite.forElement('helpdesk', 'agents', (test) => {
  let agentId;
  it('should allow get for /agents', () => {
<<<<<<< HEAD
    return cloud.withOptions({qs:{where:`username='jiradev'`}}).get('/hubs/helpdesk/agents')
    .then(r => model.validateGetModel(r, '/agents'))
    //return cloud.withOptions({qs:{where:`username='jiradev'`}}).validateGetModel('/hubs/helpdesk/agents', '/agents')    
=======
//"jiradev" is hardcoded as get all api has "username" constraint".
    return cloud.withOptions({qs:{where:`username='jiradev'`}}).get('/hubs/helpdesk/agents')
    .then(r => cloud.withOptions({qs:{where:`username='jiradev'`, page: 1, pageSize: 1 }}).get('/hubs/helpdesk/agents'))
   .then(r => agentId = r.body[0].key)
    .then(r => cloud.get("/hubs/helpdesk/agents/" + agentId));
>>>>>>> fd6b30305accb2879c4c0050f5731089c13922a6
  });
});
