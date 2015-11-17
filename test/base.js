var chakram = require('chakram');
var util = require('util');

exports.start = function (suite, baseUrl, username, password) {
  var url = baseUrl + '/elements/j_spring_security_check';
  var formData = {
    j_username: username,
    j_password: password
  };

  var options = {
    form: formData
  };

  chakram.post(url, formData, options)
    .then(function (response) {
      console.log(response.body);

      return chakram.get(baseUrl + '/elements/api-v1/ui/getSecrets');
    })
    .then(function (response) {
      console.log(response.body);

      var credentials = response.body;

      chakram.setRequestDefaults({
        baseUrl: baseUrl + '/elements/api-v2',
        headers: {
          Authorization: util.format('User %s, Organization %s', credentials.userSecret, credentials.orgSecret)
        }
      });

      // run the specified suite
      require('./' + suite);
    });
};
