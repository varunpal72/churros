## Branching Model

[GitHub Flow](https://guides.github.com/introduction/flow/) branching workflow model.

## Creating Tests

### How to create a new platform test suite:

1. Create a new directory in `src/test`

1. Create a `.js` file in that directory where your tests will live

  > **PROTIP:** Name the file after the resource you're testing.  Break up tests for different resources by putting them in different files.  As an example, look at `src/test/formulas`.

1. Begin writing tests in your file.  An example test that is pretty self-explanatory:

  ```javascript
  it('should throw a 404 if the notification does not exist', () => {
    return chakram.get(url + '/' + -1)
      .then((r) => {
        expect(r).to.have.status(404);
      });
  });
  ```

> **PROTIP:** Each test should be self-contained and should *not* rely on anything from a previous test
