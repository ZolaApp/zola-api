#!/bin/bash
args="$@"

npx babel-node --plugins=add-module-exports ./node_modules/.bin/knex \
  --knexfile ./src/server/database/knexfile.js ${args}
