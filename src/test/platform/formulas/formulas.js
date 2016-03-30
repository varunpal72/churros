'use strict';

const provisioner = require('core/provisioner');
const util = require('util');
const tools = require('core/tools');
const suite = require('core/suite');
const cloud = require('core/cloud');
const chakram = require('chakram');
const expect = chakram.expect;
const schema = require('./assets/formula.schema');
const triggerSchema = require('./assets/formula.trigger.schema');
const instanceSchema = require('./assets/formula.instance.schema');
const common = require('./assets/common');

const opts = { payload: common.genFormula({}), schema: schema };

suite.forPlatform('formulas', opts, (test) => {

  test.should.supportCrud(chakram.put);

  it('should allow adding and removing "scheduled" trigger to a formula', () => {
    const f = common.genFormula({});
    const t = common.genTrigger({});

    let formulaId;
    return cloud.post(test.api, f, schema)
      .then(r => {
        formulaId = r.body.id;
        const url = util.format('%s/%s/triggers', test.api, formulaId);
        return cloud.post(url, t, triggerSchema);
      })
      .then(r => {
        const url = util.format('%s/%s/triggers/%s', test.api, formulaId, r.body.id);
        return cloud.get(url, triggerSchema);
      })
      .then(r => {
        const url = util.format('/formulas/%s/triggers/%s', formulaId, r.body.id);
        return cloud.delete(url);
      })
      .then(r => {
        const url = util.format('/formulas/%s', formulaId);
        return cloud.delete(url);
      });
  });

  it('should not allow an invalid cron for a "scheduled" trigger', () => {
    const f = common.genFormula({});

    let formulaId;
    return cloud.post(test.api, f, schema)
      .then(r => {
        formulaId = r.body.id;

        const t = common.genTrigger({
          properties: {
            cron: '0 0/14 * 1/1 * ? *'
          }
        });
        const tApi = util.format('%s/%s/triggers', test.api, formulaId);

        return cloud.post(tApi, t, (r) => expect(r).to.have.statusCode(400));
      })
      .then(r => cloud.delete(test.api + '/' + formulaId));
  });

  it('should not allow creating an instance of a formula with an invalid on success step', () => {
    const f = common.genFormula({});

    let formulaId;
    return cloud.post(test.api, f, schema)
      .then(r => {
        formulaId = r.body.id;
        const t = common.genTrigger({
          onSuccess: ['fake-step-name']
        });
        const tApi = util.format('%s/%s/triggers', test.api, formulaId);
        return cloud.post(tApi, t, triggerSchema);
      })
      .then(r => {
        const fi = common.genInstance({});
        const iApi = util.format('/formulas/%s/instances', formulaId);
        return cloud.post(iApi, fi, (r) => expect(r).to.have.statusCode(400));
      })
      .then(r => cloud.delete(util.format('/formulas/%s', formulaId)));
  });

  it('should allow creating a big azz formula and then an instance', () => {
    return provisioner.create('jira')
      .then(r => {
        const id = r.body.id;

        let fi = require('./assets/big-formula-instance.json');
        fi.configuration['sfdc.instance.id'] = id;
        fi.configuration['sailthru.instance.id'] = id;

        let f = require('./assets/big-formula.json');
        f.name = tools.random();

        let formulaId;
        return cloud.post(test.api, f, schema)
          .then(r => {
            formulaId = r.body.id;
            return cloud.post(util.format('/formulas/%s/instances', formulaId), fi, instanceSchema);
          })
          .then(r => cloud.delete(util.format('/formulas/%s/instances/%s', formulaId, r.body.id)))
          .then(r => cloud.delete(util.format('/formulas/%s', formulaId)))
          .then(r => provisioner.delete(id));
      });
  });

  it('should allow exporting a formula', () => {
    const f = common.genFormula({});
    let formulaId;
    return cloud.post(test.api, f, schema)
      .then(r => formulaId = r.body.id)
      .then(r => cloud.get(test.api + '/' + formulaId + '/export', (r) => {
        expect(r).to.have.statusCode(200);
        expect(r.body.name).to.equal(f.name);
      }))
      .then(r => cloud.delete(test.api + '/' + formulaId));
  });

  test.withApi(test.api + '/-1/export').should.return404OnGet();
});
