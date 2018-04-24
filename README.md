An Angular front-end for Scheduling and listing.

### Quick start

```bash
# install the dependencies with Yarn
$ yarn install

# start the development server
$ yarn start
```
go to [http://localhost:3451](http://localhost:3451) in your browser.

# Table of Contents

* [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Install dependencies](#install-dependencies)
    * [Running](#running)
    * [Testing](#testing)
    * [Production](#production)
    * [Documentation](#documentation)
* [Seed](#seed)
* [Roadmap](#roadmap)
* [Environments](#environments)

# Getting Started

## Prerequisites

* [Node.js](https://nodejs.org/) >= v8.0.0
* [yarn](https://yarnpkg.com/)
* [Docker](https://www.docker.com)

You can use NVM (Node Version Manager) to get proper Node version

### Environment variables

The following environment variables are required:

| Name | Description |
|------|-------------|
| SNL_API_URL | URL for SNL api. `http://localhost:3451` for local development |

## Install dependencies

The project uses [yarn](https://yarnpkg.com/).

To install dependencies please execute the following command:

```bash
yarn install
```

## Running

Simply run:

```
yarn start
```

to start the SNL app on [http://localhost:3451](http://localhost:3451).

And you are all set! You can now modify your components on the fly without having to reload the entire page.

### Docker

If you want your code to become available to other Docker projects (e.g. for local environment testing), you need to build the app and then the Docker image:

```bash
yarn build
docker-compose build
```

You can run it by executing following command:

```bash
docker-compose up
```

As a result, the SNL frontend app will be started and made available on port `3451`.

## Testing

### 1. Unit Tests

* single run: `yarn test`
* live mode (TDD style): `yarn test-watch`

## Production

To build your application, run:

* `yarn build`

You can now go to `/dist` and deploy that to your server!

## Documentation

You can generate api docs (using [TypeDoc](http://typedoc.org/)) for your code with the following:

* `yarn docs`

## LICENSE

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
