#!/bin/bash

set -xe

FORMERENV=$NODE_ENV
export NODE_ENV=development
cd /zola-app
npm install
export NODE_ENV=$FORMERENV
npm run build
npm run start
