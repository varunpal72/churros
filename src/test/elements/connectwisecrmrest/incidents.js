'use strict';

const cloud = require('core/cloud');
const suite = require('core/suite');
const tools = require('core/tools');
const payload = require('./assets/incidents');
const oPayload = require('./assets/organizations');
const build = (overrides) => Object.assign({}, oPayload, overrides);

const options = {
    churros: {
        updatePayload: {
            "summary": tools.random()
        }
    }
};

let organizationId;

suite.forElement('crm', 'incidents', { payload: payload }, (test) => {
    before(() => {
        let orgPayload = build({ identifier: tools.randomStr('abcdefghijklmnopqrstuvwxyz0123456789', 10) });
        return cloud.post(`/hubs/crm/organizations`, orgPayload)
            .then(r => {
                organizationId = r.body.id;
                payload['company'] = {id : organizationId};
            });
    });

    after(() => {
        return cloud.delete(`/hubs/crm/organizations/${organizationId}`);
    });

    test.withOptions(options).should.supportCruds();
    test.withOptions({contactPhoneNumber: '555-555-5555'}).should.supportCeqlSearch('contactPhoneNumber');
    test.should.supportPagination();
});
