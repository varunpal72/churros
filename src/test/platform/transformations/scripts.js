'use strict';

const cloud = require('core/cloud');
const expect = require('chakram').expect;
const provisioner = require('core/provisioner');
const suite = require('core/suite');

suite.forPlatform('transformation scripts', (test) => {
  /* Setup and teardown */
  let closeioId;
  before(() => provisioner.create('closeio')
    .then(r => closeioId = r.body.id));

  after(() => closeioId && provisioner.delete(closeioId));

  const scriptTest = (transformation, validator) => {
    const definitions = require('./assets/object-definitions');

    const contactExists = (r) => {
      expect(r).to.have.statusCode(200);
      expect(r.body.length).to.be.above(0);
      return r;
    };

    return cloud.post(`/instances/${closeioId}/objects/contacts/definitions`, definitions)
      .then(r => cloud.post(`/instances/${closeioId}/transformations/contacts`, transformation))
      .then(r => cloud.get(`/hubs/crm/contacts`, contactExists))
      .then(r => cloud.get(`/hubs/crm/contacts/${r.body[0].id}`));
  };

  it('should set the default scripting engine to v2', () => {
    const transformation = require('./assets/simple-transformation');

    const validator = (transformations) => {
      console.log(`Validate me please: ${JSON.stringify(transformations)}`);
    };

    return scriptTest(transformation, validator);
  });

  it('should support setting the scripting engine to v1');
  it('should allow updating a transformation script from v1 to v2');
  it('should not allow updating a transformation script from v2 to v1');
});
