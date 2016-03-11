'use strict';

const util = require('util');
const chakram = require('chakram');
const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const props = require('core/props');
const provisioner = require('core/provisioner');
const common = require('./assets/common');
const keysSchema = require('./assets/keys.schema.json');
const schema = require('./assets/element.schema.json');
const listSchema = require('./assets/elements.schema.json');

suite.forPlatform('elements', common.genElement({}), schema, (test) => {

  it('should support search', () => cloud.get('elements', listSchema));
  it('should support get keys', () => cloud.get('elements/keys', keysSchema));

  it('should support CRUD by key', () => {
    let element;
    return cloud.post('elements', common.genElement({}), schema)
    .then(r => element = r.body)
    .then(r => cloud.get('elements/' + element.key, schema))
    .then(r => cloud.put('elements/' + element.key, common.genElement({ description: "An updated Churros element" }), schema))
    .then(r => cloud.delete('elements/' + element.key));
  });

  /*it('should support element CRUD by ID', () => {
    let element;
    return cloud.post('elements', common.genElement({}), schema)
      .then(r => element = r.body)
      .then(r => cloud.get('elements/' + element.id, schema))
      .then(r => cloud.put('elements/' + element.id, common.genElement({ description: "An updated Churros Freshdesk element" }), schema))
      .then(r => cloud.delete('elements/' + element.id));
  });*/

  it('should support export by key', () => cloud.get('elements/freshdesk/export', schema));

  /*it('should support export by ID', () => {
    return cloud.get('elements/freshdesk')
    .then(r => cloud.get('elements/' + r.body.id + '/export', schema));
  });*/

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

  /*it('should support clone by ID', () => {
    if (props.get('user') === 'system') {
      logger.warn('Unable to test element clone as system user. Skipping.');
      return;
    }
    let clone;
    return cloud.get('elements/freshdesk')
      .then(r => cloud.post('elements/' + r.body.id + '/clone', schema))
      .then(r => clone = r.body)
      .then(r => cloud.delete('elements/' + clone.id));
  });*/

  it('should support activate/deactivate', () => {
    let element;
    return cloud.post('elements', common.genElement({}), schema)
      .then(r => element = r.body)
      .then(r => cloud.put('elements/' + element.key + '/active'))
      .then(r => cloud.get('elements/' + element.key, (r) => {
          expect(r.body.active).to.equal(true);
        }))
      .then(r => cloud.delete('elements/' + element.key + '/active', schema))
      .then(r => cloud.get('elements/' + element.key, (r) => {
        expect(r.body.active).to.equal(false);
      }))
      .then(r => cloud.delete('elements/' + element.key));
  });
});
