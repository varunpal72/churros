'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const categoryPayload = require('./assets/categories');
const sectionsPayload = require('./assets/sections');

suite.forElement('helpdesk', 'resources/categories', { payload: categoryPayload }, (test) => {
  const build = (overrides) => Object.assign({}, categoryPayload, overrides);
  const payload = build({ body: tools.random() });
  it('Should update read and delete categories sections', () => {
    let categoryId, sectionId;
    return cloud.post(test.api, payload)
      .then(r => categoryId = r.body.id)
      .then(r => cloud.post(`${test.api}/${categoryId}/sections`, sectionsPayload))
      .then(r => sectionId = r.body.id)
      .then(r => cloud.get(`/hubs/helpdesk/resources/sections`))
      .then(r => cloud.get(`/hubs/helpdesk/resources/sections/${sectionId}`))
      .then(r => cloud.patch(`/hubs/helpdesk/resources/sections/${sectionId}`, sectionsPayload))
      .then(r => cloud.delete(`/hubs/helpdesk/resources/sections/${sectionId}`))
      .then(r => cloud.delete(`${test.api}/${categoryId}`));
  });
});
