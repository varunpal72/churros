'use strict';

const tools = require('core/tools');
const chakram = require('chakram');
const util = require('util');

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

exports.deleteFormulasByName = (api, name) =>
  getFormulasByName(api, name)
    .then(fs =>
      getInstancesForFormulas(fs)
        .then(fis => [].concat.apply([], fis))
        .then(deleteInstancesForFormulas)
        .then(() => deleteFormulas(fs)));

exports.getFormulaInstanceExecutions = (fId, fiId) =>
  chakram.get(util.format('/formulas/%s/instances/%s/executions', fId, fiId));

exports.getFormulaInstanceExecution = (fId, fiId, fieId) =>
  chakram.get(util.format('/formulas/%s/instances/%s/executions/%s', fId, fiId, fieId));

const deleteFormulaInstance = (fId, fiId) =>
  chakram.delete(util.format('/formulas/%s/instances/%s', fId, fiId))

const deleteInstancesForFormulas = (is) =>
  Promise.all(is.map(i => deleteFormulaInstance(i.formula.id, i.id)))

const getInstancesForFormulas = (fs) =>
  Promise.all(fs.map(f => getInstancesForFormula(f.id)))

const getInstancesForFormula = (fId) =>
  chakram.get(util.format('/formulas/%s/instances', fId))
    .then(r => r.body)

const deleteFormulas = (fs) =>
  Promise.all(fs.map(f => deleteFormula(f.id)))

const deleteFormula = (fId) =>
  chakram.delete(util.format('/formulas/%s', fId))

const getFormulasByName = (api, name) =>
  chakram.get(api)
    .then(r => r.body.filter(f => f.name === name));

exports.deleteFormulaInstance = deleteFormulaInstance;
exports.deleteFormula = deleteFormula;
