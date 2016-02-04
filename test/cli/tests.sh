#!/usr/bin/env bash

run_tests() {
  node_modules/.bin/bats test/cli/
}

PROPS_FILE=$HOME/.churros/sauce.json
if [ -f $PROPS_FILE ]; then
  # temporarily move props file so we do NOT overwrite with any test props we set, delete, etc.
  TMP_RANDOM=$RANDOM
  mv $PROPS_FILE $PROPS_FILE.$TMP_RANDOM.bak
  run_tests
  mv $PROPS_FILE.$TMP_RANDOM.bak $PROPS_FILE
else
  run_tests
fi;
