'use strict';

const ei = require('core/element-instances');
const util = require('util');
const chocolate = require('core/chocolate');
const tester = require('core/tester');
const chakram = require('chakram');
const expect = chakram.expect;
const schema = require('./assets/formula.schema');
const triggerSchema = require('./assets/formula.trigger.schema');

const genFormula = (opts) => new Object({
  name: (opts.name || 'churros-formula-name-' + chocolate.random())
});

const genTrigger = (opts) => new Object({
  type: (opts.type || 'scheduled'),
  properties: (opts.properties) || {
    cron: '0 0/15 * 1/1 * ? *'
  }
});

tester.for(null, 'formulas', (api) => {
  tester.test.crud(api, genFormula({}), schema, chakram.put);

  it('should allow adding and removing "scheduled" trigger to a formula', () => {
    const f = genFormula({});
    const t = genTrigger({});

    var formulaId;
    return tester.post(api, f, schema)
      .then(r => {
        formulaId = r.body.id;
        const url = util.format('%s/%s/triggers', api, formulaId);
        return tester.post(url, t, triggerSchema);
      })
      .then(r => {
        const url = util.format('%s/%s/triggers/%s', api, formulaId, r.body.id);
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

    var formulaId;
    var api = '/formulas';
    return chakram.post(api, f)
      .then(r => {
        expect(r).to.have.schemaAnd200(schema);

        formulaId = r.body.id;
        const t = {
          type: 'scheduled',
          properties: {
            cron: '0 0/14 * 1/1 * ? *'
          }
        };
        return chakram.post(util.format('/formulas/%s/triggers', formulaId), t);
      })
      .then(r => {
        expect(r).to.have.statusCode(400);
        return chakram.delete(util.format('/formulas/%s', formulaId));
      })
      .then(r => {
        expect(r).to.have.statusCode(200);
      });
  });

  it('should not allow creating an instance of a formula with an invalid on success step', () => {
    const f = genFormula({});

    var formulaId;
    var api = '/formulas';
    return chakram.post(api, f)
      .then(r => {
        expect(r).to.have.schemaAnd200(schema);

        formulaId = r.body.id;
        const t = {
          type: 'scheduled',
          properties: {
            cron: '0 0/15 * 1/1 * ? *'
          },
          onSuccess: ['fake-step-name']
        };
        return chakram.post(util.format('/formulas/%s/triggers', formulaId), t);
      })
      .then(r => {
        expect(r).to.have.statusCode(200);
        const fi = {
          name: 'churros-formula-instance-name'
        };
        return chakram.post(util.format('/formulas/%s/instances', formulaId), fi);
      })
      .then(r => {
        expect(r).to.have.statusCode(400);
        return chakram.delete(util.format('/formulas/%s', formulaId));
      })
      .then(r => {
        expect(r).to.have.statusCode(200);
      });
  });

  it('should allow creating a big azz formula and then an instance', () => {
    return ei.create('jira')
      .then(r => {
        const id = r.body.id;

        var bigAzzFi = require('./assets/big-formula-instance.json');
        Object.keys(bigAzzFi.configuration).forEach(key => {
          bigAzzFi.configuration[key] = util.format(bigAzzFi.configuration[key], id);
        });

        var bigAzzF = require('./assets/big-formula.json');
        bigAzzF.name = chocolate.random();
        var formulaId;
        var api = '/formulas';
        return chakram.post(api, bigAzzF)
          .then(r => {
            expect(r).to.have.schemaAnd200(schema);

            formulaId = r.body.id;
            return chakram.post(util.format('/formulas/%s/instances', formulaId), bigAzzFi);
          })
          .then(r => {
            expect(r).to.have.statusCode(200);
            return chakram.delete(util.format('/formulas/%s/instances/%s', formulaId, r.body.id));
          })
          .then(r => {
            expect(r).to.have.statusCode(200);
            return chakram.delete(util.format('/formulas/%s', formulaId));
          })
          .then(r => {
            expect(r).to.have.statusCode(200);
            return ei.delete(id);
          });
      });
  });
});
