'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const props = require('core/props');
const provisioner = require('core/provisioner');
const instanceSchema = require('./assets/element.instance.schema.json');

const genInstance = (element, o) => ({
  name: (o.name || 'churros-instance'),
  element: { key: element },
  configuration: props.all(element)
});

const crudInstance = (baseUrl, schema) => {
  let id;
  return provisioner.create('freshdesk', undefined, baseUrl)
    .then(r => id = r.body.id)
    .then(r => cloud.get(`${baseUrl}/${id}`, (r) => {
      expect(r).to.have.schemaAnd200(schema);
      expect(r.body.configuration).to.not.be.empty;
      expect(r.body.configuration.password).to.equal("********");
      expect(r.body.configuration.username).to.equal(props.getForKey('freshdesk', 'username'));
    }))
    .then(r => cloud.put(`${baseUrl}/${id}`, genInstance('freshdesk', { name: 'updated-instance' })))
    .then(r => provisioner.delete(id, baseUrl));
};

suite.forPlatform('elements/instances', instanceSchema, null, (test) => {
  it('should support CRUD by key', () => crudInstance('elements/freshdesk/instances', instanceSchema));
  it('should support CRUD by ID', () => {
    return cloud.get('elements/freshdesk')
      .then(r => crudInstance(`elements/${r.body.id}/instances`, instanceSchema));
  });
});
