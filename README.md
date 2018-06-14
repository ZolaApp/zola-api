# Zola Api

[Zola Api](https://github.com/ZolaApp/zola-api) is the source code for Zola’s api, [https://api.zola.ink](https://api.zola.ink).

The API is a GraphQL API, the full schema and types definitions can be explored using graphiql.

# Meta

- **Production:** [https://api.zola.ink](https://api.zola.ink)
- **Staging:** [https://zola-api-preprod.herokuapp.com/](http://zola-api-preprod.herokuapp.com/)
- **Github:** [https://github.com/ZolaApp/zola-api](https://github.com/ZolaApp/zola-api)
- **Deploys:** merged PRs to `develop` are automatically deployed to staging; merged PRs from `develop` to `master` are automatically deployed to production.
- **Explore the schema using GraphiQL:** [https://api.zola.ink/graphiql](https://api.zola.ink/graphiql)

# Getting started

Copy the `.env.dist` file to `.env` and run:

```bash
$ npm install
$ npm run dev

✨Zola app running on port 3001. ✨
```

You can use a custom port using the `PORT` environment variable.

# Docker environment

Zola-api comes with a docker environment. The environment is described in the `docker-compose.yml` file and reads environment variables from `.env`.

When using the docker environment, you can link to containers using their name on the docker network. Data directories are mounted as volumes to container in order to persist data if a container is stopped.

To bring up the docker environment, set your environment variables and run :

```bash
$ docker-compose up -d
```

Then you can connect to the node container and run the above commands to run zola-api dev scripts :

```bash
$ docker exec -it zola-api bash
```

_Note that using the docker environment is not required and any postgres host can be specified in the environment variables_

# Authentication

Zola's API supports token based authentication. Some of the queries and mutations available in the schema require a proper token to be sent in order to work.

A header `Authentication: Bearer ${token}` is expected when running those operations, and an error will be returned if that token is missing.

# CDN

Zola's API comes with a CDN used to distribute translations assets. This CDN is technically public, but a token is generated for each project and is required in the CDN endpoint URL.

The CDN endpoints are :

```
GET /cdn/:cdnToken/download #exports all keys for all locales in project formatted in JSON and forces download
GET /cdn/:cdnToken/:localeCode #exports all keys for a single locale formatted in JSON
GET /cdn/:cdnToken/locales #lists all locales available for project formatted in JSON
```

# License

BSD-3 License. See [LICENSE](LICENSE).
