'use strict';

const suite = require('core/suite');
const payload = require('./assets/accounts');

const options = {
    churros: {
        updatePayload: {
            "name": "Robot Account Updated 1"
        }
    }
};

suite.forElement('crm', 'accounts', { payload: payload }, (test) => {
 test.withOptions(options).should.supportCruds();
 test.should.supportPagination();
});

