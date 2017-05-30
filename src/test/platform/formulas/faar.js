const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

const manualFormula = require('./assets/formulas/faar');
const faarFormulaInstance = {
  name: 'faar-instance',
  settings: {
    api: 'POST /churros-resource',
  },
};
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

suite.forPlatform('formulas', {name: 'FaaRs'}, test => {
  before(() => {
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
      .then(r => runCb(formula, formulaInstance, '/churros-resource'))
      .then(() => cleanup(formula ? formula.id : null, formulaInstance ? formulaInstance.id : null))
      .catch(e => {
        return cleanup(formula ? formula.id : null, formulaInstance ? formulaInstance.id : null).then(() => {
          throw e;
        });
      });
  };

  it('should allow exposing a formula instance as a synchronous POST API resource', () => {
    const run = (formula, formulaInstance) => {
      return cloud.post('/churros-resource', {foo: 'bar'}).then(r => {
        expect(r.body).to.be.an('object');
        expect(Object.keys(r.body)).to.have.length.above(0);
        return r;
      });
    };

    return runFaarSetup(run);
  });

  it('should not allow exposing two formula instances as the same API', () => {
    const run = (formula, formulaInstance) => {
      const badFormulaInstance = {name: 'DontCreateMe', settings: {api: faarFormulaInstance.settings.api}};
      const v = r => {
        // should show a conflict status, as well as the other formula instance with this API in the name
        expect(r).to.have.statusCode(409);
        expect(r.body.message).to.contain(formulaInstance.name);
      };
      return cloud.post(`/formulas/${formula.id}/instances`, badFormulaInstance, v);
    };

    return runFaarSetup(run);
  });

  it('should not allow exposing a formula instance that does not have a manual trigger', () => {
    const scheduledFormula = Object.assign({}, manualFormula, {triggers: [scheduledTrigger]});
    const v = r => expect(r).to.have.statusCode(400);
    let formula;
    return cloud
      .post(`/formulas`, scheduledFormula)
      .then(r => (formula = r.body))
      .then(() => cloud.post(`/formulas/${formula.id}/instances`, faarFormulaInstance, v));
  });

  it('should not allow creating a formula instance if the settings API is not set properly', () => {
    const v = r => expect(r).to.have.statusCode(400);
    let formula;
    return cloud.post(`/formulas`, manualFormula).then(r => (formula = r.body))
      .then(() => cloud.post(`/formulas/${formula.id}/instances`, { name: 'bad', settings: { api: '/bingo', }, }, v))
      .then(() => cloud.post(`/formulas/${formula.id}/instances`, { name: 'bad', settings: { api: 'GET', }, }, v))
      .then(() => cloud.post(`/formulas/${formula.id}/instances`, { name: 'bad', settings: { api: 'GET missing-a-slash', }, }, v));
  });
});
