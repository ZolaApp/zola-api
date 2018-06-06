#!/bin/bash

cd /zola-api
npm install
npm run heroku-prebuild
npm run heroku-postbuild
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
