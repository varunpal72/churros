#!/usr/bin/env bats

USAGE="  Usage: churros-test [options] [command]"

@test "It should support churros help test" {
  run churros help test
  [ "$status" -eq 0 ]
  [ "${lines[0]}" = "${USAGE}" ]
}
