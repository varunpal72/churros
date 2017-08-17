'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const expect = require('chakram').expect;
const hub = require('./assets/hub');

suite.forPlatform('hubs', { payload: hub }, (test) => {
  it(`should allow CRDS for hubs`, () => {

    return cloud.post('hubs', hub)
      .then(r => cloud.get(`hubs/churrostest`))
      .then(r => cloud.delete(`hubs/churrostest`))
      .then(r => cloud.get(`hubs`))
      .catch(e => {
        cloud.delete(`hubs/churrostest`);
        throw new Error(e);
      });
  });

  it(`should allow GET hubs with hydrate`, () => {

    return cloud.withOptions({ qs: { hydrate: true } }).get(`hubs`, r => {
      expect(r.body).to.not.be.empty;
      expect(r.body[0]).to.not.be.empty;
      expect(r.body[0].resources).to.not.be.empty;
    });
  });

});
