## Branching Model

[GitHub Flow](https://guides.github.com/introduction/flow/) branching workflow model.

## Creating Test Suites

### New platform test suite:

1. Create a new directory in `src/test`

1. Create a `.js` file in that directory where your tests will live
> **PROTIP:** Name the file after the resource you're testing.  Break up tests for different resources by putting them in different files.  As an example, look at `src/test/formulas`.

1. Begin writing tests in your file.  For guidance on writing tests, read [here](#creating-tests)

### New element test suite:

1. Create a new directory in `src/test/elements` with the name of the element

1. Create a `setup.js` file in that directory.  This file will be responsible for creating an instance of this element and deleting that instance after all tests have ran.  For a good example, see `src/test/elements/box/setup.js`. [MORE INFORMATION COMING]

1. Next, create a `.js` file with the name of the resource you will be testing.

1. Begin writing tests in your file.  For guidance on writing tests, read [here](#creating-tests)

## Creating Tests
An example test that is pretty self-explanatory:

  ```javascript
  it('should throw a 404 if the notification does not exist', () => {
    const url = '/notifications';
    return chakram.get(url + '/' + -1)
      .then((r) => {
        expect(r).to.have.statusCode(404);
      });
  });
  ```

[MORE INFORMATION COMING]

> **PROTIP:** Each test should be self-contained and should *not* rely on anything from a previous test
> **PROTIP:** Validate JSON payloads against JSON schemas as opposed to validating each field individually, etc.  Then we can use these JSON schemas for our developer docs as well.  These JSON schemas should live in `src/test/[SUITE_NAME]/assets`
