'use strict';

const cloud = require('core/cloud');
const suite = require('core/suite');
const tools = require('core/tools');
const expect = require('chakram').expect;
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
    test.should.supportCeqlSearch('id');
    test.should.supportCeqlSearch("summary");
    test.withOptions({qs: {where: "contactPhoneNumber=\"555-5555\""}}).should.supportCeqlSearch('contactPhoneNumber');
    test.should.supportPagination();

    it(`should support searching ${test.api} by field company.id`, () => {
        let id, value;
        return cloud.post(test.api, payload)
            .then(r => {
                id = r.body.id;
                value = r.body['company'].id;
                const myOptions = {qs: {where: `company.id=${organizationId}`}};
                return cloud.withOptions(myOptions).get(test.api, (r) => {
                    expect(r).to.have.statusCode(200);
                    expect(r.body.filter(obj => obj['company'].id === value).length).to.equal(r.body.length);
                });
            })
            .then(r => cloud.delete(test.api + '/' + id));
    });

    it(`should support searching ${test.api} by field lastUpdated`, () => {
        let id, value;
        return cloud.post(test.api, payload)
            .then(r => {
                id = r.body.id;
                value = r.body['lastUpdated'];
                const myOptions = {qs: {where: "lastUpdated>'2016-08-20T18:04:26Z'"}};
                return cloud.withOptions(myOptions).get(test.api, (r) => {
                    expect(r).to.have.statusCode(200);
                    expect(r.body.filter(obj => obj['lastUpdated'] === value).length).to.equal(r.body.length);
                });
            })
            .then(r => cloud.delete(test.api + '/' + id));
    });

    it(`should support retrieval of related time-entries via ${test.api}/{id}/time-entries`, () => {
        let indicentId;
        return cloud.post(test.api, payload)
            .then(r => indicentId = r.body.id)
            .then(() => cloud.get(`${test.api}/${indicentId}/time-entries`))
            .then(r => cloud.delete(`${test.api}/${indicentId}`));
    });
});
