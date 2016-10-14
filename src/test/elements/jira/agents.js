'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('helpdesk', 'agents', (test) => {
  let agentId;
  it('should allow get for /agents', () => {
    cloud.withOptions({qs:{where:`username='test'`}}).get('/hubs/helpdesk/agents')
    .then(r => agentId = r.body[0].key)
    .then(r => cloud.get("/hubs/helpdesk/agents/" + agentId));
  }
);
}
);
