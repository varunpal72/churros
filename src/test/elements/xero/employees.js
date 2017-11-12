'use strict';

const cloud = require('core/cloud');
const expect = require('chakram').expect;
const suite = require('core/suite');


let employee = require('./assets/employee.json');
employee.LastName = faker.name.lastName();

suite.forElement('finance', 'employees', {payload: employee}, (test) => {
    test.should.supportPagination();
    test.should.supportCruds();
});