'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const props = require('core/props');
const provisioner = require('core/provisioner');
const instanceSchema = require('./assets/element.instance.schema');
const instancesSchema = require('./assets/element.instances.schema');
const transformationPayload = require('./assets/accountTransformation');
const objDefPayload = require('./assets/accountObjectDefinition');
const sfdcSwaggerSchema = require('./assets/sfdcSwagger.schema');

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
  let sfdcId;
  before(() => {
    return provisioner.create('closeio')
      .then(r => sfdcId = r.body.id);
  });

  after(() => {
    return sfdcId ? provisioner.delete(sfdcId) : true;
  });

  it('should support CRUD by key', () => crudsInstance('elements/jira/instances'));

  it('should support CRUD by ID', () => {
    return cloud.get('elements/jira')
      .then(r => crudsInstance(`elements/${r.body.id}/instances`));
  });

  it('should support update with reprovision by key', () => updateInstanceWithReprovision('/instances', instanceSchema));

  it('should support get instance specific docs', () => {
    return cloud.post(`instances/${sfdcId}/objects/myaccounts/definitions`, objDefPayload)
      .then(r => cloud.post(`instances/${sfdcId}/transformations/myaccounts`, transformationPayload))
      .then(r => cloud.get(`instances/${sfdcId}/docs`, sfdcSwaggerSchema));
  });
});
