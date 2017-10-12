'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const temPayload = tools.requirePayload(`${__dirname}/assets/template.json`);

suite.forElement('documents', 'custom-fields-templates', (test) => {

  it('should support CRUS for /custom-fields-templates', () => {
    let tempKey;
    let updatePayload = {
      "op": "addField",
      "data": {
        "displayName": "Category",
        "key": "category",
        "hidden": false,
        "type": "string"
      },
      "scope": "enterprise"
    };
    return cloud.post('/hubs/documents/custom-fields-templates', temPayload)
      .then(r => tempKey = r.body.templateKey)
      .then(r => cloud.put(`/hubs/documents/custom-fields-templates/${tempKey}`, updatePayload))
      .then(r => cloud.withOptions({ qs: { scope: "enterprise" } }).get(`/hubs/documents/custom-fields-templates/${tempKey}`))
      .then(r => cloud.withOptions({ qs: { scope: "enterprise" } }).get(`/hubs/documents/custom-fields-templates`))
      .then(r => cloud.get(`/hubs/documents/custom-fields-enterprise-templates`));
  });
});
