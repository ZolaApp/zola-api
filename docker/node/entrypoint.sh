#!/bin/bash

# cd /zola-api
# npm install > /dev/null
# node index.js

cleanup ()
{
  kill -s SIGTERM $!
  exit 0
}

trap cleanup SIGINT SIGTERM

while [ 1 ]
do
  sleep 10 &
  wait $!
done