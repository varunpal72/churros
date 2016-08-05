'use strict';

const cleaner = require('core/cleaner');
const tools = require('core/tools');
const b64 = tools.base64Encode;
const chakram = require('chakram');
const expect = chakram.expect;
const logger = require('winston');
const provisioner = require('core/provisioner');
const cloud = require('core/cloud');
const fSchema = require('./schemas/formula.schema');
const fiSchema = require('./schemas/formula.instance.schema');

var exports = module.exports = {};

exports.genFormula = (opts) => new Object({
  name: (opts.name || 'churros-formula-name-' + tools.random())
});

exports.genTrigger = (opts) => new Object({
  type: (opts.type || 'scheduled'),
  properties: (opts.properties) || {
    cron: '0 0/15 * 1/1 * ? *'
  },
  onSuccess: (opts.onSuccess || null)
});

exports.genInstance = (opts) => new Object({
  name: (opts.name || 'churros-formula-instance-name')
});

exports.provisionSfdcWithPolling = () => provisioner.create('sfdc', {
  'event.notification.enabled': true,
  'event.vendor.type': 'polling',
  'event.poller.refresh_interval': 999999999
});

exports.provisionSfdcWithWebhook = () => provisioner.create('sfdc', {
  'event.notification.enabled': true,
  'event.vendor.type': 'webhook'
});

exports.generateSfdcEvent = (instanceId, payload) => {
  const url = `/events/sfdc`;
  const opts = { headers: { 'Element-Instances': instanceId } };
  return cloud
    .withOptions(opts)
    .post(url, payload);
};

exports.generateSfdcPollingEvent = (instanceId, payload) => {
  const headers = { 'Content-Type': 'application/json', 'Id': instanceId };
  const encodedId = b64(instanceId.toString());

  payload.instance_id = instanceId;

  return cloud
    .withOptions({ 'headers': headers })
    .post('/events/sfdcPolling/' + encodedId, payload);
};

exports.deleteFormula = (fId) => cloud.delete(`/formulas/${fId}`);
exports.deleteFormulaInstance = (fId, fiId) => cloud.delete(`/formulas/${fId}/instances/${fiId}`);

const getAllExecutions = (fiId, nextPage, all) => {
  all = all || [];
  const options = { qs: { nextPage: nextPage, pageSize: 200 } };
  return cloud.withOptions(options).get(`/formulas/instances/${fiId}/executions`)
    .then(r => {
      expect(r).to.have.statusCode(200);
      expect(r.body).to.not.be.null;
      all = all.concat(r.body);
      const npt = r.response.headers['elements-next-page-token'];
      return npt === undefined ? all : getAllExecutions(fiId, npt, all);
    })
    .catch(e => {
      logger.debug(`Failed to retrieve executions, returning current list.  Exception: ${e}`);
      return all;
    });
};
exports.getAllExecutions = getAllExecutions;

const getFormulaInstanceExecutions = (fiId) => cloud.get(`/formulas/instances/${fiId}/executions`);
exports.getFormulaInstanceExecutions = getFormulaInstanceExecutions;

const getFormulaInstanceExecution = (fieId) => cloud.get(`/formulas/instances/executions/${fieId}`);

exports.getFormulaInstanceExecutionWithSteps = (fieId) => {
  return getFormulaInstanceExecution(fieId)
    .then(r => {
      const fie = r.body;
      return cloud.withOptions({ qs: { includeValues: true } }).get(`/formulas/instances/executions/${fieId}/steps`)
        .then(r => fie.stepExecutions = r.body)
        .then(r => fie);
    });
};

exports.createFAndFI = (element, config) => {
  element = element || 'closeio';
  let elementInstanceId, formulaId, formulaInstanceId;
  const formula = require('./formulas/simple-successful-formula');
  return cleaner.formulas.withName('simple-successful')
    .then(r => cloud.post('/formulas', formula, fSchema))
    .then(r => formulaId = r.body.id)
    .then(r => provisioner.create(element, config))
    .then(r => elementInstanceId = r.body.id)
    .then(r => {
      const formulaInstance = require('./formulas/basic-formula-instance');
      formulaInstance.configuration['trigger-instance'] = elementInstanceId;
      return cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema);
    })
    .then(r => formulaInstanceId = r.body.id)
    .then(r => ({ formulaInstanceId: formulaInstanceId, formulaId: formulaId, elementInstanceId: elementInstanceId }));
};

exports.allExecutionsCompleted = (fId, fiId, numExecs, numExecVals) => () => new Promise((res, rej) => {
  return getFormulaInstanceExecutions(fiId)
    .then(r => {
      if (r.body.length !== numExecs) rej();

      return Promise.all(r.body.map(fie => getFormulaInstanceExecution(fie.id)))
        .then(rs => Promise.all(rs.map(r => r.body.stepExecutions)))
        .then(fieses => [].concat.apply([], fieses))
        .then(ses => {
          const numPending = ses.filter(se => se.status === 'pending').length;
          if (ses.length === (numExecVals * numExecs) && numPending === 0) {
            logger.debug(`All ${numExecs} executions completed with ${numExecVals} execution values for formula ${fId}, instance ${fiId}.`);
            res();
          } else {
            logger.debug(`Not all ${numExecs} executions completed with ${numExecVals} execution values for formula ${fId}, instance ${fiId}; ${ses.length} total execution values found so far.`);
            rej();
          }
        });
    });
});

exports.cleanup = (eiId, fId, fiId) => {
  return cloud.delete(`/formulas/${fId}/instances/${fiId}`)
    .then(r => cloud.delete(`/formulas/${fId}`))
    .then(r => eiId && provisioner.delete(eiId));
};
