'use strict';

const cloud = require('core/cloud');
const expect = require('chakram').expect;
const provisioner = require('core/provisioner');
const suite = require('core/suite');

suite.forPlatform('transformation scripts', (test) => {
  let closeioId, contactId;
  before(() => provisioner.create('closeio')
    .then(r => closeioId = r.body.id)
    .then(r => cloud.get(`/hubs/crm/contacts`), (r) => expect(r.body.length).to.be.above(0)) // make sure we have a contact in this system or we can't run these tests
    .then(r => contactId = r.body[0].id));

  after(() => closeioId && provisioner.delete(closeioId));

  /**
   * Main wrapper for a test that goes about creating the object definitions, transformation, and then retrieving a contact
   * that is validated against your custom validator function.  Lastly, this function goes about cleaning up the created
   * object definition and transformation for the element instance ID that is used throughout all tests.
   */
  const scriptTest = (transformation, opts) => {
    const definitions = require('./assets/object-definitions');
    const options = (opts || { isCleanup: true }); // default to cleaning up resources

    const validatorWrapper = (r) => {
      const validator = (options.validator || ((object) => expect(object.foo).to.equal('bar')));
      expect(r).to.have.statusCode(200);
      expect(r.body).to.not.be.null;
      validator(r.body);
      return r;
    };

    return cloud.post(`/instances/${closeioId}/objects/contacts/definitions`, definitions)
      .then(r => cloud.post(`/instances/${closeioId}/transformations/contacts`, transformation))
      .then(r => cloud.get(`/hubs/crm/contacts/${contactId}`, validatorWrapper))
      .then(r => options.isCleanup ? cloud.delete(`/instances/${closeioId}/transformations/contacts`) : r)
      .then(r => options.isCleanup ? cloud.delete(`/instances/${closeioId}/objects/contacts/definitions`) : r);
  };

  /**
   * Represents a good update script test, where going from the original transformation to the updated transformation
   * should be successful and the API call should transform data properly.
   */
  const goodUpdateScriptTest = (original, update) => {
    return scriptTest(original, { isCleanup: false })
      .then(r => cloud.put(`/instances/${closeioId}/transformations/contacts`, update))
      .then(r => cloud.get(`/hubs/crm/contacts/${contactId}`, (r) => expect(r.body.foo).to.equal('bar')))
      .then(r => cloud.delete(`/instances/${closeioId}/transformations/contacts`))
      .then(r => cloud.delete(`/instances/${closeioId}/objects/contacts/definitions`));
  };

  /**
   * Represents a bad update script test, where going from the original transformation to the updated transformation
   * should return a 400 as it is not permitted.
   */
  const badUpdateScriptTest = (original, update) => {
    return scriptTest(original, { isCleanup: false })
      .then(r => cloud.put(`/instances/${closeioId}/transformations/contacts`, update, (r) => expect(r).to.have.statusCode(400)))
      .then(r => cloud.delete(`/instances/${closeioId}/transformations/contacts`))
      .then(r => cloud.delete(`/instances/${closeioId}/objects/contacts/definitions`));
  };

  it('should set the default scripting engine to v2', () => {
    const transformation = require('./assets/simple-transformation');
    return scriptTest(transformation);
  });

  it('should support setting the scripting engine to v1', () => {
    const transformation = require('./assets/simple-v1-transformation');
    return scriptTest(transformation);
  });

  it('should support setting the scripting engine to v2', () => {
    const transformation = require('./assets/simple-v2-transformation');
    return scriptTest(transformation);
  });

  it('should allow updating a transformation script from v1 to v2', () => {
    const transformationV1 = require('./assets/simple-v1-transformation');
    const transformationV2 = require('./assets/simple-v2-transformation');
    return goodUpdateScriptTest(transformationV1, transformationV2);
  });

  it('should allow updating a transformation when both script engines are set to v2', () => {
    const transformationV2 = require('./assets/simple-v2-transformation');
    return goodUpdateScriptTest(transformationV2, transformationV2);
  });

  it('should not allow updating a transformation script from v2 to v1', () => {
    const transformationV2 = require('./assets/simple-v2-transformation');
    const transformationV1 = require('./assets/simple-v1-transformation');
    return badUpdateScriptTest(transformationV2, transformationV1);
  });

  it('should not allow updating a transformation with no explicit script engine set to v1', () => {
    const transformation = require('./assets/simple-transformation');
    const transformationV1 = require('./assets/simple-v1-transformation');
    return badUpdateScriptTest(transformation, transformationV1);
  });
});
