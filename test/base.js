var chakram = require('chakram');

exports.start = function (suite) {
  chakram.setRequestDefaults({
    baseUrl: 'http://localhost:8080/elements/api-v2',
    headers: {
      Authorization: 'User H1zrY4pTsfm47b61rCDE44uM79qIjqCrkdeVZ7FCXqQ, Organization c70a6b99e05a0d0ef4a74dc8300ddfec'
    }
  });

  // run the specified suite
  require('./' + suite);
};
