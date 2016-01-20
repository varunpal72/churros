#!/usr/bin/env bats

USAGE="  Usage: churros [options] [command]"
INIT_USAGE="  Usage: churros-init [options]"
TEST_USAGE="  Usage: churros-test [options] [command]"
PROPS_USAGE="  Usage: churros-props [options] [command]"

@test "It should display help when run with -h" {
  run churros -h
  [ "$status" -eq 0 ]
  [ "${lines[0]}" = "${USAGE}" ]
}

@test "It should display help when run with --help" {
  run churros -h
  [ "$status" -eq 0 ]
  [ "${lines[0]}" = "${USAGE}" ]
}

@test "It should support churros help init" {
  run churros help init
  [ "$status" -eq 0 ]
  [ "${lines[0]}" = "${INIT_USAGE}" ]
}

@test "It should support churros help test" {
  run churros help test
  [ "$status" -eq 0 ]
  [ "${lines[0]}" = "${TEST_USAGE}" ]
}

@test "It should support churros help props" {
  run churros help props
  [ "$status" -eq 0 ]
  [ "${lines[0]}" = "${PROPS_USAGE}" ]
}

@test "It should show error if churros test with invalid suite name" {
  run churros test invalid_suite_name
  [ "$status" -gt 0 ]
  [ "${lines[0]}" = "Invalid suite: invalid_suite_name" ]
}

@test "It should show error if churros test with valid suite but invalid file name" {
  run churros test notifications --file fake.file.name
  [ "$status" -gt 0 ]
  [ "${lines[0]}" = "Invalid file: fake.file.name" ]
}
