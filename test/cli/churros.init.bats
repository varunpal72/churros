#!/usr/bin/env bats

USAGE="  Usage: churros-init [options]"

@test "It should support churros help init" {
  run churros help init
  [ "$status" -eq 0 ]
  [ "${lines[0]}" = "${USAGE}" ]
}

@test "It should support churros init" {
  run churros init --user bats --password bats --url bats
  [ "$status" -eq 0 ]
}
