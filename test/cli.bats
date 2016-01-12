#!/usr/bin/env bats

USAGE="  Usage: churros [options] [command]"

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
