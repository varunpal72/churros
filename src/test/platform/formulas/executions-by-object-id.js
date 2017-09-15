'use strict';

const expect = require('chakram').expect;
const cloud = require('core/cloud');
const tools = require('core/tools');
const provisioner = require('core/provisioner');
const suite = require('core/suite');
const formula = require('./assets/formulas/simple-successful-formula');
const cleaner = require('core/cleaner');

suite.forPlatform('formulas', (test) => {
  let instanceId, formulaId, formulaInstanceId;

  before(() => {
    return provisioner.create('quickbooks', { 'event.notification.enabled': true }) // with events on
    .then(r => instanceId = r.body.id)
    .then(() => cleaner.formulas.withName(formula.name))
    .then(() => cloud.post('/formulas', formula))
    .then(r => formulaId = r.body.id)
    .then(r => cloud.post(`/formulas/${formulaId}/instances`, { name: 'tmp' , configuration: {"trigger-instance": instanceId}}))
    .then(r => formulaInstanceId = r.body.id);
  });


  after(() => {
    return cloud.delete(`/formulas/${formulaId}/instances/${formulaInstanceId}`)
      .then(() => `/formulas/${formulaId}`)
      .then(() => provisioner.delete(instanceId));
  });

  it('should allow finding executions for a specific objectId', () => {
    const opts = {headers: {id: instanceId}};
    return cloud.withOptions(opts).post('/events/quickbooks/direct', {request:{}, objectType:"stuff", stuff:[{id:"this-is|a$test"}]})
      .then(() => cloud.withOptions(opts).post('/events/quickbooks/direct', {request:{}, objectType:"stuff", stuff:[{id:"this-is|not+a$test"}]}))
      .then(() => cloud.withOptions(opts).post('/events/quickbooks/direct', {request:{}, objectType:"stuff", stuff:[{id:"this-is|not+a$test"}]}))
      .then(() => tools.wait.upTo(10000).for(() => cloud.withOptions({qs:{objectId: "this-is|a$test"}}).get(`/formulas/instances/${formulaInstanceId}/executions`, r => {
        expect(r.body.length).to.equal(1);
      })));
  });

});
