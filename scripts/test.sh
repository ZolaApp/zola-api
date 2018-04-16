#!/bin/bash
TYPES=(unit integration)

type="$1"
args="${@:2}"

if [[ $type == --* ]] || [ -z "$1" ]; then
  echo "🏃‍♀️  No test type supplied, running all tests…
  "
elif [[ ! "${TYPES[@]}" =~ "${type}" ]]; then
  echo "❌  Unknown test suite: \`${type}\`.
   Available tests are: $(IFS=, ; echo "${TYPES[*]}").
  "
  exit 1
fi

npx jest --verbose --forceExit "${type}.spec.js" ${args}
