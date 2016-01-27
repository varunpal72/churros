## Branching Model

[GitHub Flow](https://guides.github.com/introduction/flow) branching workflow model.

## Creating Test Suites

### New Element Suite:

```bash
# Use 'churros add element' and follow the prompts:
$ churros add element
```
> __NOTE:__ For the rest of this section, `${elementName}` represents the name of the newly created element that was given during the above prompts and ${resourceName} represents one of the resources that was setup during the above prompts.

Then, setup all of the required properties needed to create an instance of this element:
```bash
$ churros props ${elementName}:my.required.config.key my.value
```

At this point, you can actually run your generated element suite, although it won't include any real tests at this point:
```bash
$ churros test elements/${elementName}
```

Update each resource's `src/test/elements/${elementName}/${resourceName}.js` JSON schema file to include all of the fields that make up this resource, which fields are required, etc.
> __NOTE:__ It is critical to be as accurate as possible in this schema file.  This file is critical to ensuring our interface does *not* change and this file is also what will document the models for this API.

Start building out tests in the `src/tests/elements/${elementName}/${resourceName}.js` file that was generated.  Leverage the `tester.test` pre-canned tests as much as possible.  For more information on those read [here](#adding-tests-to-an-existing-suite).

### New Platform Suite:

```bash
# Use 'churros add platform' and follow the prompts:
$ churros add platform
```
> __NOTE:__ For the rest of this section, `${resourceName}` represents the name of the newly created platform resource that was given during the above prompts.

Out of the box, you should be able to run your generated platform suite, although it won't include any real tests at this point:
```bash
$ churros test ${resourceName}
```

Update the `/assets/${resourceName}.schema.json` generated JSON schema file to include all of the fields that make up this resource, which fields are required, etc.
> __NOTE:__ It is critical to be as accurate as possible in this schema file.  This file is critical to ensuring our interface does *not* change and this file is also what will document the models for this API.

Start building out tests in the `src/test/${resourceName}.js` file that was generated.  Leverage the `tester.test` pre-canned tests as much as possible.  For more information on those read [here](#adding-tests-to-an-existing-suite).

## Adding Tests To An Existing Suite

Whenever building out new test cases, it is good to leverage as much functionality from the pre-canned `tester.test` functions to ensure we're not duplicating code and to minimize how much code we have to maintain.  The functions provided here do a *lot* if not all of the work for you:


> __PROTIP:__ Each test should be self-contained and should *not* rely on anything from a previous test.

> __PROTIP:__ Validate JSON payloads against JSON schemas as opposed to validating each field individually, etc.  Then we can use these JSON schemas for our developer docs as well.  These JSON schemas should live in `src/test/[SUITE_NAME]/assets`.

>__PROTIP:__ If adding a tests for a new resource to an existing element suite, you can use `churros add ${elementName}` and it will help you stub out the necessary files, update the `transformations.json` file, etc. to help get you started.
