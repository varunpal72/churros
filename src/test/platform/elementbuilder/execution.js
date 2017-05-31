'use strict';

const expect = require('chakram').expect;
const suite = require('core/suite');
const cloud = require('core/cloud');
const provisioner = require('core/provisioner');
const httpreqresElement = require('./assets/execution/httprequestresponse_element.json');

suite.forPlatform('elementexecution', {}, (test) => {
  let createdHttpReqRes;
  let httpReqResInstanceId;
  before(() => cloud.post('elements', httpreqresElement)
      .then(r => createdHttpReqRes = r.body)
      .then(r => provisioner.create('httprequestresponse', undefined, 'elements/httprequestresponse/instances'))
      .then(r => httpReqResInstanceId = r.body.id));

  it('should support calling API request with headers', () => {
      return cloud.get(`/hubs/general/withheaders`, (r) => {
          expect(r['Content-Type']).to.not.be.null;
      });
  });

  it('should support calling API request with out headers', () => {
      return cloud.get(`/hubs/general/withoutheaders`, (r) => {
          expect(r['Content-Type']).to.be.undefined;
      });
  });

  after(() => {
    return provisioner.delete(httpReqResInstanceId, 'elements/httprequestresponse/instances')
        .then(r => cloud.delete(`elements/${createdHttpReqRes.id}`));
  });

});
