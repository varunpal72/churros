'use strict';

const tester = require('core/tester');
const schema = require('./assets/customers.schema');

tester.for('ecommerce', 'query', schema, (api) => {

  it('should allow a query for all fields', () => {
    var apiWithQuery = api;
    apiWithQuery += '?q=';
    apiWithQuery += encodeURIComponent('select * from customers');
    return tester.find(apiWithQuery, schema);
  });

  it('should allow a query for specific fields', () => {
    var apiWithQuery = api;
    apiWithQuery += '?q=';
    apiWithQuery += encodeURIComponent('select id, email from customers');
    return tester.find(apiWithQuery, schema);
  });

});
