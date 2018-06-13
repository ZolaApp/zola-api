#!/bin/bash

set -xe

FORMERENV=$NODE_ENV
export NODE_ENV=development
cd /zola-api
npm install
npx babel-cli ./src --out-dir ./dist --ignore spec.js,tests
npm run knex migrate:latest
export NODE_ENV=$FORMERENV
npm run start

# cleanup ()
# {
#   kill -s SIGTERM $!
#   exit 0
# }

# trap cleanup SIGINT SIGTERM

# while [ 1 ]
# do
#   sleep 10 &
#   wait $!
# done
