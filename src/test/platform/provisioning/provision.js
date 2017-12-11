const provisioner = require('core/provisioner');
const suite = require('core/suite');
const expect = require('chakram').expect;
const cloud = require('core/cloud');
const config = {
  "oauth.callback.url":"https://auth.cloudelements.io/oauth",
};

suite.forPlatform('provisionv2', (test) => {
  let oauth2instanceId, oauth2instanceId2, oauth2instanceId3, oauth2instanceId4, oauth1instanceId, oauth1instanceId2;

  after(() => {
    return cloud.delete(`instances/${oauth2instanceId}`)
    .then(r => cloud.delete(`instances/${oauth2instanceId2}`))
    .then(r => cloud.delete(`instances/${oauth2instanceId3}`))
    .then(r => cloud.delete(`instances/${oauth2instanceId4}`))
    .then(r => cloud.delete(`instances/${oauth1instanceId}`))
    .then(r => cloud.delete(`instances/${oauth1instanceId2}`));

  });

   it('should create an instance or something', () => {
     return provisioner.create('zendesk')
     .then(r => {oauth2instanceId = r.body.id;});
   });

  it('should re-provision instance created in v1 with v2', () => {
   return provisioner.updateWithDefault('zendesk--oauthtest', config, null, oauth2instanceId)
   .then(r => expect(r.body.id).to.equal(oauth2instanceId));
  });

  it('should provision instance with v2 and non default api key/secret', () => {
   return provisioner.create('zendesk--oauthtest-non-default')
   .then(r => {
     oauth2instanceId3 = r.body.id;
     return r;
   })
   .then(r => expect(r.body.id).to.not.be.null);
  });

  it('should provision instance with v2 and non default api key/secret', () => {
   return provisioner.createWithDefault('zendesk--oauthtest')
   .then(r => {
     oauth2instanceId4 = r.body.id;
     return r;
   })
   .then(r => expect(r.body.id).to.not.be.null);
  });

  it('should create an instance or something', () => {
    return provisioner.create('zendesk')
    .then(r => {oauth2instanceId2 = r.body.id;});
  });

  it('should update instance with v2 and non default api key/secret', () => {
   return provisioner.update('zendesk--oauthtest-non-default', null, null, oauth2instanceId2)
   .then(r => expect(r.body.id).to.equal(oauth2instanceId2));
  });

  //try some oauth1

  it('should do some oauth1 stuff', () => provisioner.create('desk')
  .then(r => {
    oauth1instanceId = r.body.id;
    return r;
  }));

  it('should do some oauth1 stuff', () => provisioner.createWithDefault('desk')
  .then(r => {
    oauth1instanceId2 = r.body.id;
    return r;
  }));

});
