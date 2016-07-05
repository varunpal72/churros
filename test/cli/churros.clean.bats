#!/usr/bin/env bats

USAGE="  Usage: churros-clean [options] [command]"

@test "It should support churros help clean" {
  run churros help clean
  [ "$status" -eq 0 ]
  [ "${lines[0]}" = "${USAGE}" ]
}
