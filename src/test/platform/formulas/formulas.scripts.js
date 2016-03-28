'use strict';

const suite = require('core/suite');
const schema = require('./assets/schemas/formula.schema');
const common = require('./assets/common');
const cloud = require('core/cloud');
const expect = require('chakram').expect;

const genGoodV1Script = () => "return {foo: 'bar'};";

const genGoodV2Script = () => "done({foo: 'bar'});";

const genGoodV2ScriptWithFunction = () => "const promiseMe = () => { return new Promise((res, rej) => res('resolved')); }; promiseMe() .then(r => done({ status: r }));";

const genBadV2Script = () => "'use strict'; let name = 'foo';";

const genBaseStep = (engine, genScript) => ({
  name: "churros-script",
  type: "script",
  properties: {
    mimeType: "application/javascript",
    scriptEngine: engine,
    body: genScript()
  }
});

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
suite.forPlatform('formulas', null, schema, (test) => {
  test
    .withName('should allow creating a script step with the v1 engine')
    .withJson(gen(genV1Step)(genGoodV1Script))
    .should.supportCd();

  test
    .withName('should allow creating a script step with the v2 engine')
    .withJson(gen(genV2Step)(genGoodV2Script))
    .should.supportCd();

  test
    .withName('should not allow creating a script without a return statement in the v1 engine')
    .withJson(gen(genV1Step)(genGoodV2Script))
    .should.return400OnPost();

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
});
