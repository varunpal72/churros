'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');

const options = {
    churros: {
        updatePayload: {
            "firstName": "Sideshow",
            "lastName": "Robert",
            "email": "weirdclown@springfield.il"
        }
    }
};

suite.forElement('crm', 'contacts', { payload: payload }, (test) => {
 test.withOptions(options).should.supportCruds();
 test.should.supportPagination();
});

