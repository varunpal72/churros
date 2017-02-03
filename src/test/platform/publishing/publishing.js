'use strict';

const suite = require('core/suite');
const payload = require('./assets/publishing');
const dbPayload = require('./assets/db-publishing');
const cloud = require('core/cloud');
const provisioner = require('core/provisioner');

const getGenerateSdkPayload = () => ({
  type: 'awslambda-native-java'
});

const getPublishSdkPayload = () => ({
  type: 'awslambda-native-java',
  testFlag: false,
  generateSwagger: true,
  "publishMetaData": {
      "stackName": "ChurrosStack",
      "overwriteExisting": false
  }
});

suite.forPlatform('publishing', { payload: payload }, (test) => {
  let httpElement, dbElement, s3InstanceId, awscfInstanceId;
  before(() => {
    return cloud.post('elements', payload)
      .then(r => httpElement = r.body)
      .then(r => cloud.post('elements', dbPayload))
      .then(r => dbElement = r.body)
      .then(r => provisioner.create('amazons3'))
      .then(r => s3InstanceId = r.body.id)
      .then(r => provisioner.create('awscloudformation'))
      .then(r => awscfInstanceId = r.body.id);
  });

  it('should allow AWS lambda autogenerate and download for the element ', () => {
    let packageId;
    const headers = { 'Accept': 'application/zip' };

    return cloud.post(`elements/${httpElement.id}/client-sdks`, getGenerateSdkPayload())
      .then(r => packageId = r.body.packageIds[0])
      .then(() => cloud.withOptions({ 'headers': headers }).get(`elements/client-sdks/${packageId}`));
  });

  it('should allow AWS database lambda autogenerate and download for the element ', () => {
    let packageId;
    const headers = { 'Accept': 'application/zip' };

    return cloud.post(`elements/${dbElement.id}/client-sdks`, getGenerateSdkPayload())
      .then(r => packageId = r.body.packageIds[0])
      .then(() => cloud.withOptions({ 'headers': headers }).get(`elements/client-sdks/${packageId}`));
  });


  it('should allow AWS lambda autogenerate and deploy to AWS ', () => {
    let publishPayload = getPublishSdkPayload();
    publishPayload.publishMetaData.amazons3InstanceId = s3InstanceId;
    publishPayload.publishMetaData.cloudformationInstanceId = awscfInstanceId;

    return cloud.post(`elements/${httpElement.id}/client-sdks/publish`, publishPayload);
  });

  after(() => {
    return cloud.delete(`elements/${httpElement.id}`)
      .then(r => cloud.delete(`elements/${dbElement.id}`))
      .then(r => provisioner.delete(s3InstanceId, 'elements/amazons3/instances'))
      .then(r => provisioner.delete(awscfInstanceId, 'elements/awscloudformation/instances'));
  });
});
