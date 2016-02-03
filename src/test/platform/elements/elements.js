'use strict';

const util = require('util');
const expect = require('chakram').expect;
const tester = require('core/tester');
const metadataSchema = require('./assets/element.metadata.schema.json');

tester.for(null, 'elements', (api) => {

  it('should return element metadata', () => {
    return tester.get('elements/sfdc')
    .then(r => {
      return tester.get(util.format('%s/%s/metadata', api, r.body.id), metadataSchema);
    });
  });

  it('should return 404 for invalid element ID', () => {
    return tester.get(util.format('%s/999999999999/metadata', api), (r) => {
      expect(r).to.have.statusCode(404);
    });
  });

  it('should return polling event metadata for polling element', () => {
    return tester.get('elements/netsuitecrm')
    .then(r => {
      return tester.get(util.format('%s/%s/metadata', api, r.body.id), (r) => {
        expect(r).to.have.statusCode(200);
        expect(r.body).to.not.be.empty;
        expect(r.body.events.supported).to.equal(true);
        expect(r.body.events.methods).to.contain('polling');
        expect(r.body.events.polling).to.not.be.empty;
      });
    });
  });

  it('should return webhook event metadata for webhook element', () => {
    return tester.get('elements/dropbox')
    .then(r => {
      return tester.get(util.format('%s/%s/metadata', api, r.body.id), (r) => {
        expect(r).to.have.statusCode(200);
        expect(r.body).to.not.be.empty;
        expect(r.body.events.supported).to.equal(true);
        expect(r.body.events.methods).to.contain('webhook');
        expect(r.body.events.webhook).to.not.be.empty;
      });
    });
  });
});
