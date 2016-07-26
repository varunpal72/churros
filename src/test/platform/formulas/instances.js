'use strict';

const cleaner = require('core/cleaner');
const suite = require('core/suite');
const common = require('./assets/common');
const schema = require('./assets/schemas/formula.schema');
const fiSchema = require('./assets/schemas/formula.instance.schema');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

const opts = { name: 'formula instances', payload: common.genFormula({}), schema: schema };

suite.forPlatform('formulas', opts, (test) => {
  /* Create a formula instance to use in the tests below */
  let elementInstanceId, formulaId, formulaInstanceId;
  describe('general', () => {
    before(() => {
      return common.createFAndFI()
        .then(r => {
          formulaId = r.formulaId;
          formulaInstanceId = r.formulaInstanceId;
          elementInstanceId = r.elementInstanceId;
        });
    });

    /* 200 on DELETE and PUT to /formulas/:id/instances/:id/active to activate and deactivate instance */
    it('should allow activating and deactivating formula instance', () => {
      const baseApi = `/formulas/${formulaId}/instances/${formulaInstanceId}`;
      const api = `${baseApi}/active`;
      return cloud.delete(api)
        .then(r => cloud.get(baseApi))
        .then(r => expect(r.body.active).to.equal(false))
        .then(r => cloud.put(api))
        .then(r => cloud.get(baseApi))
        .then(r => expect(r.body.active).to.equal(true));
    });

    it('should allow updating a formula instance', () => {
      const formulaInstance = require('./assets/formulas/simple-successful-formula-instance');
      formulaInstance.configuration['trigger-instance'] = elementInstanceId;
      return cloud.put(`${test.api}/${formulaId}/instances/${formulaInstanceId}`, formulaInstance);
    });

    /* 404 on PUT where formula and formula instance do not exist */
    test
      .withApi('/formulas/-1/instances/-1/active')
      .should.return404OnPut();

    /* 404 on DELETE where formula and formula instance do not exist */
    test
      .withApi('/formulas/-1/instances/-1/active')
      .should.return404OnDelete();
  });

  describe('scheduled', () => {
    it('should create a job for a new active formula and active instance triggered by schedule', () => {
      const formula = require('./assets/formulas/simple-successful-scheduled-trigger-formula');
      const formulaInstance = require('./assets/formulas/simple-successful-formula-instance');

      formula.triggers[0].properties.cron = '0 0/60 * 1/1 * ? *';
      formula.active = true;
      formulaInstance.active = true;

      return cleaner.formulas.withName('simple-successful')
        .then(() => cloud.post(test.api, formula, schema))
        .then(r => formulaId = r.body.id)
        .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
        .then(r => formulaInstanceId = r.body.id)
        .then(() => cloud.get('/jobs'))
        .then(r => expect(r.body.filter(j => common.formulaJobId(formulaId, formulaInstanceId).indexOf(j.id) > -1)).to.have.length(1));
    });

    it('should not create a job for a new inactive formula and active instance triggered by schedule', () => {
      const formula = require('./assets/formulas/simple-successful-scheduled-trigger-formula');
      const formulaInstance = require('./assets/formulas/simple-successful-formula-instance');

      formula.triggers[0].properties.cron = '0 0/60 * 1/1 * ? *';
      formula.active = false;
      formulaInstance.active = true;

      return cleaner.formulas.withName('simple-successful')
        .then(() => cloud.post(test.api, formula, schema))
        .then(r => formulaId = r.body.id)
        .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
        .then(r => formulaInstanceId = r.body.id)
        .then(r => cloud.get('/jobs'))
        .then(r => expect(r.body.filter(j => common.formulaJobId(formulaId, formulaInstanceId).indexOf(j.id) > -1)).to.be.empty);
    });

    it('should not create a job for a new active formula and inactive instance triggered by schedule', () => {
      const formula = require('./assets/formulas/simple-successful-scheduled-trigger-formula');
      const formulaInstance = require('./assets/formulas/simple-successful-formula-instance');

      formula.triggers[0].properties.cron = '0 0/60 * 1/1 * ? *';
      formula.active = true;
      formulaInstance.active = false;

      return cleaner.formulas.withName('simple-successful')
        .then(() => cloud.post(test.api, formula, schema))
        .then(r => formulaId = r.body.id)
        .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
        .then(r => formulaInstanceId = r.body.id)
        .then(r => cloud.get('/jobs'))
        .then(r => expect(r.body.filter(j => common.formulaJobId(formulaId, formulaInstanceId).indexOf(j.id) > -1)).to.be.empty);
    });

    it('should create and delete jobs for a schedule triggered instance updated to active and inactive using the active endpoint', () => {
      const formula = require('./assets/formulas/simple-successful-scheduled-trigger-formula');
      const formulaInstance = require('./assets/formulas/simple-successful-formula-instance');

      formula.triggers[0].properties.cron = '0 0/60 * 1/1 * ? *';
      formulaInstance.active = false;

      return cleaner.formulas.withName('simple-successful')
        .then(() => cloud.post(test.api, formula, schema))
        .then(r => formulaId = r.body.id)
        // create the formula instance (inactive)
        .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
        .then(r => formulaInstanceId = r.body.id)
        // check that there is no job for it
        .then(() => cloud.get('/jobs'))
        .then(r => expect(r.body.filter(j => common.formulaJobId(formulaId, formulaInstanceId).indexOf(j.id) > -1)).to.be.empty)
        // switch it to active
        .then(() => cloud.put(`/formulas/${formulaId}/instances/${formulaInstanceId}/active`))
        // check that there is now a job for it
        .then(() => cloud.get('/jobs'))
        .then(r => expect(r.body.filter(j => common.formulaJobId(formulaId, formulaInstanceId).indexOf(j.id) > -1)).to.have.length(1))
        // switch it to inactive
        .then(() => cloud.delete(`/formulas/${formulaId}/instances/${formulaInstanceId}/active`))
        // yep, you guessed it, check that there is no longer a job for it
        .then(() => cloud.get('/jobs'))
        .then(r => expect(r.body.filter(j => common.formulaJobId(formulaId, formulaInstanceId).indexOf(j.id) > -1)).to.be.empty);
    });

    it('should create and delete jobs for a schedule triggered instance updated to active and inactive using a PUT', () => {
      const formula = require('./assets/formulas/simple-successful-scheduled-trigger-formula');
      const formulaInstance = require('./assets/formulas/simple-successful-formula-instance');

      formula.triggers[0].properties.cron = '0 0/60 * 1/1 * ? *';
      formulaInstance.active = false;

      let instanceBody;
      return cleaner.formulas.withName('simple-successful')
        .then(() => cloud.post(test.api, formula, schema))
        .then(r => formulaId = r.body.id)
        // create the formula instance (inactive)
        .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
        .then(r => { instanceBody = r.body; formulaInstanceId = r.body.id; })
        // check that there is no job for it
        .then(() => cloud.get('/jobs'))
        .then(r => expect(r.body.filter(j => common.formulaJobId(formulaId, formulaInstanceId).indexOf(j.id) > -1)).to.be.empty)
        // switch it to active
        .then(() => instanceBody.active = true)
        .then(() => cloud.put(`/formulas/${formulaId}/instances/${formulaInstanceId}`, instanceBody))
        .then(r => expect(r.body.active).to.equal(true))
        // check that there is now a job for it
        .then(r => cloud.get('/jobs'))
        .then(r => expect(r.body.filter(j => common.formulaJobId(formulaId, formulaInstanceId).indexOf(j.id) > -1)).to.have.length(1))
        // switch it to inactive
        .then(() => instanceBody.active = false)
        .then(() => cloud.put(`/formulas/${formulaId}/instances/${formulaInstanceId}`, instanceBody))
        .then(r => expect(r.body.active).to.equal(false))
        // yep, you guessed it, check that there is no longer a job for it
        .then(r => cloud.get('/jobs'))
        .then(r => expect(r.body.filter(j => common.formulaJobId(formulaId, formulaInstanceId).indexOf(j.id) > -1)).to.be.empty);
    });

    it('should create and delete jobs for a all schedule triggered instances with formula updated to active and inactive using a PUT', () => {
      const formula = require('./assets/formulas/simple-successful-scheduled-trigger-formula');
      const formulaInstance = require('./assets/formulas/simple-successful-formula-instance');

      formula.triggers[0].properties.cron = '0 0/60 * 1/1 * ? *';
      formula.active = true;
      formulaInstance.active = true;

      let formulaInstanceId2;
      return cleaner.formulas.withName('simple-successful')
        .then(() => cloud.post(test.api, formula, schema))
        .then(r => formulaId = r.body.id)

        // create the first active formula instance
        .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
        .then(r => formulaInstanceId = r.body.id)
        // check that there is a job for it
        .then(() => cloud.get('/jobs'))
        .then(r => expect(r.body.filter(j => common.formulaJobId(formulaId, formulaInstanceId).indexOf(j.id) > -1)).to.have.length(1))
        // create the second active formula instance
        .then(() => cloud.post(`/formulas/${formulaId}/instances`, formulaInstance, fiSchema))
        .then(r => formulaInstanceId2 = r.body.id)
        // check that there is a job for it
        .then(() => cloud.get('/jobs'))
        .then(r => expect(r.body.filter(j => common.formulaJobId(formulaId, formulaInstanceId2).indexOf(j.id) > -1)).to.have.length(1))

        // switch formula to inactive
        .then(() => formula.active = false)
        .then(() => cloud.put(`/formulas/${formulaId}`, formula))
        .then(r => expect(r.body.active).to.equal(false))
        // check that there is no job for either instance
        .then(r => cloud.get('/jobs'))
        .then(r => {
          expect(r.body.filter(j => common.formulaJobId(formulaId, formulaInstanceId).indexOf(j.id) > -1)).to.be.empty;
          expect(r.body.filter(j => common.formulaJobId(formulaId, formulaInstanceId2).indexOf(j.id) > -1)).to.be.empty;
        })

        // switch formula back to active
        .then(() => formula.active = true)
        .then(() => cloud.put(`/formulas/${formulaId}`, formula))
        .then(r => expect(r.body.active).to.equal(true))
        // yep, you guessed it, check that there are jobs for each instance
        .then(r => cloud.get('/jobs'))
        .then(r => {
          expect(r.body.filter(j => common.formulaJobId(formulaId, formulaInstanceId).indexOf(j.id) > -1)).to.have.length(1);
          expect(r.body.filter(j => common.formulaJobId(formulaId, formulaInstanceId2).indexOf(j.id) > -1)).to.have.length(1);
        })
        .then(() => common.deleteFormulaInstance(formulaId, formulaInstanceId2));
    });
  });

  /* Cleanup */
  after(() => common.cleanup(elementInstanceId, formulaId, formulaInstanceId));
});
