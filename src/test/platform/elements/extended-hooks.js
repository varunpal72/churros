'use strict';

const cloud = require('core/cloud');
const expect = require('chakram').expect;
const suite = require('core/suite');
const schema = require('./assets/element.hook.schema.json');
const logger = require('winston');
const props = require('core/props');
const provisioner = require('core/provisioner');

suite.forPlatform('extended element hook scripts for existing endpoints ', (test) => {
  let instanceId;
  before(() => {
    if (props.get('user') === 'system') {
      logger.warn('Unable to test extended element hook scripts for existing endpoints as system user. Skipping.');
      return;
    }
    return cloud.get('/instances')
      .then(r => Promise.all(r.body.filter(instance => instance.element.key === 'box')
                                    .map(instance => provisioner.delete(instance.id))))
      .then(() => cloud.delete('/elements/box', r => true))
      .then(() => cloud.post('/elements/box/clone', schema))
      .then(() => provisioner.create('box'))
      .then(r => instanceId = r.body.id);
  });

  after(() => {
    if (props.get('user') === 'system') {
      return;
    }
    if (instanceId) {
      provisioner.delete(instanceId);
    }
    return cloud.delete('/elements/box');
  });

  it('should support pre hooks', () => {
    if (props.get('user') === 'system') {
      return;
    }
    return cloud.get('/elements/box/hooks')
      .then(r => Promise.all(r.body.map(hook => cloud.delete(`/elements/box/hooks/${hook.id}`))))
      .then(() => cloud.post('/elements/box/hooks', {
        type: 'preRequest',
        body: 'done({continue:false, response_status_code: 432, response_body: {surprise: false}});'}))
      .then(() => cloud.withOptions({ qs: { pageSize: '1', path: '/' } }).get('/hubs/documents/folders/contents', r => expect(r).to.have.statusCode(432)))
      .then(r => expect(r.body).to.deep.equal({surprise: false}));
  });

  it('should support post hooks', () => {
    if (props.get('user') === 'system') {
      return;
    }
    return cloud.get('/elements/box/hooks')
      .then(r => Promise.all(r.body.map(hook => cloud.delete(`/elements/box/hooks/${hook.id}`))))
      .then(() => cloud.post('/elements/box/hooks', {
        type: 'postRequest',
        body: 'done({response_status_code: response_status_code+1, response_body: {replace: true}});'}))
      .then(() => cloud.withOptions({ qs: { pageSize: '1', path: '/' } }).get('/hubs/documents/folders/contents', r => expect(r).to.have.statusCode(201)))
      .then(r => expect(r.body).to.deep.equal({replace: true}));
  });

  it ('should not run hooks for standard endpoints', () => {
    if (props.get('user') === 'system') {
      return;
    }
    return cloud.get('/elements/box/hooks')
      .then(r => Promise.all(r.body.map(hook => cloud.delete(`/elements/box/hooks/${hook.id}`))))
      .then(() => cloud.post('/elements/box/hooks', {
        type: 'preRequest',
        body: 'done({continue:false, response_status_code: 432, response_body: {surprise: false}});'}))
      .then(() => cloud.post('/elements/box/hooks', {
        type: 'postRequest',
        body: 'done({response_status_code: response_status_code+1, response_body: {replace: true}});'}))
      .then(() => cloud.get('/hubs/documents/ping', r => expect(r).to.have.statusCode(200)))
      .then(r => expect(r.body.endpoint).to.equal('box'));
  });
});