'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

 suite.forElement('ecommerce', 'objects', (test) => {
   let id;

    it(`should support GET ${test.api}`, () => {
      return cloud.get(test.api)
        .then(r => id = "listview")
        .then(r => cloud.get(`${test.api}/${id}/metadata`));
      });
  });
