#!/usr/bin/env bats

USAGE="  Usage: churros-add [options] [command]"

@test "It should support churros help add" {
  run churros help add
  [ "$status" -eq 0 ]
  [ "${lines[0]}" = "${USAGE}" ]
}

@test "It should support churros add platform" {
  skip
  run churros add platform
  [ "$status" -eq 0 ]
}

@test "It should support churros add element" {
  skip
  run churros add element
  [ "$status" -eq 0 ]
}

@test "It should handle churros add [INVALID_SUITE_TYPE]" {
  run churros add bobTheBuilder
  [ "$status" -eq 1 ]
}
