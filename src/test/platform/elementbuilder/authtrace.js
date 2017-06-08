'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const provisioner = require('core/provisioner');

suite.forPlatform('authtrace', {}, (test) => {
  let traceId, instanceId;
  before(() => provisioner.create('actessentialsoauth', {debug : true}, 'elements/actessentialsoauth/instances')
      .then(r => {
        instanceId = r.body.id;
        traceId = r.response.headers['elements-trace-id'];
      }));

  it('should support calling trace API to get the auth trace', () => {
      return cloud.get(`/elements/actessentialsoauth/trace/${traceId}`, (r) => {
          expect(r.body).to.not.be.null;
          expect(r.body['POST:/oauth/oauth_token']).to.not.be.null;
      });
  });

  after(() => {
    return provisioner.delete(instanceId, 'elements/actessentialsoauth/instances');
  });
});
