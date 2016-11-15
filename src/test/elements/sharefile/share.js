'use strict';

const suite = require('core/suite');
const sharepayload = {
  "ShareType":"Send",
  "Title":"Sample Send Share",
  "Items": [],
  "ExpirationDate": "2017-07-23",
  "RequireLogin": false,
  "RequireUserInfo": false,
  "MaxDownloads": -1,
  "UsesStreamIDs": false
};
const folderpayload = require('./assets/folder');
const cloud = require('core/cloud');
suite.forElement('documents', 'share', (test) => {
  // checkout functions available under test.should which provide a lot of pre-canned tests
  //   more information here: https://github.com/cloud-elements/churros/blob/master/CONTRIBUTING.md#adding-tests-to-an-existing-suite
//create folder

  it('Testing share creating/getting', () => {
    return cloud.post('/hubs/documents/folders', folderpayload)
    .then(r => sharepayload.Items = [{Id:r.body.id}])
    .then(r => cloud.post('/hubs/documents/share', sharepayload))
    .then(r => cloud.get('/hubs/documents/share'))
    .then(r => cloud.delete('/hubs/documents/folders/' + sharepayload.Items[0].Id));

  });
});
