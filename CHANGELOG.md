## v0.5.0 <sub><sup>(2016-03-25)</sup></sub>
#### Highlights
* element tests:
 * jira
 * dropboxforbusiness
 * sage200
 * shopify
 * hubspotcrm
* platform tests:
 * instance events
 * `id` based `/elements` tests
 * formula `v2` scripting engine tests
* increased resiliency with a handful of test suites for more reliability
* tests can run through `stoplight` proxy

## v0.4.0 <sub><sup>(2016-03-11)</sup></sub>
#### Highlights
* changed `localtunnel` support so that a tunnel is started at the beginning of all tests, and the publicly available URL is saved in `props.events.url` property
* during `churros add element`, the `id` field is added to the global object definitions JSON file *if* it is not already present on that object
* the `churros test` option: `--password` is now a flag instead of an input option:
![CLI](https://camo.githubusercontent.com/40a190aa2c9a86eef338de2ace574e59976ef052/687474703a2f2f636c2e6c792f3257303131753343303933342f53637265656e2532305265636f7264696e67253230323031362d30332d3035253230617425323030392e3433253230414d2e676966)
* changed the HTTP server that listens in `churros` for incoming requests (events, notification subscriptions, etc.) to be a global object that will respond with `502`s by default, until `server.listen` is called in which case it will listen for `x` number of requests and respond with `200`s during that time.  See `server.js` for more information.
* If the default `oauth.callback.url` property of `http://httpbin.org/get` will not work for your OAuth element, then you can now override that callback URL by setting the `<element>:oauth.callback.url` property.
* `test.should.supportNextPagePagination(amount)` to test our cursor-based pagination
* `test.withOptions()` will now pass through for all variations of `should.supportCruds()`
* able to pass churros options to withOptions, currently only the following is supported (`qs` included for context):
```javascript
{
  qs: {
    where: 'foo=bar'
  },
  churros: {
    updatePayload: inserUpdatePayloadHere  
  }
}
```
updatePayload is used to pass a different payload to the `update` portion of a CRUDS cycle
* Element tests:
 * `sugarcrmv2`
* Platform tests:
 * object definitions and transformation
 * formula tests enhancements
 * notifications enhancements

## v0.3.0 <sub><sup>(2016-02-28)</sup></sub>
#### Highlights
* `churros test` shell exit code is now propagated back to CLI properly.
![CLI](http://cl.ly/0I262G3Q0u1z/Screen%20Recording%202016-02-24%20at%2001.45%20PM.gif)

* To pass options on a given function in `cloud`, you now use the `cloud.withOptions` functions before your actual HTTP function, for example: `cloud.withOptions({qs: {foo: 'bar'}}).get('/foo')`.  As always, reference the unit tests for more examples.
* Re-factored the schema validation code, and removed the expectation that all element tests would validate against schemas after revealing that, well, it's just not really worth it.
* Woocommerce integration tests added.
* Magento integration tests added.
* Event listener now able to shut down and restart in single execution
* Added platform tests for `/elements/:id/instances` and `/instances/:id/events`
* `localtunnel` is now an `npm` dependency, and when running event tests, a tunnel is started programmatically on the `events.port` property.  Before, the user was required to setup their own `ngrok` or `localtunnel` instance and then set that URL under `churros props events:url`.  Less properties, less problems.

## v0.2.0 <sub><sup>(2016-02-12)</sup></sub>

#### Highlights
* Added a large amount of new elements to our provisioning library.  Most of the ones left were OAuth1 and OAuth2 elements, so lots of selenium work :disappointed:
* Leveraging `istanbul` and to generate unit test coverage statistics on each circleCI test run and publish them to `coveralls`.
 * Due to the extremely low number that was generated from the above, wrote a lot more unit tests :smile:
* Added platform tests for the new element metadata APIs
* Leveraging `winston` for better logging
* Support for `--verbose` mode when running `churros test`
* Prompt for authentication type and properties when calling `churros add element`
* Added optional `--browser <name>` support so, if you're debugging your OAuth element, you can now actually *see* the browser running your selenium commands.  (i.e. `churros test elements/foo --browser firefox`)
* Drastically changed the way you interact with tests inside what was formally known as `tester.for`, and is now: `suite.forElement` or `suite.forPlatform`
* 100% unit test coverage for everything in `src/core` :100:

## v0.1.0 <sub><sup>(2016-1-29)</sup></sub>

#### Highlights
* Changed name of props file to be `sauce.json` as opposed to `churros.json` cause I'm weird like that ...
* Stub out default properties needed to provision each element during `churros init` in the `sauce.template.json` file
* Continuing to add more elements to the elements catalog
* Added support for `should.have.schemaAnd200` `chakram` assertion as I found that I was always doing both of those at the same time and also because the error message for each of those wasn't good enough so wanted to improve it
* Added support for `should.have.statusCode` which is the *exact* same as `should.have.status` but gives more logging when the assertion fails to help debug the issue more easily.
* Many common tests available under `core/suite` and can be found under the `suite.it.` namespace.  This library will continue to grow as we add more and more tests and find out the commonalities throughout more elements.
* Event tests that create an instance of an element with notifications enabled, register a local URL that is exposed (can use ngrok, localtunnel, ssh tunneling) and then listen on that URL for incoming events from the platform.  Also supports specifying how many events to send and how long to wait to receive the webhook notification.
* `churros add` sub-command to help setup a new platform or element suite

## v0.0.0 <sub><sup>(2016-1-15)</sup></sub>

#### Highlights
* `$ churros init` support for initializing `churros` with any default values that will be used when running tests
* `$ churros test` support for running a a suite of tests, one to many files in a suite, or a subset of tests in a suite

```bash
$ churros test notifications
$ churros test notifications --file subscriptions
$ churros test notifications --file subscriptions --file notifications
$ churros test notifications --file subscriptions --file notifications --test \'should throw a 400\'
```

> __NOTE:__ The `--test` searches all of the `describe(...)` and `it(...)` strings to determine which test(s) to run.

* Ability to override the default user, password and url by passing optional arguments to `churros test`, for example:

```bash
$ churros test notifications --user frank_ricard --password old_school --url frank.old-school.com
```

* `$ churros props` support for interfacing with the `$HOME/.churros/churros.json` property file that contains all sensitive data
* [CircleCI](https://circleci.com/gh/cloud-elements/churros) support
* Gracefully handles if endpoint that tests are running against is not currently running
