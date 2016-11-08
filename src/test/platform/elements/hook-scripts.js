'use strict';

const cloud = require('core/cloud');
const common = require('./assets/common.js');
const expect = require('chakram').expect;
const suite = require('core/suite');
const schema = require('./assets/element.hook.schema.json');
const logger = require('winston');

suite.forPlatform('element/element resource hook scripts', { schema: schema }, (test) => {
  let element, elementIdUrl, resourceIdUrl;
  before(() => common.deleteElementByKey('churros')
    .then(r => cloud.post('elements', common.genElement({})))
    .then(r => element = r.body)
    .then(r => elementIdUrl = `elements/${element.id}/hooks`)
    .then(r => cloud.post('elements/' + element.key + '/resources', common.genResource({})))
    .then(r => resourceIdUrl = `elements/${element.id}/resources/${r.body.id}/hooks`));

  after(() => cloud.delete('elements/' + element.key));

  /**
   * Wraps a validator in our standard validation, returning a function that can be executed to validate an HTTP response
   */
  const wrap = (validator, code) => {
    return (r) => {
      code = (code || 200);
      if (code === 200) expect(r).to.have.schema(schema);
      expect(r).to.have.statusCode(code);
      validator = (validator || ((hook) => logger.debug(`No validator to validate: ${JSON.stringify(hook)}`)));
      validator(r.body);
      return r;
    };
  };

  /**
   * Basic script test that just takes a hook to create and validator to go about validating that hook after it is successfully created
   */
  const scriptTest = (url, hook, validator) => cloud.post(`${url}`, hook, wrap(validator));

  const updateTest = (url, hook, validator, updateHook, updateValidator, code) => {
    return scriptTest(url, hook, validator)
      .then(r => cloud.put(`/${url}/${r.body.id}`, updateHook, wrap(updateValidator, code)));
  };

  /**
   * Basic validator that validates that there is a field on the hook called isLegacy that is set to the passed in boolean
   */
  const vTrue = (hook) => expect(hook.isLegacy).to.equal(true);
  const vFalse = (hook) => expect(hook.isLegacy).to.equal(false);

  /* element hooks */
  it('should set the default scripting engine to not be legacy for element hooks', () => scriptTest(elementIdUrl, common.genHook(), vFalse));
  it('should support setting the scripting engine to legacy for element hooks', () => scriptTest(elementIdUrl, common.genLegacyHook(), vTrue));
  it('should support setting the scripting engine to not be legacy for element hooks', () => scriptTest(elementIdUrl, common.genUpgradedHook(), vFalse));
  it('should allow updating a transformation script from legacy to not legacy for element hooks', () => updateTest(elementIdUrl, common.genLegacyHook(), vTrue, common.genUpgradedHook(), vFalse));
  it('should allow updating a transformation when both script engines are set to not legacy for element hooks', () => updateTest(elementIdUrl, common.genHook(), vFalse, common.genHook(), vFalse));
  it('should not allow updating a transformation script from not legacy to legacy for element hooks', () => updateTest(elementIdUrl, common.genUpgradedHook(), vFalse, common.genLegacyHook(), null, 400));
  it('should not allow updating a transformation script from no explicit script engine to not legacy for element hooks', () => updateTest(elementIdUrl, common.genHook(), vFalse, common.genLegacyHook(), null, 400));

  /* element resource hooks */
  it('should set the default scripting engine to not be legacy for element resource hooks', () => scriptTest(resourceIdUrl, common.genHook(), vFalse));
  it('should support setting the scripting engine to legacy for element resource hooks', () => scriptTest(resourceIdUrl, common.genLegacyHook(), vTrue));
  it('should support setting the scripting engine to not be legacy for element resource hooks', () => scriptTest(resourceIdUrl, common.genUpgradedHook(), vFalse));
  it('should allow updating a transformation script from legacy to not legacy for element resource hooks', () => updateTest(resourceIdUrl, common.genLegacyHook(), vTrue, common.genUpgradedHook(), vFalse));
  it('should allow updating a transformation when both script engines are set to not legacy for element resource hooks', () => updateTest(resourceIdUrl, common.genHook(), vFalse, common.genHook(), vFalse));
  it('should not allow updating a transformation script from not legacy to legacy for element resource hooks', () => updateTest(resourceIdUrl, common.genUpgradedHook(), vFalse, common.genLegacyHook(), null, 400));
  it('should not allow updating a transformation script from no explicit script engine to not legacy for element resource hooks', () => updateTest(resourceIdUrl, common.genHook(), vFalse, common.genLegacyHook(), null, 400));
});
