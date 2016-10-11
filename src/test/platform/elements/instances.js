'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const props = require('core/props');
const provisioner = require('core/provisioner');
const instanceSchema = require('./assets/element.instance.schema');
const instancesSchema = require('./assets/element.instances.schema');
const logger = require('winston');

const genInstance = (element, o) => ({
  name: (o.name || 'churros-instance'),
  providerData: (o.providerData || undefined),
  element: { key: element },
  configuration: props.all(element)
});

const crudsInstance = (baseUrl) => {
  let id;
  return provisioner.create('jira', undefined, baseUrl)
    .then(r => id = r.body.id)
    .then(r => cloud.get(`${baseUrl}/${id}`, (r) => {
      expect(r).to.have.schemaAnd200(instanceSchema);
      expect(r.body.configuration).to.not.be.empty;
      expect(r.body.configuration.password).to.equal("********");
      expect(r.body.configuration.username).to.equal(props.getForKey('jira', 'username'));
    }))
    .then(r => cloud.get(`${baseUrl}`, instancesSchema))
    .then(r => expect(r.body.length).to.be.above(0))
    .then(r => cloud.put(`${baseUrl}/${id}`, genInstance('jira', { name: 'updated-instance' })))
    .then(r => provisioner.delete(id, baseUrl));
};

const updateInstanceWithReprovision = (baseUrl, schema) => {
  let id;
  return provisioner.create('shopify')
    .then(r => id = r.body.id)
    .then(r => cloud.get(`${baseUrl}/${id}`, (r) => {
      expect(r).to.have.schemaAnd200(schema);
      expect(r.body.configuration).to.not.be.empty;
      expect(r.body.configuration.password).to.equal("********");
      expect(r.body.configuration.username).to.equal(props.getForKey('shopify', 'username'));
    }))
    .then(r => provisioner.partialOauth('shopify'))
    .then(code =>
      cloud.put(`${baseUrl}/${id}`, genInstance('shopify', { name: 'updated-instance', providerData: { code: code } }), r => {
        expect(r.body.configuration).to.not.be.empty;
        expect(r.body.configuration.password).to.equal("********");
        expect(r.body.configuration.username).to.equal(props.getForKey('shopify', 'username'));
        expect(r.body).to.not.have.key('providerData');
      }))
    .then(r => cloud.get(`/hubs/ecommerce/orders`))
    .then(r => expect(r.body).to.be.instanceof(Array))
    .then(r => provisioner.partialOauth('shopify'))
    .then(code => cloud.patch(`${baseUrl}/${id}`, { name: 'updated-instance', providerData: { code: code } }, r => {
      expect(r.body.configuration).to.not.be.empty;
      expect(r.body.configuration.password).to.equal("********");
      expect(r.body.configuration.username).to.equal(props.getForKey('shopify', 'username'));
      expect(r.body).to.not.have.key('providerData');
    }))
    .then(r => cloud.get(`/hubs/ecommerce/orders`))
    .then(r => expect(r.body).to.be.instanceof(Array))
    .then(r => provisioner.delete(id, baseUrl));
};

const opts = { schema: instanceSchema };

suite.forPlatform('elements/instances', opts, (test) => {
  it('should support CRUD by key', () => crudsInstance('elements/jira/instances'));
  it('should support CRUD by ID', () => {
    return cloud.get('elements/jira')
      .then(r => crudsInstance(`elements/${r.body.id}/instances`));
  });
  it('should support update with reprovision by key', () => updateInstanceWithReprovision('/instances', instanceSchema));

  it('should support switching an instance to the clone of an element', () => {
    if (props.get('user') === 'system') {
      logger.warn('Unable to test element clone as system user. Skipping.');
      return;
    }
    let instance, clone;
    return provisioner.create('shopify')
      .then(r => instance = r.body) //create an instnace of the original
      .then(r => cloud.post('elements/shopify/clone')) //create a clone
      .then(r => clone = r.body)
      .then(r => cloud.patch(`instances/${instance.id}`, {element: {id: clone.id}})
      .then(r => { //update the instance to switch to the clone
        expect(r.body.element.id).to.equal(clone.id);
      }))
      .then(r => provisioner.delete(instance.id, 'elements/shopify/instances')) //clean up
      .then(r => cloud.delete(`elements/${clone.key}`));
  });
});
