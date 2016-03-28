'use strict';

const provisioner = require('core/provisioner');
const tools = require('core/tools');
const suite = require('core/suite');
const cloud = require('core/cloud');
const chakram = require('chakram');
const expect = chakram.expect;
const schema = require('./assets/schemas/formula.schema');
const triggerSchema = require('./assets/schemas/formula.trigger.schema');
const instanceSchema = require('./assets/schemas/formula.instance.schema');
const common = require('./assets/common');

suite.forPlatform('formulas', common.genFormula({}), schema, (test) => {

  test.should.supportCrud(chakram.put);

  it('should allow adding and removing "scheduled" trigger to a formula', () => {
    const f = common.genFormula({});
    const t = common.genTrigger({});

    let formulaId;
    return cloud.post(test.api, f, schema)
      .then(r => formulaId = r.body.id)
      .then(r => cloud.post(`${test.api}/${formulaId}/triggers`, t, triggerSchema))
      .then(r => cloud.get(`${test.api}/${formulaId}/triggers/${r.body.id}`, triggerSchema))
      .then(r => cloud.delete(`/formulas/${formulaId}/triggers/${r.body.id}`))
      .then(r => cloud.delete(`/formulas/${formulaId}`));
  });

  it('should not allow an invalid cron for a "scheduled" trigger', () => {
    let formulaId;
    const f = common.genFormula({});
    const t = common.genTrigger({ properties: { cron: '0 0/14 * 1/1 * ? *' } });
    return cloud.post(test.api, f, schema)
      .then(r => formulaId = r.body.id)
      .then(r => cloud.post(`${test.api}/${formulaId}/triggers`, t, (r) => expect(r).to.have.statusCode(400)))
      .then(r => cloud.delete(`${test.api}/${formulaId}`));
  });

  it('should not allow creating an instance of a formula with an invalid on success step', () => {
    const f = common.genFormula({});
    const fi = common.genInstance({});
    const t = common.genTrigger({ onSuccess: ['fake-step-name'] });

    let formulaId;
    return cloud.post(test.api, f, schema)
      .then(r => formulaId = r.body.id)
      .then(r => cloud.post(`${test.api}/${formulaId}/triggers`, t, triggerSchema))
      .then(r => cloud.post(`/formulas/${formulaId}/instances`, fi, (r) => expect(r).to.have.statusCode(400)))
      .then(r => cloud.delete(`/formulas/${formulaId}`));
  });

  it('should allow creating a big azz formula and then an instance', () => {
    const genF = () => {
      let f = require('./assets/big-formula.json');
      f.name = tools.random();
      return f;
    };

    const genFi = (id) => {
      let fi = require('./assets/big-formula-instance.json');
      fi.configuration['sfdc.instance.id'] = id;
      fi.configuration['sailthru.instance.id'] = id;
      return fi;
    };

    let id, formulaId;
    return provisioner.create('jira')
      .then(r => id = r.body.id)
      .then(r => cloud.post(test.api, genF(), schema))
      .then(r => formulaId = r.body.id)
      .then(r => cloud.post(`/formulas/${formulaId}/instances`, genFi(id), instanceSchema))
      .then(r => cloud.delete(`/formulas/${formulaId}/instances/${r.body.id}`, formulaId, r.body.id))
      .then(r => cloud.delete(`/formulas/${formulaId}`))
      .then(r => provisioner.delete(id));
  });

  it('should allow exporting a formula', () => {
    const f = common.genFormula({});
    let formulaId;
    return cloud.post(test.api, f, schema)
      .then(r => formulaId = r.body.id)
      .then(r => cloud.get(`${test.api}/${formulaId}/export`))
      .then(r => expect(r.body.name).to.equal(f.name))
      .then(r => cloud.delete(`${test.api}/${formulaId}`));
  });

  test
    .withApi(test.api + '/-1/export')
    .should.return404OnGet();

  it('should allow publishing and un-publishing a formula', () => {
    const f = common.genFormula({});
    const fUpdate = (isPublished) => ({ name: f.name, published: isPublished });

    const validator = (response, isPublished) => {
      expect(response.body.published).to.equal(isPublished);
      return response;
    };

    let formulaId;
    return cloud.post(test.api, f, schema)
      .then(r => validator(r, false))
      .then(r => formulaId = r.body.id)
      .then(r => cloud.put(`${test.api}/${formulaId}`, fUpdate(true), schema))
      .then(r => validator(r, true))
      .then(r => cloud.put(`${test.api}/${formulaId}`, fUpdate(false), schema))
      .then(r => validator(r, false))
      .then(r => cloud.delete(`${test.api}/${formulaId}`));
  });
});
