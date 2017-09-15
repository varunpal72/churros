'use strict';

const cloud = require('core/cloud');
const suite = require('core/suite');
const tools = require('core/tools');
const incident = require('./assets/incidents');
const oPayload = require('./assets/organizations');
const build = (overrides) => Object.assign({}, oPayload, overrides);
let organizationId, incidentId;

const comment = {
    text: tools.random(),
    detailDescriptionFlag: true
};

const updateComment = {
    text: tools.random()
};

suite.forElement('crm', 'comments', () => {
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
                comment.ticketId = incidentId;
            });
    });

    after(() => {
        return cloud.delete(`/hubs/crm/incidents/${incidentId}`)
            .then(() => cloud.delete(`/hubs/crm/organizations/${organizationId}`));
    });

    it(`should allow CRUDS for /hubs/crm/incidents/{id}/comments`, () => {
      let commentId;
      return cloud.post(`/hubs/crm/incidents/${incidentId}/comments`, comment)
        .then(r => commentId = r.body.id)
        .then(() => cloud.get(`/hubs/crm/incidents/${incidentId}/comments`))
        .then(() => cloud.patch(`/hubs/crm/incidents/${incidentId}/comments/${commentId}`, updateComment))
        .then(() => cloud.delete(`/hubs/crm/incidents/${incidentId}/comments/${commentId}`));
    });
});