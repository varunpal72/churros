## Best Practices
In order to keep `churros` consistent, here are some common patterns that are followed in `churros`:
* need to make tests as resilient as possible.  some common mistakes to avoid:
 * make sure to clean up any API resources that are created
 * in `before` blocks, be as defensive as possible.  if this fails all tests will fail...
 * handle `before` and `after` failures elegantly so the test suite does not hang until a timeout
* use `.jshintrc` and `.jsbeautifyrc` files in the root of the project in your editor or IDE of choice, so there is consistency with formatting
* use ES6 string templates when concatenating strings
* prefer returning promises out of mocha `before` and `after` blocks instead of using the `done` callback

## Creating Test Suites

### New Element Suite:

```bash
# Use 'churros add element' and follow the prompts:
$ churros add element
```
> __NOTE:__ For the rest of this section, `${elementName}` represents the name of the newly created element that was given during the above prompts and ${resourceName} represents one of the resources that was setup during the above prompts.

If you set the `Auth type` for this element to `oauth1` or `oauth2`, then you will need to write some `selenium` code that will automate the OAuth UI process as needed.  This code should be added as a new `case` statement in the `src/core/oauth.js` module.

Assuming you setup the properties correctly, then at this point, you can actually run your generated element suite, and the element should provision fine, although it won't include any real tests at this point:
```bash
$ churros test elements/${elementName}
```

Update each resource's `src/test/elements/${elementName}/assets/${resourceName}.json` JSON file.  This file is what is used to go about creating and updating this specific ${resourceName}.  If your payload is small, or you prefer to just generate the JSON payload in javascript, feel free.  It's not *required* that you use this separate file paradigm.

Start building out tests in the `src/test/elements/${elementName}/${resourceName}.js` file that was generated.  Leverage the `test` pre-canned tests as much as possible.  For more information on those read [here](#adding-tests-to-an-existing-suite).

### New Platform Suite:

```bash
# Use 'churros add platform' and follow the prompts:
$ churros add platform
```
> __NOTE:__ For the rest of this section, `${resourceName}` represents the name of the newly created platform resource that was given during the above prompts.

Out of the box, you should be able to run your generated platform suite, although it won't include any real tests at this point:
```bash
$ churros test platform/${resourceName}
```

Update the `src/test/platform/${resourceName}/assets/${resourceName}.schema.json` generated JSON schema file to include all of the fields that make up this resource, which fields are required, etc.
> __NOTE:__ It is critical to be as accurate as possible in this schema file.  This file is critical to ensuring our interface does *not* change and this file is also what will document the models for this API.

> __PROTIP:__ The `${resourceName}.schema.json` file follows the most up-to-date JSON schema spec. You can use tools like http://jsonschema.net/ to help generate it.

Update each resource's `src/test/platform/${resourceName}/assets/${resourceName}.json` JSON file.  This file is what is used to go about creating and updating this specific ${resourceName}.  If your payload is small, or you prefer to just generate the JSON payload in javascript, feel free.  It's not *required* that you use this separate file paradigm.

Start building out tests in the `src/test/platform/${resourceName}/${resourceName}.js` file that was generated.  Leverage the `test` pre-canned tests as much as possible.  For more information on those read [here](#adding-tests-to-an-existing-suite).

## Adding Tests To An Existing Suite

Whenever building out new test cases, it is good to leverage as much functionality from the pre-canned `test` functions to ensure we're not duplicating code and so you don't have to re-invent the wheel each time.  The functions provided here do a *lot* if not all of the work for you:

>__PROTIP:__ If adding a tests for a new resource to an existing element suite, you can use `churros add ${elementName}` and it will help you stub out the necessary files, update the `transformations.json` file, etc. to help get you started.  It *should not* overwrite any existing files :pray:.

### `test`

For examples on what is available in the `test` object that is passed in at the top of your test file, look at the unit tests in `suite.test.js`.  Here are some basic examples of how to use it:
```javascript
// The payload and schema passed in here are what will be used if not overridden for a given test.
suite.forPlatform('foo', payload, schema, (test) => {
  // NOTE: these first five are all equivalent
  test.should.return200OnPost(); // using the default api, payload and schema
  test.withApi('/foo').should.return200OnPost(); // customizing the api, but using default payload and schema
  test.withJson(payload).should.return200OnPost(); // get it by now?
  test.withValidation(schema).should.return200OnPost(); // now?
  test.withApi('/foo').withJson(payload).withValidation(schema).should.return200OnPost(); // customize them all

  test.should.return404OnPatch(456);
  test.should.return404OnGet(456);
  test.should.return200OnPost();
  test.should.supportCruds();
  test.should.supportCruds(chakram.put);
  test.should.supportCrud();
  test.should.supportCrd();
  test.should.supportCrds();
  test.should.supportPagination();
  test.should.supportCeqlSearch('id');
  test.withApi('/foo/bad').should.return400OnPost();
});
```

> __PROPTIP:__ All of these functions create the `mocha` `it(...)` BDD function for you so you do *not* need to wrap these functions in an `it` block yourself.

#### Adding a New Test to `test`
If something is missing from `test` that seems like it could be a re-usable test in other suites, feel free to contribute to this library of tests.  All of the functions underneath `test` are simply using the utility functions in the `cloud` module and wrapping them in an `it(...)` `mocha` BDD function.  For example, here is the implementation for `test.should.supportCruds`:
```javascript
const cloud = require('core/cloud');

const itCruds = (api, payload, schema, updateCb) => {
  const name = util.format('should allow CRUDS for %s', api);
  it(name, () => cloud.cruds(api, payload, schema, updateCb));
};
```

You can see how it's simply constructing the BDD name for the test case (`should allow CRUDS for {api}`) and then calling our `cruds` function which is defined above in the module.  The goal of this class is to simply create a lot of lower-level functions and then compose them together in building common test cases.

### Creating Your Own Custom Tests
There are commonly cases where the common `test` functions won't provide everything you need.  In this case, feel free to create your own custom `it(...)` `mocha` functions in your test module.  In this case, it's easiest to use the functions in the `cloud` module.  Most of these functions just mimic your standard HTTP verbs, or your commonalities in CE (pagination, CEQL searching, etc.).  Check out `cloud.test.js` for examples of what's available and how to use `cloud`.

> __PROTIP:__ All of these functions allow you to pass in an optional `options` parameter.  Everything that the `requests` library supports [here](https://github.com/request/request#requestoptions-callback) is also supported by `churros`.

> __PROTIP:__ All of these functions return javascript promises.

> __PROTIP:__ For examples on how to use these functions, please look at all of the unit tests in `cloud.test.js`.

A good example of leveraging the `cloud` functions in a test can be found in the `closeio` tests, where it is *required* that a valid `lead_id` is passed when creating a `contact`:
```javascript
// Define your own it(..) mocha BDD test case since we're not using a function from test, which does this for you
it('should allow CRUDS for ' + api, () => {
  let accountId;
  // First, create an account as I need a valid account ID to generate my contact JSON payload
  return cloud.post('/hubs/crm/accounts', genAccount())
    .then(r => accountId = r.body.id)
    // Runs a full CRUDs cycle on a contact
    .then(r => cloud.cruds(api, gen({ lead_id: accountId }), schema))
    // Cleans up the created account
    .then(r => cloud.delete('/hubs/crm/accounts/' + accountId));
});
```

> __PROTIP:__ Each test should be self-contained and should *not* rely on anything from a previous test.

> __PROTIP:__ Validate JSON payloads against JSON schemas as opposed to validating each field individually, etc.  These JSON schemas are then what we will use to feed our developer docs so when we use them to validate our APIs, we are not only testing our APIs but also testing our documentation.

## Branching Model

[GitHub Flow](https://guides.github.com/introduction/flow) branching workflow model.

## Core Changes

Whenever adding any new code to the `src/core` directory, ensure that these changes are unit-tested in `test/core`.

## Pull Requests

All PRs submitted to the `churros` repository will have *all* of the unit tests run before they're able to be merged into `master`.  When creating a PR, please refrain from assigning it to someone else until all GitHub status checks have been completed and you have that nice little :white_check_mark:.

> __NOTE:__ When all tests have passed then you can assign the PR out.  Make sure the label at this point is `in review`.
