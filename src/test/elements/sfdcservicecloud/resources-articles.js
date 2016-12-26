'use strict';

const suite = require('core/suite');
const payload = require('./assets/articles');
const tools = require('core/tools');
const cloud = require('core/cloud');
const build = (overrides) => Object.assign({}, payload, overrides);
const articlesPayload = build({ UrlName: tools.random() });
suite.forElement('helpdesk', 'resources/articles', { payload: articlesPayload }, (test) => {
  it('should allow CRUDS /hubs/helpdesk/resources/articles and GET /query ', () => {
    let articleId;
    let statusPayload = {
      "PublishStatus": "Draft"
    };

    return cloud.post('/hubs/helpdesk/resources/articles', articlesPayload)
      .then(r => articleId = r.body.Id)
      .then(r => cloud.get(`${test.api}/${articleId}`))
      .then(r => cloud.get(test.api))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(test.api))
      .then(r => cloud.withOptions({ qs: { where: `id='${articleId}'` } }).get(test.api))
      .then(r => cloud.patch(`${test.api}/${articleId}`, articlesPayload))
      .then(r => cloud.put(`${test.api}/${articleId}/status`, statusPayload))
      .then(r => cloud.delete(`${test.api}/${articleId}`))
      .then(r => cloud.withOptions({ qs: { q: "select id, name from contact where name like '%foo' limit 10 offset 0" } }).get(`/hubs/helpdesk/query`));
  });
});
