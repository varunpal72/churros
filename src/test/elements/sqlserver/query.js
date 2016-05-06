'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

const groupQuery = () => ({
  script: "select top 5 count(*), Email from Contact group by Email order by 1 desc"
});

suite.forElement('db', 'query', {}, (test) => {
  test.withJson(groupQuery()).should.return200OnPost();
});
