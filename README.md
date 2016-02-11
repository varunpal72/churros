# churros <sub><sup>| Cloud Elements API Testing Framework </sup></sub>

--------------------------------------------------------------------------------

[![version](http://img.shields.io/badge/version-v0.2.0-blue.svg)](#) [![versioning](http://img.shields.io/badge/versioning-semver-blue.svg)](http://semver.org/) [![branching](http://img.shields.io/badge/branching-github%20flow-blue.svg)](https://guides.github.com/introduction/flow/) [![Circle CI](https://circleci.com/gh/cloud-elements/churros.svg?style=shield&circle-token=06ba43ddb954fcb3687b5e41fbdf607f1846bbc0)](https://circleci.com/gh/cloud-elements/churros)
[![Coverage Status](https://coveralls.io/repos/github/cloud-elements/churros/badge.svg?branch=master&t=9nr0dk)](https://coveralls.io/github/cloud-elements/churros?branch=master)


## Installation
If you don't have `node` and `npm` installed, do [that](https://docs.npmjs.com/getting-started/installing-node) first.

> __PROTIP:__ `node` version must  be >= `v4.0.0`

Install the node dependencies and initialize churros.

```bash
# Install all necessary npm packages:
$ npm install

# Need phantomjs to be installed globally or somehow available on your $PATH:
$ npm install --global phantomjs-prebuilt

# Puts churros CLI on your $PATH:
$ npm link

# Initialize your churros properties file:
$ churros init
```

> __PROTIP:__ May have to `sudo` the global install and `npm link` depending on your environment

> __PROTIP:__ You can pass a `--file` to `churros init` if you have an existing properties file that you want to initialize from (i.e. `churros init --file /absolute/path/to/existing/properties/file`)

> __PROTIP:__ `node` version `5.4.0` is prone to showing messages like the one below.  Just ignore them...
```bash
npm WARN ENOENT ENOENT: no such file or directory, open '/blah/blah/blah/churros/src/core/package.json'
```

## `churros` CLI
It is worth taking some time to familiarize yourself with the `churros` CLI.  This CLI can run tests, help setup new test suites, and add/view properties that are needed in order to run certain suites.  Run `churros help` and dig through some of the different sub-commands that are currently available.  To see some examples of the most common command, `churros test`, continue on below.

## Examples

#### Element Tests
To run the tests for any element, you must have the necessary properties setup for that element.  *ALL* properties for the elements below must be populated.  To see what properties are required, you can call `churros props {element}`.  You can also run `churros help props` for more info.

```bash
# Run the entire suite for the closeio element
$ churros test elements/closeio

# Run just the tests for the closeio contacts resource
$ churros test elements/closeio --test 'contacts'

# Run the entire suite for the sfdc element
$ churros test elements/sfdc

# Run the entire suite for the sfdc element and during provisioning use the phantomjs browser
$ churros test elements/sfdc --browser phantomjs
```

> __PROTIP:__ The `--test` value will search all tests `describe(...)` and `it(...)` strings to determine which test(s) to run

> __PROTIP:__ The `--browser` value defaults to `firefox`, however if you want to use a headless browser, you can pass `--browser phantomjs` as seen above

#### Platform Tests

#### Formulas
```bash
# Run the entire formulas suite:
$ churros test platform/formulas

# Run all tests that contain 'should not allow':
$ churros test platform/formulas --test 'should not allow'

# Run all test that contain 'should allow' as a different user than is setup in your properties file:
$ churros test platform/formulas --test 'should allow' --user frank --password ricard
```

> __PROTIP:__ Passing a `--user`, `--password` and/or `--url` to `churros test [suite]` overrides the default value that was setup during `churros init`.

#### Notifications
```bash
# Run the entire notifications suite:
$ churros test platform/notifications

# Run the entire notifications suite with verbose logging on:
$ churros test platform/notifications --verbose
```

> __PROTIP:__ Passing a `--verbose` to `churros test [suite]` will log all of the debug messages to the console while the tests are running.

#### Events
These tests create an instance of an element with event notifications enabled and the event notification callback URL as a locally exposed URL.  `churros` then simulates `x` number of events into our platform and ensures that our local callback receives `x` number of callbacks.

There are some extra properties that are necessary to run the event tests.  `churros props events` will show you what is needed.  

You will also need some way of exposing a local port out on the interwebs.  At Cloud Elements, we mainly use [ngrok](https://ngrok.com/) (with a few people using [localtunnel.me](https://localtunnel.me/) or SSH tunneling) but feel free to pick your favorite, as long as you have a publicly exposed URL setup in `churros props events:url` that is pointing to the port setup in `churros props events:port`.

```bash
# Run the event tests, using the defaults in `churros props events`:
$ churros test platform/events

# Run the event tests, using sfdc as the element to simulate events:
$ churros test platform/events --element sfdc

# Run the event tests, using sfdc as the element to simulate events, sending in 25 events and waiting 60 seconds to receive them in churros:
$ churros test platform/events --element sfdc --load 25 --wait 60 --verbose
```

> __PROTIP:__ Passing a `--wait`, `--load` and/or `--element` to `churros test platform/events` overrides any default value that may be in your property file.

> __PROTIP:__ Some elements are not currently supported as they need to have an `events/assets/{element}.event.json` file setup so `churros` knows how to simulate events from that system.  If you run the event tests with an element that is not supported you will see an error message like:
```bash
$ churros test platform/events --element box
$ No box.event.json file found in the events/assets directory.  Please create this file before this element can be tested with events
```

## Changelog
See [CHANGELOG.md](CHANGELOG.md)

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md)

## License
See [LICENSE.md](LICENSE.md)
