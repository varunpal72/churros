'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const server = require('core/server');
const tools = require('core/tools');
const provisioner = require('core/provisioner');
const props = require('core/props');
const logger = require('winston');

const gen = (opts, url) => ({
  'event.notification.enabled': opts['event.notification.enabled'] || true,
  'event.notification.callback.url': url
});

const loadEventRequest = (element) => {
  try {
    let filename = `./assets/${element}.event.json`;
    delete require.cache[require.resolve(filename)];
    return require(filename);
  } catch (e) {
    logger.error('No %s.event.json file found in the events/assets directory.  Please create this file before this element can be tested with events', element);
    process.exit(1);
  }
};

suite.forPlatform('events', (test) => {
  const wait = props.getForKey('events', 'wait');

  it('should handle POST /events/{key} with request body, headers, and parameters', () => {
    let instanceId;
    // sfdc does this
    return provisioner.create('sfdc', gen({}, props.getForKey('events', 'url')))
      .then(r => instanceId = r.body.id)
      // fake an sfdc event
      .then(r => cloud.createEvents('sfdc', { '<elementInstanceId>': instanceId }, loadEventRequest('sfdc'), 1))
      .then(s => server.listen(1, wait))
      .then(r => provisioner.delete(instanceId));
  });

  it('should handle GET /events/{key} with headers and parameters', () => {
    // this is zendesk
    let instanceId, targetId;
    return provisioner.create('zendesk', gen({}, props.getForKey('events', 'url')))
      .then(r => {
        instanceId = r.body.id;
        targetId = r.body.configuration['helpdesk.zendesk.webhook.target_id'];
      })
      // fake a zendesk event
      .then(r => cloud.createEvents('zendesk', { '<targetId>': targetId }, loadEventRequest('zendesk'), 1))
      .then(s => server.listen(1, wait))
      .then(r => provisioner.delete(instanceId));
  });

  it('should handle POST /events/{key} with form parameter body', () => {
    // this is box
    let instanceId, oauthUserId, fileId;
    let query = { path: `/churros-${tools.random()}.jpg` };
    let path = __dirname + '/assets/churros.jpg';
    // sfdc does this
    return provisioner.create('box', gen({}, props.getForKey('events', 'url')))
      .then(r => {
        instanceId = r.body.id;
        oauthUserId = r.body.configuration['oauth.user.id'];
      })
      // upload a file for an item ID
      .then(r => cloud.postFile('/hubs/documents/files', path, { qs: query }))
      .then(r => fileId = r.body.id)
      // fake a box event
      .then(r => cloud.createEvents('box', { '<oauthUserId>': oauthUserId, '<fileId>': fileId }, loadEventRequest('box'), 1))
      .then(s => server.listen(1, wait))
      // clean up
      .then(r => cloud.delete('/hubs/documents/files/' + fileId))
      .then(r => provisioner.delete(instanceId));
  });
});
