'use strict';

const tools = require('core/tools');
const chakram = require('chakram');
const util = require('util');
const provisioner = require('core/provisioner');
const cloud = require('core/cloud');
const fSchema = require('./formula.schema');
const fiSchema = require('./formula.instance.schema');

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

const deleteFormulaInstance = (fId, fiId) =>
  chakram.delete(util.format('/formulas/%s/instances/%s', fId, fiId));

const getInstancesForFormula = (fId) =>
  chakram.get(util.format('/formulas/%s/instances', fId))
  .then(r => r.body);

const getInstancesForFormulas = (fs) =>
  Promise.all(fs.map(f => getInstancesForFormula(f.id)));

const deleteFormula = (fId) =>
  chakram.delete(util.format('/formulas/%s', fId));

const deleteFormulas = (fs) =>
  Promise.all(fs.map(f => deleteFormula(f.id)));

const getFormulasByName = (api, name) =>
  chakram.get(api)
  .then(r => r.body.filter(f => f.name === name));

const deleteInstancesForFormulas = (is) =>
  Promise.all(is.map(i => deleteFormulaInstance(i.formula.id, i.id)));

const deleteFormulasByName = (api, name) =>
  getFormulasByName(api, name)
  .then(fs =>
    getInstancesForFormulas(fs)
    .then(fis => [].concat.apply([], fis))
    .then(deleteInstancesForFormulas)
    .then(() => deleteFormulas(fs)));
exports.deleteFormulasByName = deleteFormulasByName;

exports.getFormulaInstanceExecutions = (fId, fiId) =>
  chakram.get(util.format('/formulas/%s/instances/%s/executions', fId, fiId));

exports.getFormulaInstanceExecution = (fId, fiId, fieId) =>
  chakram.get(util.format('/formulas/%s/instances/%s/executions/%s', fId, fiId, fieId));

exports.deleteFormulaInstance = deleteFormulaInstance;
exports.deleteFormula = deleteFormula;

exports.createFAndFI = () => {
  let elementInstanceId, formulaId, formulaInstanceId;
  const formula = require('./simple-successful-formula');
  return deleteFormulasByName('/formulas', 'simple-successful')
    .then(r => cloud.post('/formulas', formula, fSchema))
    .then(r => formulaId = r.body.id)
    .then(r => provisioner.create('closeio')) // just chose a random element, as i just need a valid ID
    .then(r => elementInstanceId = r.body.id)
    .then(r => {
      const formulaInstance = require('./simple-successful-formula-instance');
      formulaInstance.configuration['trigger-instance'] = elementInstanceId;
      return cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema);
    })
    .then(r => formulaInstanceId = r.body.id)
    .then(r => ({ formulaInstanceId: formulaInstanceId, formulaId: formulaId, elementInstanceId: elementInstanceId }));
};
