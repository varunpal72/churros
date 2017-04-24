'use strict';

const suite = require('core/suite');
const payload = require('./assets/payments');
const tools = require('core/tools');
const cloud = require('core/cloud');
const build = (overrides) => Object.assign({}, payload, overrides);
const paymentsPayload = build({ Name: tools.randomEmail() });

suite.forElement('expense', 'payments', { payload: paymentsPayload }, (test) => {
    it('should support CRUDS for /hubs/expense/payments', () => {
        let id;
        return cloud.post(test.api, payload)
            .then(r => id = r.body.ID)
            .then(r => cloud.get(`${test.api}/${id}`))
            .then(r => cloud.patch(`${test.api}/${id}`, paymentsPayload));
    });
});
