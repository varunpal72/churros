'use strict';

const util = require('util');
const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const props = require('core/props');
const provisioner = require('core/provisioner');
const common = require('./assets/common.js');
const schema = require('./assets/element.accounts.schema.json');

suite.forPlatform('elements/parameters', common.genParameter({}), schema, (test) => {
  let element, keyUrl, idUrl, subAccountId;
  before(done => cloud.post('elements', common.genElement({}))
  .then(r => element = r.body)
  .then(r => keyUrl = 'elements/' + element.key + '/accounts')
  .then(r => idUrl = 'elements/' + element.id + '/accounts')
  .then(r => cloud.post('accounts', genAccount()))
  .then(r => subAccountId = r.body.id)
  .then(r => done()));

  it('should support RUD by key', () => rudAccess(keyUrl, subAccountId, schema));
  it('should support RUD by ID', () => rudAccess(idUrl, subAccountId, schema));

  after(done => cloud.delete('elements/' + element.key)
  .then(r => cloud.delete('accounts/' + subAccountId))
  .then(() => done()));
});

const rudAccess = (url, accountId, schema) => {
  if (props.get('user') === 'system') {
    logger.warn("Unable to run element account access test as system user. Skipping.");
    return;
  }
  return cloud.put(`${url}/${accountId}`)
  .then(r => cloud.get(url, schema))
  .then(r => cloud.delete(`${url}/${accountId}`));
};

const genAccount = () => {
  return {
    name: 'Churros sub account',
    description: 'Churros sub account',
    externalId: 'churros'
  };
};
