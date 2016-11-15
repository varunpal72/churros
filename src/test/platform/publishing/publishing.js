'use strict';

const suite = require('core/suite');
const payload = require('./assets/publishing');
const dbPayload = require('./assets/db-publishing');
const cloud = require('core/cloud');

const getGenerateSdkPayload = () => ({
  type: 'awslambda-native-java'
});

suite.forPlatform('publishing', { payload: payload, skip: true }, (test) => {
  let httpElement, dbElement;
  before(() => {
    return cloud.post('elements', payload)
      .then(r => httpElement = r.body)
      .then(r => cloud.post('elements', dbPayload))
      .then(r => dbElement = r.body);
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

  after(() => {
    return cloud.delete(`elements/${httpElement.id}`)
      .then(r => cloud.delete(`elements/${dbElement.id}`));
  });
});
