
'use strict';

const suite = require('core/suite');
const payload = require('./assets/leads');

const options = {
    churros: {
        updatePayload: {
            "firstName": "Sideshow",
            "lastName": "Robert",
            "email": "weirdclown@springfield.il"
        }
    }
};

suite.forElement('crm', 'leads', { payload: payload }, (test) => {
 test.withOptions(options).should.supportCruds();
 test.should.supportPagination();
});

