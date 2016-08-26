'use strict';

const argv = require('optimist').argv;
const AWS = require('aws-sdk');
const chakram = require('chakram');
const cloud = require('core/cloud');
const expect = chakram.expect;
const logger = require('core/logger')(argv.verbose ? 'silly' : 'info');
const oAuth = require('core/oauth');
const qs = require('querystring');
const urlParser = require('url');


// CLI Utility Function
const warnAndExit = string => {
  console.log(string);
  process.exit(1);
}

const getConfig = () => {
  return new Promise( (resolve, reject) => {
    let config;
    try {
      config = require(process.env.HOME + '/.churros/sauce.json');
      config.user = (argv.user || config.user);
      config.password = (argv.password || config.password);
      config.url = (argv.url || config.url);
      config.browser = (argv.browser || 'firefox');
      resolve(config);
    } catch (e) {
      reject('No properties found.  Make sure to run \'churros init\' first.');
    }
  });
}

// Define our authentication methods
const authenticateViaOpenId = (element, config) => {

  const elementConfig = config[element];
  const query = qs.stringify({
    response_type: 'token id_token',
    scope: 'openid',
    nonce: 'abc', // Seems legit
    client_id: elementConfig.aws.elementConsumerKey,
    redirect_uri: `${config['oauth.callback.url']}`,
  });

  const oauthUrl = `${elementConfig.aws.oauthUrl}?${query}`;

  // Model a fake soba response
  const fakeResponse = {
    body: {
      oauthUrl: oauthUrl
    }
  }

  return oAuth(element, fakeResponse, elementConfig.username, elementConfig.password, config)
    .then( url => {
      // Get the ID token from the URL
      // Need to use regex here because OpenID providers
      // are now appending the token via '#'
      const match = url.match('id_token=([^&]*)');

      if(match[1]) return match[1];

      return new Error('Could not resolve the OpenId token')
    })
    .then( token => {
      const logins = {};
      logins[elementConfig.aws.openIdProviderUrl] = token;

      // Configure the AWS SDK
      AWS.config.region = elementConfig.aws.cognitoRegion;
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: elementConfig.aws.identityPoolId,
        Logins: logins
      });

      // Now resolve the cognito identify from AWS
      return new Promise( (resolve, reject) => {
         AWS.config.credentials.get((err) => {
           if(err) reject(err);
           resolve(AWS);
         });
      });
    })
    .then( authenticatedAWS => {
      // Trade in the Cognito identity for temporary
      // security credentials with access to the IAMRole
      // configured in sauce
      return new Promise( (resolve, reject) => {
        const sts = new authenticatedAWS.STS();
        const params = {
          RoleArn: elementConfig.aws.roleArn,
          RoleSessionName: 'churros_session',
          WebIdentityToken: token,
          DurationSeconds: 900,
        }

        sts.AssumeRoleWithWebIdentity(params, function (err, data) {
          if (err) reject(err);
          resolve(data);
        });

      });
    })
    .then( stsCredentials => {
      console.log(stsCredentials);
    })

}

const authenticate = (element, config) => {
  return new Promise( (resolve, reject) => {
    switch(config[element].aws.authScheme) {
      case 'openId':
        return authenticateViaOpenId(element, config);
      case 'saml2':
        reject('SAML2.0 is not yet supported for AWS elements')
      case 'oauth2':
        reject('OAuth2 is not yet supported for AWS elements')
      case 'custom':
        reject('Custom auth is not yet supported for AWS elements.')
      default:
        reject('Invalid authentication scheme')
      }
  });
}

before(() => {
  const element = argv.element;
  return getConfig()
    .then( config => {
      return authenticate(element, config)
    })
  .catch( error => {
    warnAndExit(error);
  })
});
