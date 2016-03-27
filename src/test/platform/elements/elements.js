'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const props = require('core/props');
const common = require('./assets/common');
const keysSchema = require('./assets/keys.schema.json');
const schema = require('./assets/element.schema.json');
const listSchema = require('./assets/elements.schema.json');
const logger = require('winston');

const getElementId = (key) => {
  return cloud.get(`elements/${key}`)
    .then(r => r.body.id);
};

const crudElement = (idField, payload, updatedPayload, schema) => {
  let element, id;
  return common.deleteElementByKey('churros')
    .then(r => cloud.post('elements', payload, schema))
    .then(r => element = r.body)
    .then(r => id = element[idField])
    .then(r => cloud.get(`elements/${id}`, schema))
    .then(r => cloud.put(`elements/${id}`, updatedPayload, schema))
    .then(r => cloud.delete(`elements/${id}`));
};

const testElementActivation = (idField, schema) => {
  let element;
  return common.deleteElementByKey('churros')
    .then(r => cloud.post('elements', common.genElement({}), schema))
    .then(r => element = r.body)
    .then(r => cloud.put(`elements/${element[idField]}/active`))
    .then(r => cloud.get(`elements/${element[idField]}`, (r) => expect(r.body.active).to.equal(true)))
    .then(r => cloud.delete(`elements/${element[idField]}/active`))
    .then(r => cloud.get(`elements/${element[idField]}`, (r) => expect(r.body.active).to.equal(false)))
    .then(r => cloud.delete(`elements/${element[idField]}`));
};

const testOAuthUrl = (idOrKey) => {
  return cloud.withOptions({ qs: { apiKey: 'abcdefg', apiSecret: '1234567', callbackUrl: 'http://localhost:8080' } }).get(`elements/${idOrKey}/oauth/url`, r => {
    expect(r.body).to.not.be.empty;
    expect(r.body.element).to.equal('sfdc');
    expect(r.body.oauthUrl).to.not.be.empty;
  });
};

suite.forPlatform('elements', common.genElement({}), schema, (test) => {

  it('should support search', () => cloud.get('elements', listSchema));
  it('should support get keys', () => cloud.get('elements/keys', keysSchema));

  it('should support CRUD by key', () => crudElement('key', common.genElement({}), common.genElement({ description: "An updated Churros element" }), schema));
  it('should support CRUD by ID', () => crudElement('id', common.genElement({}), common.genElement({ description: "An updated Churros element" }), schema));

  it('should support export by key', () => cloud.get('elements/freshdesk/export', schema));
  it('should support export by ID', () => {
    return getElementId('freshdesk')
      .then(id => cloud.get('elements/' + id + '/export', schema));
  });

  it('should support clone by key', () => {
    if (props.get('user') === 'system') {
      logger.warn('Unable to test element clone as system user. Skipping.');
      return;
    }
    let clone;
    return cloud.post('elements/freshdesk/clone', schema)
      .then(r => clone = r.body)
      .then(r => cloud.delete('elements/' + clone.key));
  });

  it('should support clone by ID', () => {
    if (props.get('user') === 'system') {
      logger.warn('Unable to test element clone as system user. Skipping.');
      return;
    }
    let clone;
    return getElementId('freshdesk')
      .then(id => cloud.post(`elements/${id}/clone`, schema))
      .then(r => clone = r.body)
      .then(r => cloud.delete('elements/' + clone.id));
  });

  it('should support activate/deactivate by key', () => testElementActivation('key', schema));
  it('should support activate/deactivate by ID', () => testElementActivation('id', schema));

  it('should support oauth URL generation by key', () => testOAuthUrl('sfdc'));
  it('should support oauth URL generation by ID', () => {
    return getElementId('sfdc')
      .then(id => testOAuthUrl(id));
  });

  it('should support retrieve default transformations by key', () => cloud.get('elements/sfdc/transformations'));
  it('should support retrieve default transformations by ID', () => {
    return getElementId('sfdc')
      .then(id => cloud.get(`elements/${id}/transformations`));
  });
});
