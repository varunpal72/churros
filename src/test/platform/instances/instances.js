'use strict';
const expect = require('chakram').expect;
const suite = require('core/suite');
const payload = require('./assets/instances');
const schema = require('./assets/instances.schema');
const cloud = require('core/cloud');
const provisioner = require('core/provisioner');
const transformationPayload = require('./assets/accountTransformation');
const objDefPayload = require('./assets/accountObjectDefinition');
const sfdcSwaggerSchema = require('./assets/sfdcSwagger.schema');

suite.forPlatform('instances', schema, payload, (test) => {
  /** before - provision element to use throughout */
  const elementKey = 'sfdc';
  let sfdcId;
  before(() => provisioner.create(elementKey)
    .then(r => {
      sfdcId = r.body.id
        //create the object definitions on the instance
      return cloud.post(`instances/${sfdcId}/objects/myaccounts/definitions`, objDefPayload);
    })
    .then(r => {
      //create the object transformation on the instance
      return cloud.post(`instances/${sfdcId}/transformations/myaccounts`, transformationPayload);
    })
  );

  /** after - clean up element, this will clean up the definitions and transformations created in before */
  after(() => provisioner.delete(sfdcId));

  it('should support get instance specific docs', () => cloud.get(`instances/${sfdcId}/docs`, sfdcSwaggerSchema));

});
