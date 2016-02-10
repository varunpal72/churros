## Branching Model

[GitHub Flow](https://guides.github.com/introduction/flow) branching workflow model.

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

Update each resource's `src/test/elements/${elementName}/${resourceName}.js` JSON schema file to include all of the fields that make up this resource, which fields are required, etc.
> __NOTE:__ It is critical to be as accurate as possible in this schema file.  This file is critical to ensuring our interface does *not* change and this file is also what will document the models for this API.

Start building out tests in the `src/test/elements/${elementName}/${resourceName}.js` file that was generated.  Leverage the `tester.test` pre-canned tests as much as possible.  For more information on those read [here](#adding-tests-to-an-existing-suite).

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

Update the `/assets/${resourceName}.schema.json` generated JSON schema file to include all of the fields that make up this resource, which fields are required, etc.
> __NOTE:__ It is critical to be as accurate as possible in this schema file.  This file is critical to ensuring our interface does *not* change and this file is also what will document the models for this API.

> __PROTIP:__ The `${resourceName}.schema.json` file follows the most up-to-date JSON schema spec. You can use tools like http://jsonschema.net/ to help generate it.

Start building out tests in the `src/test/platform/${resourceName}/${resourceName}.js` file that was generated.  Leverage the `tester.test` pre-canned tests as much as possible.  For more information on those read [here](#adding-tests-to-an-existing-suite).

## Adding Tests To An Existing Suite

Whenever building out new test cases, it is good to leverage as much functionality from the pre-canned `tester.test` functions to ensure we're not duplicating code and to minimize how much code we have to maintain.  The functions provided here do a *lot* if not all of the work for you:

>__PROTIP:__ If adding a tests for a new resource to an existing element suite, you can use `churros add ${elementName}` and it will help you stub out the necessary files, update the `transformations.json` file, etc. to help get you started.  It *should not* overwrite any existing files :pray:.

### `tester.test`

```javascript
// POST a bad payload to an API and ensure we get a 400 response status code (Note: If you want to send an empty payload, exclude the payload parameter)
tester.test.badPost400(api, payload)

// PATCH an API with an invalid ID and ensure we get a 404 (Note: If no invalidId is passed then -1 is used)
tester.test.badPatch404(api, payload, invalidId)

// GET an API with an invalid ID and ensure we get a 404 (Note: If no invalidId is passed then -1 is used)
tester.test.badGet404(api, invalidId)

// Run a full CRUDS (create, retrieve, update, delete, search) cycle on the given API and ensure all API calls return a 200 and validate against the specified schema. (Note: Default update API calls is PATCH.  If this resource supports PUT, pass chakram.put as the last parameter)
tester.test.cruds(api, payload, schema)

// Same as tester.test.cruds except no search API call
tester.test.crud(api, payload, schema)

// Same as tester.test.crud except no update API call
tester.test.crd(api, payload, schema)

// Attempts to call a POST to the given API with the given payload and validates the response matches the given schema
tester.test.create(api, payload, schema)

// Creates an object from the given payload, and then searches for that object using the CE where clause by the specified
// field that is passed in.  For example, if 'id' is passed in then it will end up calling GET {api}?where=id='{idThatWasJustCreated}'
tester.test.search(api, payload, field)

// DOCS COMING SOON
tester.test.paginate
```

> __PROPTIP:__ All of these functions create the `mocha` `it(...)` BDD function for you so you do *not* need to wrap these functions in an `it` block yourself.

#### Adding a New Test to `tester.test`
If something is missing from `tester.test` that seems like it could be a re-usable test in other suites, feel free to contribute to this library of tests.  All of the functions underneath `tester.test` are simply using the utility functions in the `tester` module and wrapping them in an `it(...)` `mocha` BDD function.  For example, here is the implementation for `tester.test.cruds`:
```javascript
const testCruds = (api, payload, schema, updateCb) => {
  const name = util.format('should allow CRUDS for %s', api);
  it(name, () => cruds(api, payload, schema, updateCb));
};
```

You can see how it's simply constructing the BDD name for the test case (`should allow CRUDS for {api}`) and then calling our `cruds` function which is defined above in the module.  The goal of this class is to simply create a lot of lower-level functions and then compose them together in building common test cases.

### Creating Your Own Custom Tests
There are always cases where the common `tester.test` functions won't provide everything you need.  In this case, feel free to create your own custom `it(...)` `mocha` functions in your test module.  You can still use a lot of the functions in `tester` that aren't under the `.test` namespace.  Some of the common functions available are:
```javascript
tester.post(api, payload, shema)
tester.get(api, schema)
tester.patch(api, payload, schema)
tester.put(api, payload, schema)
tester.delete(api)
tester.postFile(api, filePath, schema)
tester.cruds(api, payload schema)
tester.crud(api, payload schema)
tester.crd(api, payload schema)
```

> __PROTIP:__ All of these functions return javascript promises.

> __PROTIP:__ For examples on how to use these functions, please look at all of the unit tests in `tester.test.js`.

A good example of leveraging these non `.test` namespaced functions can be found in the `closeio` tests, where it is *required* that a valid `lead_id` is passed when creating a contact:
```javascript
// Define your own it(..) mocha BDD test case since we're not using a tester.test function which does this for you
it('should allow CRUDS for ' + api, () => {
  // First: find all of the accounts
  return tester.get('/hubs/crm/accounts')
    .then(r => {
      // Validates we have a legitimate account in our system
      expect(r.body).to.not.be.empty;
      // Generates the contact payload using the ID from one of our accounts
      const payload = gen({ lead_id: r.body[0].id });
      // Runs a full CRUDs cycle on a contact
      return tester.cruds(api, payload, schema);
    });
});
```

> __PROTIP:__ Each test should be self-contained and should *not* rely on anything from a previous test.

> __PROTIP:__ Validate JSON payloads against JSON schemas as opposed to validating each field individually, etc.
