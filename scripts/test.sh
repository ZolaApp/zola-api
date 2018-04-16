#!/bin/bash
args="$@"

npx jest --verbose --forceExit ${args}
