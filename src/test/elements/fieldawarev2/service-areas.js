'use strict';

const suite = require('core/suite');
const payload = require('./assets/service-areas');
const tools = require('core/tools');
const cloud = require('core/cloud');

suite.forElement('fsa', 'service-areas', { payload: payload }, (test) => {

  it('should allow CRUS for /service-areas', () => {

    const updatedPayload = payload;
    updatedPayload.name = tools.random();
    let SAId;
    return cloud.post(`/hubs/fsa/service-areas`, payload)
      .then(r => SAId = r.body.uuid)
      .then(r => cloud.get(`/hubs/fsa/service-areas`))
      .then(r => cloud.get(`/hubs/fsa/service-areas/${SAId}`))
      .then(r => cloud.patch(`/hubs/fsa/service-areas/${SAId}`, updatedPayload));
  });
});
