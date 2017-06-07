const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

const manualFormulaTemplate = require('./assets/formulas/faar');
const manualFormula = Object.assign({}, manualFormulaTemplate, {
  uri: '/churros-resource',
  method: 'POST',
});
const faarFormulaInstance = { name: 'faar-instance' };
const scheduledTrigger = {
  type: 'scheduled',
  onSuccess: manualFormula.triggers[0].onSuccess,
  properties: {
    cron: '0 0/60 * 1/1 * ? *',
  },
};

/**
 * Will cleanup the given formula and/or formula instance in the proper order
 */
const cleanup = (formulaId, formulaInstanceId) => {
  if (formulaInstanceId) {
    return cloud.delete(`/formulas/instances/${formulaInstanceId}`).then(() => cloud.delete(`/formulas/${formulaId}`));
  } else if (formulaId) {
    return cloud.delete(`/formulas/${formulaId}`);
  }
  return Promise.resolve();
};

suite.forPlatform('formulas', { name: 'FaaRs' }, test => {
  beforeEach(() => {
    const filter = name => name === manualFormula.name;
    return cloud
      .get('/formulas/instances')
      .then(r => Promise.all(r.body.filter(fi => filter(fi.formula.name)).map(fi => cleanup(fi.formula.id, fi.id))))
      .then(() => cloud.get('/formulas'))
      .then(r => Promise.all(r.body.filter(f => filter(f.name)).map(f => cleanup(f.id))));
  });

  const runFaarSetup = runCb => {
    let formula, formulaInstance;
    return cloud
      .post('/formulas', manualFormula)
      .then(r => (formula = r.body))
      .then(() => cloud.post(`/formulas/${formula.id}/instances`, faarFormulaInstance))
      .then(r => (formulaInstance = r.body))
      .then(r => runCb(formula, formulaInstance, manualFormula.uri))
      .then(() => cleanup(formula ? formula.id : null, formulaInstance ? formulaInstance.id : null))
      .catch(e => {
        return cleanup(formula ? formula.id : null, formulaInstance ? formulaInstance.id : null).then(() => {
          throw e;
        });
      });
  };

  it('should allow exposing a formula instance as a synchronous POST API resource', () => {
    const run = (formula, formulaInstance) => {
      const opts = { headers: { 'Elements-Formula-Instance-Id': formulaInstance.id } };
      return cloud.withOptions(opts).post(manualFormula.uri, { foo: 'bar' }).then(r => {
        expect(r.body).to.be.an('object');
        expect(Object.keys(r.body)).to.have.length.above(0);
        return r;
      });
    };

    return runFaarSetup(run);
  });

  it('should not allow exposing a formula that does not have a manual trigger', () => {
    const scheduledFormula = Object.assign({}, manualFormula, { triggers: [scheduledTrigger] });
    const v = r => expect(r).to.have.statusCode(400);
    return cloud.post(`/formulas`, scheduledFormula, v);
  });

  it('should not allow creating a formula if the API URI or method is set incorrectly', () => {
    const v = r => expect(r).to.have.statusCode(400);
    let formula;
    return cloud
      .post(`/formulas`, manualFormula)
      .then(r => (formula = r.body))
      .then(() => cloud.post(`/formulas/${formula.id}/instances`, { name: 'bad', settings: { api: '/bingo' } }, v))
      .then(() => cloud.post(`/formulas/${formula.id}/instances`, { name: 'bad', settings: { api: 'GET' } }, v))
      .then(() => cloud.post(`/formulas/${formula.id}/instances`, { name: 'bad', settings: { api: 'GET missing-a-slash' } }, v))
      .then(() => cloud.post(`/formulas/${formula.id}/instances`, { name: 'bad', settings: { api: 'GET /accounts' } }, v))
      .then(() => cloud.post(`/formulas/${formula.id}/instances`, { name: 'bad', settings: { api: 'GET /formulas/instances' } }, v));
  });
});
