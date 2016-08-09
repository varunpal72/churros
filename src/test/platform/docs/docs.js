'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const chakram = require('chakram');
const swaggerParser = require('swagger-parser');
const expect = chakram.expect;

suite.forPlatform('docs', (test) => {
  let hubs;

  before(() => cloud.get('/elements')
    .then(r => hubs = r.body.reduce((p, c) => {
      if(c.active) { p.add(c.hub); }
      return p;
    }, new Set())));

  it('should return proper swagger json', () => {
    return Promise.all(Array.from(hubs).map(h => {
      return chakram.get(`/docs/${h}`)
      .then(r => {
        expect(r.response.statusCode).to.equal(200, `${h} hub documentation failed to generate`);
        return r.body;
      })
      .then(s => {
        swaggerParser.validate(s, (err, api) => {
          if(err) { throw new Error(`Docs for '${h}' hub are invalid Swagger: ${err}`); }
        });
      });
    }));
  });
});
