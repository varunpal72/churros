'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const categoryPayload = require('./assets/categories');
const sectionsPayload = require('./assets/sections');

suite.forElement('helpdesk', 'resources/categories', { payload: categoryPayload, skip: true }, (test) => {
  const build = (overrides) => Object.assign({}, categoryPayload, overrides);
  const payload = build({ body: tools.random() });
  it('should update read and delete categories sections', () => {
    let categoryId;
    let sectionId;
    return cloud.post(test.api, payload)
      .then(r => categoryId = r.body.id)
      .then(r => cloud.post(`${test.api}/${categoryId}/sections`, sectionsPayload))
      .then(r => sectionId = r.body.id)
      .then(r => cloud.get(`${test.api}/${categoryId}/sections`), { qs: { page: 1, pageSize: 1 } })
      .then(r => cloud.get(`${test.api}/${categoryId}/sections/${sectionId}`))
      .then(r => cloud.patch(`${test.api}/${categoryId}/sections/${sectionId}`, sectionsPayload))
      .then(r => cloud.delete(`${test.api}/${categoryId}/sections/${sectionId}`))
      .then(r => cloud.delete(`${test.api}/${categoryId}`));
  });
});
