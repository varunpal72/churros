#!/usr/bin/env bats

USAGE="  Usage: churros-props [options] [command]"

@test "It should support churros help props" {
  run churros help props
  [ "$status" -eq 0 ]
  [ "${lines[0]}" = "${USAGE}" ]
}

@test "It should support churros props --list" {
  run churros init --user batsUser --password batsPassword --url batsUrl
  run churros props --list
  [ "$status" -eq 0 ]
  [ "${lines[0]}" = "user: batsUser" ]
}

@test "It should support churros props url" {
  run churros init --user batsUser --password batsPassword --url batsUrl
  [ "$status" -eq 0 ]
  run churros props url
  [ "$status" -eq 0 ]
  [ "${lines[0]}" = "https://batsUrl" ]
}

@test "It should support churros props user" {
  run churros init --user batsUser --password batsPassword --url batsUrl
  [ "$status" -eq 0 ]
  run churros props user
  [ "$status" -eq 0 ]
  [ "${lines[0]}" = "batsUser" ]
}


@test "It should support churros props password" {
  run churros init --user batsUser --password batsPassword --url batsUrl
  [ "$status" -eq 0 ]
  run churros props password
  [ "$status" -eq 0 ]
  [ "${lines[0]}" = "batsPassword" ]
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

@test "It should support churros props [ELEMENT_NAME]:[PROP] [VALUE]" {
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

@test "It should support churros props [NON_EXISTENT_ELEMENT]" {
  run churros init --user batsUser --password batsPassword --url batsUrl
  [ "$status" -eq 0 ]
  run churros props invalidElement
  [ "$status" -eq 0 ]
  [ "${lines[0]}" = "" ]
}

@test "It should support churros props --delete [ELEMENT_NAME]" {
  run churros init --user batsUser --password batsPassword --url batsUrl
  [ "$status" -eq 0 ]
  run churros props batsElement:prop value
  [ "$status" -eq 0 ]
  run churros props batsElement:anotherProp anotherValue
  [ "$status" -eq 0 ]
  run churros props batsElement
  [ "$status" -eq 0 ]
  [ "${lines[0]}" = "batsElement:" ]
  run churros props --delete batsElement
  [ "$status" -eq 0 ]
  run churros props batsElement
  [ "$status" -eq 0 ]
  [ "${lines[0]}" = "" ]
}
