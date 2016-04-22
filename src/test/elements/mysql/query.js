'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

const groupQuery = () => {
  return "select count(*), state from contact group by state order by 1 desc limit 5";
};

const joinQuery = () => {
  return "select c.first_name, c.last_name, cp.name from contact c inner join company cp on cp.company_id = c.company_id";
};

suite.forElement('db', 'query', {}, (test) => {
  it('should allow POST for ' + test.api, () => {
    return cloud.withOptions({json:false}).post('/hubs/db/query', groupQuery())
    .then(r => cloud.withOptions({json:false}).post('/hubs/db/query', joinQuery()));
  });
});
