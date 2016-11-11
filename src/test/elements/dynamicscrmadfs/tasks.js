'use strict';

const suite = require('core/suite');
const payload = require('./assets/tasks');

const options = {
    churros: {
        updatePayload: {
            "description": "Robot Test Task 1",
            "subject": "Run In Circles!"
        }
    }
};

suite.forElement('crm', 'tasks', { payload: payload }, (test) => {
 test.withOptions(options).should.supportCruds();
 test.should.supportPagination();
});

