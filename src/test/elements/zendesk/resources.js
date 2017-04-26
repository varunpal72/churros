'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const categoryPayload = tools.requirePayload(`${__dirname}/assets/categories.json`);
const sectionsPayload = require('./assets/sections');
const incidentsPayload = tools.requirePayload(`${__dirname}/assets/incidents.json`);
const articlesPayload = require('./assets/articles');

const options = {
  churros: {
    updatePayload: {
      "name": "Example Category 3",
      "description": "An Update Done via API",
      "position": 2,
      "locale": "us-en"
    }
  }
};

suite.forElement('helpdesk', 'resources', { payload: incidentsPayload }, (test) => {
  test.withApi(`${test.api}/categories`).should.supportPagination();
  test.withApi(`${test.api}/categories`).withOptions(options).withJson(categoryPayload).should.supportCruds();

  it('should support CRUDS for /hubs/helpdesk/resources/categories/:id/sections', () => {
    let categoryId, sectionId;
    return cloud.post(`${test.api}/categories`, categoryPayload)
      .then(r => categoryId = r.body.id)
      .then(r => cloud.post(`${test.api}/categories/${categoryId}/sections`, sectionsPayload))
      .then(r => sectionId = r.body.id)
      .then(r => cloud.get(`/hubs/helpdesk/resources/sections`))
      .then(r => cloud.get(`/hubs/helpdesk/resources/sections/${sectionId}`))
      .then(r => cloud.patch(`/hubs/helpdesk/resources/sections/${sectionId}`, sectionsPayload))
      .then(r => cloud.delete(`/hubs/helpdesk/resources/sections/${sectionId}`))
      .then(r => cloud.delete(`${test.api}/categories/${categoryId}`));
  });

  it('should support RS for /hubs/helpdesk/resources/articles and CEQL search', () => {
    let articleId;
    return cloud.withOptions({ qs: { where: `title='abc'` } }).get(`${test.api}/articles`)
      .then(r => articleId = r.body[0].id)
      .then(r => cloud.get(`${test.api}/articles/${articleId}`));
  });

  it('should support RU for /hubs/helpdesk/resources/articles and CEQL search', () => {
    let articleId;
    return cloud.withOptions({ qs: { where: `title='abc'` } }).get(`${test.api}/articles`)
    .then(r => {
      console.log(r.body);
      return r
    })
      .then(r => articleId = r.body[0].id)
      .then(r => cloud.patch(`${test.api}/articles/${articleId}`, articlesPayload));
  });
});
