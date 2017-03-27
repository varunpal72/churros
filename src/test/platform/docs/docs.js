'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const swaggerParser = require('swagger-parser');
const expect = require('chakram').expect;

suite.forPlatform('docs', { skip: true }, () => {
  let hubs;

  before(() => cloud.get('/elements')
    .then(r => hubs = r.body.reduce((p, c) => {
      if(c.active) { p.add(c.hub); }
      return p;
    }, new Set())));

  it('should return proper swagger json', () => {
    return Promise.all(Array.from(hubs).map(h => {
      return cloud.get(`/docs/${h}`)
      .then(r => r.body)
      .then(s => swaggerParser.validate(s, (err, api) => {
          if(err) { throw new Error(`Docs for '${h}' hub are invalid Swagger: ${err}`); }
        }));
    }));
  });

  it('should return proper swagger json for AWS provider', () => {
    return cloud.get(`/docs/crm?provider=aws`)
    .then(r => {
        expect(r.body).to.not.be.empty;
        expect(r.body.paths['/accounts'].get.parameters[1].name).to.equal('x-api-key');
    });
  });
});
