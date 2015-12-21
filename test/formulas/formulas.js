'use strict';

const util = require('util');
const churrosUtil = require('../../core/src/util/churros-util');
const api = require('../../core/src/util/api-helper');
const ei = require('../../core/src/util/element-instances');
const chakram = require('chakram');
const expect = chakram.expect;

const schema = require('./assets/formula.schema');
const triggerSchema = require('./assets/formula-trigger.schema');

const formulaGen = (opts) => new Object({
  name: (opts.name || 'churros-formula-name-' + churrosUtil.random())
});

describe('formulas APIs', () => {
  it('should allow cruding a simple formula', () => {
    return api.crud('/formulas', formulaGen({}), schema);
  });

  it('should allow adding and removing "scheduled" trigger to a formula', () => {
    const f = formulaGen({});

    var formulaId;
    var url = '/formulas';
    return chakram.post(url, f)
      .then((r) => {
        expect(r).to.have.status(200);
        expect(r).to.have.schema(schema);

        formulaId = r.body.id;
        const t = {
          type: 'scheduled',
          properties: {
            cron: '0 0/15 * 1/1 * ? *'
          }
        };
        return chakram.post(util.format('/formulas/%s/triggers', formulaId), t);
      })
      .then((r) => {
        expect(r).to.have.status(200);
        expect(r).to.have.schema(triggerSchema);
        return chakram.get(util.format('/formulas/%s/triggers/%s', formulaId, r.body.id));
      })
      .then((r) => {
        expect(r).to.have.status(200);
        expect(r).to.have.schema(triggerSchema);
        return chakram.delete(util.format('/formulas/%s/triggers/%s', formulaId, r.body.id));
      })
      .then((r) => {
        expect(r).to.have.status(200);
        return chakram.delete(util.format('/formulas/%s', formulaId));
      })
      .then((r) => {
        expect(r).to.have.status(200);
      });
  });

  it('should not allow an invalid cron for a "scheduled" trigger', () => {
    const f = formulaGen({});

    var formulaId;
    var url = '/formulas';
    return chakram.post(url, f)
      .then((r) => {
        expect(r).to.have.status(200);
        expect(r).to.have.schema(schema);

        formulaId = r.body.id;
        const t = {
          type: 'scheduled',
          properties: {
            cron: '0 0/14 * 1/1 * ? *'
          }
        };
        return chakram.post(util.format('/formulas/%s/triggers', formulaId), t);
      })
      .then((r) => {
        expect(r).to.have.status(400);
        return chakram.delete(util.format('/formulas/%s', formulaId));
      })
      .then((r) => {
        expect(r).to.have.status(200);
      });
  });

  it('should not allow creating an instance of a formula with an invalid on success step', () => {
    const f = formulaGen({});

    var formulaId;
    var url = '/formulas';
    return chakram.post(url, f)
      .then((r) => {
        expect(r).to.have.status(200);
        expect(r).to.have.schema(schema);

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
      .then((r) => {
        expect(r).to.have.status(200);
        const fi = {
          name: 'churros-formula-instance-name'
        }
        return chakram.post(util.format('/formulas/%s/instances', formulaId), fi);
      })
      .then((r) => {
        expect(r).to.have.status(400);
        return chakram.delete(util.format('/formulas/%s', formulaId));
      })
      .then((r) => {
        expect(r).to.have.status(200);
      });
  });

  it('should allow creating a big azz formula and then an instance', () => {
    return ei.id().then((eiId) => {
      var bigAzzFi = require('./assets/big-formula-instance.json');
      churrosUtil.replaceWith(bigAzzFi.configuration, eiId);

      var bigAzzF = require('./assets/big-formula.json');
      bigAzzF.name = churrosUtil.random();
      var formulaId;
      var url = '/formulas';
      chakram.post(url, bigAzzF)
        .then((r) => {
          expect(r).to.have.status(200);
          expect(r).to.have.schema(schema);

          formulaId = r.body.id;
          return chakram.post(util.format('/formulas/%s/instances', formulaId), bigAzzFi);
        })
        .then((r) => {
          expect(r).to.have.status(200);
          return chakram.delete(util.format('/formulas/%s/instances/%s', formulaId, r.body.id));
        })
        .then((r) => {
          expect(r).to.have.status(200);
          return chakram.delete(util.format('/formulas/%s', formulaId));
        })
        .then((r) => {
          expect(r).to.have.status(200);
        });
    });
  });
});
