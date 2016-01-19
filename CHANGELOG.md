## v0.1.0 <sub><sup>(2016-1-29)</sup></sub>
* Stay Tuned

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

> The `--test` searches all of the `describe(...)` and `it(...)` strings to determine which test(s) to run.

* Ability to override the default user, password and url by passing optional arguments to `churros test`, for example:

```bash
$ churros test notifications --user frank_ricard --password old_school --url frank.old-school.com
```

* `$ churros props` support for interfacing with the `$HOME/.churros/churros.json` property file that contains all sensitive data
* [CircleCI](https://circleci.com/gh/cloud-elements/churros) support
* Gracefully handles if endpoint that tests are running against is not currently running
