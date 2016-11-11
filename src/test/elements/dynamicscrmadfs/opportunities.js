'use strict';

const suite = require('core/suite');
const payload = require('./assets/opportunities');

const options = {
    churros: {
        updatePayload: {
            "name": "Robot Opportunity Updated 1"
        }
    }
};

suite.forElement('crm', 'opportunities', { payload: payload }, (test) => {
 test.withOptions(options).should.supportCruds();
 test.should.supportPagination();
});

