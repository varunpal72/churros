#!/usr/bin/env bats

@test "It should display help when run with -h" {
  run churros -h
  [ "$status" -eq 0 ]
  [ "${lines[0]}" = "  Usage: churros [options] [command]" ]
}
