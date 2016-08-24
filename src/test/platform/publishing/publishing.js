'use strict';

const suite = require('core/suite');
const payload = require('./assets/publishing');
const cloud = require('core/cloud');

const getGenerateSdkPayload = () => ({
  to: 'awslambda-native-java'
});

suite.forPlatform('publishing', { payload: payload }, (test) => {
  let id;
  it('should allow AWS lambda autogenerate and download for the element ', () => {
    let element, packageId;
    const headers = { 'Accept': 'application/zip' };

    return cloud.post('elements', payload)
      .then(r => element = r.body)
      .then(r => id = element['id'])
      .then(r => cloud.post(`elements/${id}/client-sdks`, getGenerateSdkPayload()))
      .then(r => packageId = r.body.packageIds[0])
      .then(() => cloud.withOptions({ 'headers': headers }).get(`elements/client-sdks/${packageId}`));
  });

  it('should allow delete of the element created for lambda autogenerate', () => {
    return cloud.delete(`elements/${id}`);
  });

});
