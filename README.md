# churros <sub><sup>| Cloud Elements API testing framework </sup></sub>

--------------------------------------------------------------------------------

[![version](http://img.shields.io/badge/version-v0.2.0-blue.svg)](#) [![versioning](http://img.shields.io/badge/versioning-semver-blue.svg)](http://semver.org/) [![branching](http://img.shields.io/badge/branching-github%20flow-blue.svg)](https://guides.github.com/introduction/flow/) [![Circle CI](https://circleci.com/gh/cloud-elements/churros.svg?style=shield&circle-token=06ba43ddb954fcb3687b5e41fbdf607f1846bbc0)](https://circleci.com/gh/cloud-elements/churros)
[![Coverage Status](https://coveralls.io/repos/github/cloud-elements/churros/badge.svg?branch=master&t=9nr0dk)](https://coveralls.io/github/cloud-elements/churros?branch=master)


## Installation
If you don't have `node` and `npm` installed, do [that](https://docs.npmjs.com/getting-started/installing-node) first.

> **PROTIP:** `node` version must  be >= `v4.0.0`

Install the node dependencies and initialize churros.

```bash
# Install all necessary npm packages:
$ npm install

# Need phantomjs to be installed globally or somehow available on your $PATH:
$ npm install --global phantomjs

# Puts churros CLI on your $PATH:
$ npm link

# Initialize your churros properties file:
$ churros init
```

> **PROTIP:** May have to `sudo` the global install and `npm link` depending on your environment

> **PROTIP:** `node` version `5.4.0` is prone to showing messages like the one below.  Just ignore them...
```bash
npm WARN ENOENT ENOENT: no such file or directory, open '/blah/blah/blah/churros/src/core/package.json'
```

## Examples

#### Element Tests
```bash
# Run the entire suite for an the closeio element
$ churros test elements/closeio

# Run just the tests for the closeio contacts resource
$ churros test elements/closeio --test 'contacts'
```

> **PROTIP:** The --test value will search all tests `describe(...)` and `it(...)` strings to determine which test(s) to run

#### Platform Tests

#### Formulas
```bash
# Run the entire formulas suite:
$ churros test formulas

# Run all tests that contain 'should not allow':
$ churros test formulas --test 'should not allow'

# Run all test that contain 'should allow' as a different user than is setup in your properties file:
$ churros test formulas --test 'should allow' --user frank --password ricard
```

> **PROTIP:** Passing a `--user`, `--password` and/or `--url` to `churros test [suite]` overrides the default value that was setup during `churros init`.

#### Notifications
```bash
# Run the entire notifications suite:
$ churros test notifications
```

#### Events
These tests create an instance of an element with event notifications enabled and the event notification callback URL as a locally exposed URL.  `churros` then simulates `x` number of events into our platform and ensures that our local callback receives `x` number of callbacks.

There are some extra properties that are necessary to run the event tests.  `churros props events` will show you what is needed.  

You will also need some way of exposing a local port out on the interwebs.  At Cloud Elements, we mainly use [ngrok](https://ngrok.com/) (with a few people using [localtunnel.me](https://localtunnel.me/) or SSH tunneling) but feel free to pick your favorite, as long as you have a publicly exposed URL setup in `churros props events:url` that is pointing to the port setup in `churros props events:port`.

```bash
# Run the event tests, using the defaults in `churros props events`:
$ churros test events

# Run the event tests, using sfdc as the element to simulate events:
$ churros test events --element sfdc

# Run the event tests, using sfdc as the element to simulate events, sending in 100 events and waiting 60 seconds to receive them in churros:
$ churros test events --element sfdc --load 100 --wait 60
```

> **PROTIP:** Passing a `--wait`, `--load` and/or `--element` to `churros test events` overrides any default value that may be in your property file.

> **PROTIP:** Some elements are not currently supported as they need to have an `events/assets/_element_.event.json` file setup so `churros` knows how to simulate events from that system.  If you run the event tests with an element that is not supported you will see an error message like:
```bash
$ churros test events --element box
$ No box.event.json file found in the events/assets directory.  Please create this file before this element can be tested with events
```


## Changelog
See [CHANGELOG.md](CHANGELOG.md)

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md)

## License
See [LICENSE.md](LICENSE.md)
