'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

const groupQuery = () => ({
  script: "select top 5 count(*), Email from Contact group by Email order by 1 desc"
});

suite.forElement('db', 'query', {}, (test) => {
  it('should allow POST for ' + test.api, () => {
    return cloud.post('/hubs/db/query', groupQuery());
  });
});
