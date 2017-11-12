'use strict';

const suite = require('core/suite');
const faker = require('faker');


let employee = require('./assets/employee.json');
employee.LastName = faker.name.lastName();

suite.forElement('finance', 'employees', {payload: employee}, (test) => {
    afterEach(done => {
        // to avoid rate limit errors
        setTimeout(done, 2500);
    });
    
    test.should.supportPagination();
    test.should.supportCruds();
});