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
  return provisioner.create('jira', undefined, baseUrl)
    .then(r => id = r.body.id)
    .then(r => cloud.get(`${baseUrl}/${id}`, (r) => {
      expect(r).to.have.schemaAnd200(schema);
      expect(r.body.configuration).to.not.be.empty;
      expect(r.body.configuration.password).to.equal("********");
      expect(r.body.configuration.username).to.equal(props.getForKey('jira', 'username'));
    }))
    .then(r => cloud.put(`${baseUrl}/${id}`, genInstance('jira', { name: 'updated-instance' })))
    .then(r => provisioner.delete(id, baseUrl));
};

const opts = { schema: instanceSchema };

suite.forPlatform('elements/instances', opts, (test) => {
  it('should support CRUD by key', () => crudInstance('elements/jira/instances', instanceSchema));
  it('should support CRUD by ID', () => {
    return cloud.get('elements/jira')
      .then(r => crudInstance(`elements/${r.body.id}/instances`, instanceSchema));
  });
});
