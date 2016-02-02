'use strict';

const chakram = require('chakram');
const util = require('util');
const argv = require('optimist').demand('user').argv;
const props = require('core/props');

const setGlobalProps = (args) => {
  props.set('user', args.user);
  props.set('password', args.password);
  props.set('url', args.url);
  props.setForKey('events', 'wait', args.wait);
  props.setForKey('events', 'load', args.load);
  props.setForKey('events', 'element', args.loadElement);
};

before((done) => {
  setGlobalProps(argv);

  const secUrl = props.get('url') + '/elements/j_spring_security_check';
  const form = { j_username: props.get('user'), j_password: props.get('password') };
  const options = { jar: true, form: form };
  const secretOptions = { jar: true };

  chakram.post(secUrl, null, options)
    .then(r => chakram.get(props.get('url') + '/elements/api-v1/ui/getSecrets', secretOptions))
    .then(r => {
      props.set('user.secret', r.body.user);
      props.set('org.secret', r.body.company);
      chakram.setRequestDefaults({
        baseUrl: props.get('url') + '/elements/api-v2',
        headers: { Authorization: util.format('User %s, Organization %s', r.body.user, r.body.company) }
      });
      done();
    })
    .catch(r => {
      console.log('Well shucks...failed to finish initialization...\n  Is %s up and running?\n  Do you have the write username and password?', props.get('url'));
      process.exit(1);
    });
});
