var chakram = require('chakram');

exports.start = function (suite) {
  chakram.setRequestDefaults({
    // TODO - JJW - setup the base URL and headers dynamically
    baseUrl: 'http://localhost:8080/elements/api-v2',
    headers: {
      Authorization: 'User TODO, Organization TODO'
    }
  });

  // run the specified suite
  require('./' + suite);
};
