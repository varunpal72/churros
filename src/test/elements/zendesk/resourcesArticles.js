'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const incidentsPayload = require('./assets/incidents');
const articlesPayload = require('./assets/articles');

suite.forElement('helpdesk', 'resources', { payload: incidentsPayload }, (test) => {
  it('should support Srud for /hubs/helpdesk/resources/articles and CEQL search', () => {
    let articleId;
    return cloud.withOptions({ qs: { where: `title='abc'` } }).get(`${test.api}/articles`)
      .then(r => articleId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/articles/${articleId}`))
      .then(r => cloud.patch(`${test.api}/articles/${articleId}`, articlesPayload))
      .then(r => cloud.delete(`${test.api}/articles/${articleId}`));
  });
});
