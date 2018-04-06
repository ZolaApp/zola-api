# Zola API

### Developing Zola-api using Docker

Zola-api comes with a Docker dev environment. To bring up the stack just copy the `.env.dist` file to `.env` and fill your values. You can use a local `_pgdatadir` directory to persist Postgres data. This directory is gitignored.

The `.env` file is automatically read by docker. Just run

```
docker-compose up -d
```

The stack should start. You can access the postgres container using host `postgres.host` from the node container.
