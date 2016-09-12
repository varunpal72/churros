'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('docusign', 'templates', (test) => {
    it('Should allow retrieving templates, and SR by templateId', () => cloud.get('/hubs/esignature/templates').then(r => cloud.get('/hubs/esignature/templates/' + r.body[0].templateId)));

});
