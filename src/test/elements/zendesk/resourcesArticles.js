'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const incidentsPayload = require('./assets/incidents');
const articlesPayload = require('./assets/articles');

suite.forElement('helpdesk', 'resources', { payload: incidentsPayload, skip: true }, (test) => {
  const build = (overrides) => Object.assign({}, incidentsPayload, overrides);
  const payload = build({ body: tools.random() });
  it('should read delete update resource articles', () => {
    let articleId;
    return cloud.withOptions({ qs: { where: 'promoted: false' } }).get(`${test.api}/articles`)
      .then(r => articleId = r.body.id)
      .then(r => cloud.get(`${test.api}/articles/${articleId}`))
      .then(r => cloud.patch(`${test.api}/articles/${articleId}`, articlesPayload))
      .then(r => cloud.delete(`${test.api}/articles/${articleId}`));
  });
});
