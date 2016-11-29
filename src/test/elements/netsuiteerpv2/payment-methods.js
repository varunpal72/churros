'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('erp', 'payment-methods', null, (test) => {
        it('should allow SR for /hubs/erp/payment-methods ', () => {
        let paymentMethodId;
        return cloud.get(test.api)
          .then(r => paymentMethodId = r.body[0].internalId)
          .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 5}}).get(`${test.api}`))
          .then(r => cloud.withOptions({ qs: { where: `internalId ='${paymentMethodId}'`}}).get(`${test.api}`))
          .then(r => cloud.get(`${test.api}/${paymentMethodId}`));
        });
});
