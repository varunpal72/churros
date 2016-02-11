'use strict';

const provisioner = require('core/provisioner');
const util = require('util');
const tools = require('core/tools');
const tester = require('core/tester');
const chakram = require('chakram');
const expect = chakram.expect;
const schema = require('./assets/formula.schema');
const triggerSchema = require('./assets/formula.trigger.schema');
const instanceSchema = require('./assets/formula.instance.schema');

const genFormula = (opts) => new Object({
  name: (opts.name || 'churros-formula-name-' + tools.random())
});

const genTrigger = (opts) => new Object({
  type: (opts.type || 'scheduled'),
  properties: (opts.properties) || {
    cron: '0 0/15 * 1/1 * ? *'
  },
  onSuccess: (opts.onSuccess || null)
});

const genInstance = (opts) => new Object({
  name: (opts.name || 'churros-formula-instance-name')
});

tester.forPlatform('formulas', genFormula({}), schema, (test) => {

  test.should.supportCrud(chakram.put);

  it('should allow adding and removing "scheduled" trigger to a formula', () => {
    const f = genFormula({});
    const t = genTrigger({});

    let formulaId;
    return tester.post(test.api, f, schema)
      .then(r => {
        formulaId = r.body.id;
        const url = util.format('%s/%s/triggers', test.api, formulaId);
        return tester.post(url, t, triggerSchema);
      })
      .then(r => {
        const url = util.format('%s/%s/triggers/%s', test.api, formulaId, r.body.id);
        return tester.get(url, triggerSchema);
      })
      .then(r => {
        const url = util.format('/formulas/%s/triggers/%s', formulaId, r.body.id);
        return tester.delete(url);
      })
      .then(r => {
        const url = util.format('/formulas/%s', formulaId);
        return tester.delete(url);
      });
  });

  it('should not allow an invalid cron for a "scheduled" trigger', () => {
    const f = genFormula({});

    let formulaId;
    return tester.post(test.api, f, schema)
      .then(r => {
        formulaId = r.body.id;

        const t = genTrigger({
          properties: {
            cron: '0 0/14 * 1/1 * ? *'
          }
        });
        const tApi = util.format('%s/%s/triggers', test.api, formulaId);

        return tester.post(tApi, t, (r) => expect(r).to.have.statusCode(400));
      })
      .then(r => tester.delete(test.api + '/' + formulaId));
  });

  it('should not allow creating an instance of a formula with an invalid on success step', () => {
    const f = genFormula({});

    let formulaId;
    return tester.post(test.api, f, schema)
      .then(r => {
        formulaId = r.body.id;
        const t = genTrigger({
          onSuccess: ['fake-step-name']
        });
        const tApi = util.format('%s/%s/triggers', test.api, formulaId);
        return tester.post(tApi, t, triggerSchema);
      })
      .then(r => {
        const fi = genInstance({});
        const iApi = util.format('/formulas/%s/instances', formulaId);
        return tester.post(iApi, fi, (r) => expect(r).to.have.statusCode(400));
      })
      .then(r => tester.delete(util.format('/formulas/%s', formulaId)));
  });

  it('should allow creating a big azz formula and then an instance', () => {
    return provisioner.create('jira')
      .then(r => {
        const id = r.body.id;

        let fi = require('./assets/big-formula-instance.json');
        Object.keys(fi.configuration).forEach(key => fi.configuration[key] = util.format(fi.configuration[key], id));

        let f = require('./assets/big-formula.json');
        f.name = tools.random();

        let formulaId;
        return tester.post(test.api, f, schema)
          .then(r => {
            formulaId = r.body.id;
            return tester.post(util.format('/formulas/%s/instances', formulaId), fi, instanceSchema);
          })
          .then(r => tester.delete(util.format('/formulas/%s/instances/%s', formulaId, r.body.id)))
          .then(r => tester.delete(util.format('/formulas/%s', formulaId)))
          .then(r => provisioner.delete(id));
      });
  });
});
