'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const swaggerParser = require('swagger-parser');
const expect = require('chakram').expect;

const elementKeys = ['hubspot', 'hubspotcrm', 'dynamicscrmadfs', 'quickbooks',
'quickbooksonprem', 'netsuitecrmv2', 'netsuiteerpv2', 'netsuitefinancev2', 'marketo', 'zendesk'];

suite.forPlatform('docs', {}, () => {
  let hubs, elementIds;

  before(() => cloud.get('/elements')
    .then(r => {
       elementIds = r.body.reduce((p, c) => {
          if(c.active && elementKeys.indexOf(c.key) > -1) { p.add(c.id); }
          return p;
       }, new Set());

       hubs = r.body.reduce((p, c) => {
         if(c.active) { p.add(c.hub); }
         return p;
       }, new Set());
    }));

  // Skipping this test as the hubs swagger is not validated { skip: true }
  it.skip('should return proper swagger json for hubs', () => {
    return Promise.all(Array.from(hubs).map(h => {
      return cloud.get(`/docs/${h}`)
      .then(r => r.body)
      .then(s => swaggerParser.validate(s, (err, api) => {
          if(err) { throw new Error(`Docs for '${h}' hub are invalid Swagger: ${err}`); }
        }));
    }));
  });

  it('should return proper swagger json for elements', () => {
      return Promise.all(Array.from(elementIds).map(elementId => {
        return cloud.get(`/elements/${elementId}/docs`)
        .then(r => r.body)
        .then(s => swaggerParser.validate(s, (err, api) => {
            if(err) { throw new Error(`Docs for element '${elementId}' are invalid Swagger: ${err}`); }
          }));
      }));
  });

  it('should return proper swagger json for AWS provider', (done) => {
    return cloud.get(`/docs/crm?provider=aws`, () => {
      expect(r.body).to.not.be.empty;
      expect(r.body.paths['/accounts'].get.parameters[1].name).to.equal('x-api-key');
    });
  });
});
