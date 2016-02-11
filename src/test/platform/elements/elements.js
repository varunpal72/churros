'use strict';

const util = require('util');
const expect = require('chakram').expect;
const tester = require('core/tester');
const cloud = require('core/cloud');
const metadataSchema = require('./assets/element.metadata.schema.json');

tester.forPlatform('elements', metadataSchema, null, (test) => {

  it('should return element metadata', () => {
    return cloud.get('elements/sfdc')
      .then(r => cloud.get(util.format('%s/%s/metadata', test.api, r.body.id), metadataSchema));
  });

  it('should return 404 for invalid element ID', () => {
    return cloud.get(util.format('%s/999999999999/metadata', test.api), (r) => expect(r).to.have.statusCode(404));
  });

  it('should return polling event metadata for polling element', () => {
    return cloud.get('elements/netsuitecrm')
      .then(r => {
        return cloud.get(util.format('%s/%s/metadata', test.api, r.body.id), (r) => {
          expect(r).to.have.statusCode(200);
          expect(r.body).to.not.be.empty;
          expect(r.body.events.supported).to.equal(true);
          expect(r.body.events.methods).to.contain('polling');
          expect(r.body.events.polling).to.not.be.empty;
        });
      });
  });

  it('should return webhook event metadata for webhook element', () => {
    return cloud.get('elements/dropbox')
      .then(r => {
        return cloud.get(util.format('%s/%s/metadata', test.api, r.body.id), (r) => {
          expect(r).to.have.statusCode(200);
          expect(r.body).to.not.be.empty;
          expect(r.body.events.supported).to.equal(true);
          expect(r.body.events.methods).to.contain('webhook');
          expect(r.body.events.webhook).to.not.be.empty;
        });
      });
  });
});
