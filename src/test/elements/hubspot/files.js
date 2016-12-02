'use strict';

const suite = require('core/suite');
const payload = require('./assets/files');
const cloud = require('core/cloud');
const tools = require('core/tools');

const fieldsUpdate = () => ({
  "name": "cloud_elements",
  "folder_path":  "test_CE"
});

suite.forElement('marketing', 'files', { payload: payload }, (test) => {

it('should allow CRUD for hubs/marketing/files', () => {
   let path = __dirname + `/assets/test.txt`;
   let id;
   return cloud.withOptions({ qs: { path:`/${tools.random()}` } })
   .postFile(`${test.api}`, path)
   .then(r => id = r.body.id)
   .then(r => cloud.get(`${test.api}/${id}`))
   .then(r => cloud.patch(`${test.api}/${id}`,fieldsUpdate()))
   .then(r => cloud.patch(`${test.api}/${id}/archive`))
   .then(r =>  cloud.delete(`${test.api}/${id}`));
  });
  });
