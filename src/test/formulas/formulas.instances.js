'use strict';

const chakram = require('chakram');
const expect = chakram.expect;
const util = require('util');
const chocolate = require('core/chocolate');
const formulasUtil = require('./formulas.util');
const ei = require('core/element-instances');

const schema = require('./assets/formula.schema');

describe('formula instances', () => {
  it('should not allow creating an instance of a formula with an invalid on success step', () => {
    const f = formulasUtil.gen({});

    var formulaId;
    var url = '/formulas';
    return chakram.post(url, f)
      .then(r => {
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
      .then(r => {
        expect(r).to.have.status(200);
        const fi = {
          name: 'churros-formula-instance-name'
        }
        return chakram.post(util.format('/formulas/%s/instances', formulaId), fi);
      })
      .then(r => {
        expect(r).to.have.status(400);
        return chakram.delete(util.format('/formulas/%s', formulaId));
      })
      .then(r => {
        expect(r).to.have.status(200);
      });
  });

  it('should allow creating a big azz formula and then an instance', () => {
    return ei.create('box')
      .then(r => {
        const id = r.body.id;

        var bigAzzFi = require('./assets/big-formula-instance.json');
        chocolate.replaceWith(bigAzzFi.configuration, id);

        var bigAzzF = require('./assets/big-formula.json');
        bigAzzF.name = chocolate.random();
        var formulaId;
        var url = '/formulas';
        return chakram.post(url, bigAzzF)
          .then(r => {
            expect(r).to.have.status(200);
            expect(r).to.have.schema(schema);

            formulaId = r.body.id;
            return chakram.post(util.format('/formulas/%s/instances', formulaId), bigAzzFi);
          })
          .then(r => {
            expect(r).to.have.status(200);
            return chakram.delete(util.format('/formulas/%s/instances/%s', formulaId, r.body.id));
          })
          .then(r => {
            expect(r).to.have.status(200);
            return chakram.delete(util.format('/formulas/%s', formulaId));
          })
          .then(r => {
            expect(r).to.have.status(200);
            return ei.delete(id);
          });
      });
  });
});
