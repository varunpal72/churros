'use strict';

const util = require('util');
const chakram = require('chakram');
const expect = chakram.expect;
const formulaSchema = require('../assets/formula.schema.json');
const formulaTriggerSchema = require('../assets/formula-trigger.schema.json');

const formulaGen = (opts) => new Object({
  name: (opts.name || 'churros-formula-name-' + Math.random().toString(36).substring(7))
});

describe('formulas APIs', () => {
  it('should allow creating, retrieving and deleting a simple formula', () => {
    const f = formulaGen({});

    var url = '/formulas';
    return chakram.post(url, f)
      .then((r) => {
        expect(r).to.have.status(200);
        expect(r).to.have.schema(formulaSchema);
        return chakram.get(util.format('%s/%s', url, r.body.id));
      })
      .then((r) => {
        expect(r).to.have.status(200);
        expect(r).to.have.schema(formulaSchema);
        return chakram.delete(util.format('%s/%s', url, r.body.id));
      })
      .then((r) => {
        expect(r).to.have.status(200);
      });
  });

  it('should allow adding and removing "scheduled" trigger to a formula', () => {
    const f = formulaGen({});

    var formulaId;
    var url = '/formulas';
    return chakram.post(url, f)
      .then((r) => {
        expect(r).to.have.status(200);
        expect(r).to.have.schema(formulaSchema);

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
        expect(r).to.have.schema(formulaTriggerSchema);
        return chakram.get(util.format('/formulas/%s/triggers/%s', formulaId, r.body.id));
      })
      .then((r) => {
        expect(r).to.have.status(200);
        expect(r).to.have.schema(formulaTriggerSchema);

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
        expect(r).to.have.schema(formulaSchema);

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
        expect(r).to.have.schema(formulaSchema);

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
});
