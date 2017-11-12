'use strict';

const suite = require('core/suite');
const faker = require('faker');


let employee = require('./assets/employee.json');
employee.LastName = faker.name.lastName();

suite.forElement('finance', 'employees', {payload: employee}, (test) => {
    test.should.supportPagination();
    test.should.supportCruds();
});