'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const swaggerParser = require('swagger-parser');
const expect = require('chakram').expect;

const elementKeys = ['hubspot', 'hubspotcrm', 'dynamicscrmadfs', 'quickbooks',
  'quickbooksonprem', 'netsuitecrmv2', 'netsuiteerpv2', 'netsuitefinancev2', 'marketo', 'zendesk', 'sfdc', 'sfdcservicecloud', 'egnyte'
];

suite.forPlatform('docs', {}, () => {
  let hubs, elementIds;

  before(() => cloud.get('/elements')
    .then(r => {
      elementIds = r.body.reduce((p, c) => {
        if (c.active) { p.push(c.id); }
        return p;
      }, []);

      hubs = r.body.reduce((p, c) => {
        if (c.active) { p.push(c.hub); }
        return p;
      }, []);
    }));

  // Skipping this test as the hubs swagger is not validated { skip: true }
  it.skip('should return proper swagger json for hubs', () => {
    return Promise.all(hubs.map(h => {
      return cloud.get(`/docs/${h}`)
        .then(r => r.body)
        .then(s => swaggerParser.validate(s, (err, api) => {
          if (err) { throw new Error(`Docs for '${h}' hub are invalid Swagger: ${err}`); }
        }));
    }));
  });

  it('should return proper swagger json for elements', () => {
    let failures = [];
    return Promise.all(elementIds.map(elementId => {
      console.log(elementId);
      return cloud.get(`/elements/${elementId}/docs`)
        .then(r => r.body)
        .then(s => {
          return new Promise(function(resolve, reject) {
            swaggerParser.validate(s, (err, api) => {
              if (err) {
                reject(err);
              }
              resolve();
            });
          });
        }).catch((err) => failures.push({ id: elementId, error: err }));
    })).then(() => expect(failures).to.deep.equal([]));
  });

  it('should return proper swagger json for AWS provider', () => {
    return cloud.get(`/docs/crm?provider=aws`)
      .then(r => {
        expect(r.body).to.not.be.empty;
        expect(r.body.paths['/accounts'].get.parameters[1].name).to.equal('x-api-key');
        expect(r.body.host).to.equal('aws-api.cloud-elements.com');
        expect(r.body.basePath).to.not.have.string('/elements/api-v2');
      });
  });
});
