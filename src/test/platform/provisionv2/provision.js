const provisioner = require('core/provisioner');
const suite = require('core/suite');
const expect = require('chakram').expect;
const config = {
  "oauth.callback.url":"https://auth.cloudelements.io/oauth",
};

suite.forPlatform('provisionv2', (test) => {
  let instanceId;
  let instanceId2;
   it('should create an instance or something', () => {
     return provisioner.create('zendesk')
     .then(r => {instanceId = r.body.id;});
   });

  it('should re-provision instance created in v1 with v2', () => {
   return provisioner.updateWithDefault('zendesk--oauthtest', config, null, instanceId)
   .then(r => expect(r.body.id).to.equal(instanceId));
  });

  it('should provision instance with v2 and non default api key/secret', () => {
   return provisioner.create('zendesk--oauthtest-non-default')
   .then(r => expect(r.body.id).to.not.be.null);
  });

  it('should create an instance or something', () => {
    return provisioner.create('zendesk')
    .then(r => {instanceId2 = r.body.id;});
  });

  it('should update instance with v2 and non default api key/secret', () => {
   return provisioner.update('zendesk--oauthtest-non-default', instanceId2)
   .then(r => expect(r.body.id).to.not.be.null);
  });

});
