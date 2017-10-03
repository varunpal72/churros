'use strict';

const cloud = require('core/cloud');
const suite = require('core/suite');
const tools = require('core/tools');
const incident = require('./assets/incidents');
const payload = require('./assets/time-entries');
const oPayload = require('./assets/organizations');
const build = (overrides) => Object.assign({}, oPayload, overrides);

let incidentId, organizationId;

suite.forElement('crm', 'time-entries', { payload: payload }, (test) => {
    before(() => {
        let orgPayload = build({ identifier: tools.randomStr('abcdefghijklmnopqrstuvwxyz0123456789', 10) });
        return cloud.post(`/hubs/crm/organizations`, orgPayload)
            .then(r => {
                organizationId = r.body.id;
                incident.company = {id : organizationId};
            })
            .then(() => cloud.post(`/hubs/crm/incidents`, incident))
            .then(r => incidentId = r.body.id)
            .then(() => {
                payload.chargeToId = incidentId;
                payload.company = {id: organizationId};
                payload.timeStart = '2017-08-23T13:15:00Z';
            });
    });

    after(() => {
        return cloud.delete(`/hubs/crm/incidents/${incidentId}`)
            .then(() => cloud.delete(`/hubs/crm/organizations/${organizationId}`));
    });

    test.should.supportPagination();
    test.should.supportCrds();
});
