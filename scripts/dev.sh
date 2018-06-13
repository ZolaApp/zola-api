#!/bin/bash
BABEL_DISABLE_CACHE=1 npx nodemon --ext js,json,graphql src/index.js --exec \
  babel-node --extensions ".js",".json",".graphql"
