'use strict';

const suite = require('core/suite');
const schema = require('./assets/schemas/formula.schema');
const common = require('./assets/common');
const cloud = require('core/cloud');
const expect = require('chakram').expect;
const tools = require('core/tools');

const genGoodV1Script = () => "return {foo: 'bar'};";

const genGoodV2Script = () => "done({foo: 'bar'});";

const genGoodV2ScriptWithFunction = () => "const promiseMe = () => { return new Promise((res, rej) => res('resolved')); }; promiseMe() .then(r => done({ status: r }));";

const genBadV2Script = () => "'use strict'; let name = 'foo';";

const genBaseStep = (engine, genScript) => ({
  name: `churros-script-${tools.random()}`,
  type: "script",
  properties: {
    mimeType: "application/javascript",
    scriptEngine: engine,
    body: genScript()
  }
});

const genVersionlessStep = (genScript) => genBaseStep(null, genScript);

const genV1Step = (genScript) => genBaseStep('v1', genScript);

const genV2Step = (genScript) => genBaseStep('v2', genScript);

const gen = (genStep) => (genScript) => {
  genStep = typeof genStep === 'function' ? genStep : () => {};
  genScript = typeof genScript === 'function' ? genScript : () => {};

  const f = common.genFormula({});
  f.steps = [genStep(genScript)];
  return f;
};

/**
 * Handles validating that formula script steps that are trying to be created have the right error handling capabilities
 * around them
 */
suite.forPlatform('formulas', { name: 'formula script steps', schema: schema }, (test) => {
  test
    .withName('should allow creating a script step with the v1 engine')
    .withJson(gen(genV1Step)(genGoodV1Script))
    .should.supportCd();

  test
    .withName('should allow creating a script step with the v2 engine')
    .withJson(gen(genV2Step)(genGoodV2Script))
    .should.supportCd();

  test
    .withName('should allow creating a script with a helper function that has a return statement in the v2 engine')
    .withJson(gen(genV2Step)(genGoodV2ScriptWithFunction))
    .should.supportCd();

  test
    .withName('should not allow creating a script with a return statement in the v2 engine')
    .withJson(gen(genV2Step)(genGoodV1Script))
    .should.return400OnPost();

  test
    .withName('should not allow creating a script without a done() callback in the v2 engine')
    .withJson(gen(genV2Step)(genBadV2Script))
    .should.return400OnPost();

  it('should not allow adding a filter step to a formula using the v2 engine with no done() callback', () => {
    const validator = (res) => {
      expect(res).to.have.statusCode(400);
      expect(res.body.message).to.be.a('string');
      expect(res.body.message).to.contain('done()'); // should warn about NOT calling the done() callback
      return res;
    };

    let formulaId;
    return cloud.post(test.api, gen()())
      .then(r => formulaId = r.body.id)
      .then(r => cloud.post(`${test.api}/${formulaId}/steps`, genV2Step(genBadV2Script), validator))
      .then(r => cloud.delete(`${test.api}/${formulaId}`));
  });

  it('should set the script engine to v1 when adding a step to a formula that contains all v1 steps', () => {
    const validator = (r) => {
      expect(r).to.have.statusCode(200);
      expect(r.body).to.not.be.null;
      expect(r.body.properties.scriptEngine).to.equal('v1');
    };

    let formulaId;
    return cloud.post(test.api, gen(genV1Step)(genGoodV1Script))
      .then(r => formulaId = r.body.id)
      .then(r => cloud.post(`${test.api}/${formulaId}/steps`, genVersionlessStep(genGoodV1Script), validator))
      .then(r => cloud.delete(`${test.api}/${formulaId}`));
  });

  it('should not set the script engine property when adding a step to a formula that does not contain all v1 steps', () => {
    const validator = (r) => {
      expect(r).to.have.statusCode(200);
      expect(r.body).to.not.be.null;
      expect(r.body.properties.scriptEngine).to.be.undefined;
    };

    let formulaId;
    return cloud.post(test.api, gen(genVersionlessStep)(genGoodV2Script))
      .then(r => formulaId = r.body.id)
      .then(r => cloud.post(`${test.api}/${formulaId}/steps`, genVersionlessStep(genGoodV2Script), validator))
      .then(r => cloud.delete(`${test.api}/${formulaId}`));
  });
});
