#!/usr/bin/env bats

USAGE="  Usage: churros-props [options] [command]"
TOP_LIST_LINE="user: batsUser"
URL_LINE="https://batsUrl"

@test "It should support churros help props" {
  run churros help props
  [ "$status" -eq 0 ]
  [ "${lines[0]}" = "${USAGE}" ]
}

@test "It should support churros props --list" {
  run churros init --user batsUser --password batsPassword --url batsUrl
  run churros props --list
  [ "$status" -eq 0 ]
  [ "${lines[0]}" = "${TOP_LIST_LINE}" ]
}

@test "It should support churros props url" {
  run churros init --user batsUser --password batsPassword --url batsUrl
  [ "$status" -eq 0 ]
  run churros props url
  [ "$status" -eq 0 ]
  [ "${lines[0]}" = "${URL_LINE}" ]
}

@test "It should support churros props --delete url" {
  run churros init --user batsUser --password batsPassword --url batsUrl
  [ "$status" -eq 0 ]
  run churros props --delete url
  [ "$status" -eq 0 ]
  run churros props url
  [ "$status" -eq 0 ]
  [ "${lines[0]}" = "" ]
}

@test "It should support churros props element:prop value" {
  run churros init --user batsUser --password batsPassword --url batsUrl
  [ "$status" -eq 0 ]
  run churros props element:prop value
  [ "$status" -eq 0 ]
  run churros props element
  [ "$status" -eq 0 ]
  [ "${lines[0]}" = "element:" ]
  run churros props element:prop
  [ "$status" -eq 0 ]
  [ "${lines[0]}" = "value" ]
}

@test "It should support churros props invalidElement" {
  run churros init --user batsUser --password batsPassword --url batsUrl
  [ "$status" -eq 0 ]
  run churros props invalidElement
  [ "$status" -eq 0 ]
  [ "${lines[0]}" = "" ]
}
