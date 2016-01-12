#!/usr/bin/env bats

@test "churros is not a CLI yet" {
  run churros -h
  [ "$status" -eq 127 ]
}
