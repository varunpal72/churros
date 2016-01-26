'use strict';

const tester = require('core/tester');
const ei = require('core/element-instances');
const util = require('util');

tester.for(null, 'events', (api) => {
  it('should handle receiving x number events for an element instance', () => {
    const element = 'sfdc';
    const payload = require(util.format('./assets/%s.event.json', element));
    const args = {
      'event.notification.enabled': true,
      'event.notification.callback.url': 'http://cc8890c.ngrok.com'
    };

    let eventsSent = 20;
    let instanceId;

    return ei.create(element, args)
      .then(r => instanceId = r.body.id)
      .then(r => tester.createEvents(element, instanceId, payload, eventsSent))
      .then(r => tester.listenForEvents(eventsSent))
      .then(r => ei.delete(instanceId));
  });
});
