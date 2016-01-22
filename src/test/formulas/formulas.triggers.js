'use strict';

const chocolate = require('core/chocolate');
const util = require('util');
const chakram = require('chakram');
const expect = chakram.expect;

const schema = require('./assets/formula.schema');
const triggerSchema = require('./assets/formula-trigger.schema');

describe('formula triggers', () => {
  it('should allow adding and removing "scheduled" trigger to a formula', () => {
    const f = chocolate.genFormula({});

    var formulaId;
    var url = '/formulas';
    return chakram.post(url, f)
      .then(r => {
        expect(r).to.have.schemaAnd200(schema);

        formulaId = r.body.id;
        const t = {
          type: 'scheduled',
          properties: {
            cron: '0 0/15 * 1/1 * ? *'
          }
        };
        return chakram.post(util.format('/formulas/%s/triggers', formulaId), t);
      })
      .then(r => {
        expect(r).to.have.schemaAnd200(triggerSchema);
        return chakram.get(util.format('/formulas/%s/triggers/%s', formulaId, r.body.id));
      })
      .then(r => {
        expect(r).to.have.schemaAnd200(triggerSchema);
        return chakram.delete(util.format('/formulas/%s/triggers/%s', formulaId, r.body.id));
      })
      .then(r => {
        expect(r).to.have.statusCode(200);
        return chakram.delete(util.format('/formulas/%s', formulaId));
      })
      .then(r => {
        expect(r).to.have.statusCode(200);
      });
  });

  it('should not allow an invalid cron for a "scheduled" trigger', () => {
    const f = chocolate.genFormula({});

    var formulaId;
    var url = '/formulas';
    return chakram.post(url, f)
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

});
