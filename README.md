# Scheduling and listing Front-end

[![Build Status](https://travis-ci.org/hmcts/snl-frontend.svg?branch=master)](https://travis-ci.org/hmcts/snl-frontend)

### Quick start

```bash
# install the dependencies with Yarn
$ yarn install

# start the development server
$ yarn start
```
go to [http://localhost:3451](http://localhost:3451) in your browser.

# Table of Contents

 * [Prerequisites](#prerequisites)
 * [Install dependencies](#install-dependencies)
 * [Running](#running)
 * [Testing](#testing)
 * [Production](#production)
 * [Documentation](#documentation)

## Prerequisites

* [Node.js](https://nodejs.org/) >= v8.0.0
* [yarn](https://yarnpkg.com/)
* [Docker](https://www.docker.com)

You can use NVM (Node Version Manager) to get proper Node version

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

## Testing and Preparing for Pull Requests

Before creating a PR, ensure that all of the code styling checks and tests have been done locally (they will be caught on Jenkins if there are any discrepancies)

### 1. Code Style

* run: `yarn lint`

### 2. Unit Tests

* single run: `yarn test`
* live mode (TDD style): `yarn test-watch`

### 3. E2E Tests

* single run: `yarn test:functional`

You can change target URL by changing the **e2e-url.js**. In this file there are two configurations already: local, and ATT. Uncomment this configuration that you would like to use.
E2E tests generates screenshot on failure. Output is stored in *functional-output* directory.

## Production

To build your application, run:

* `yarn build`

You can now go to `/dist` and deploy that to your server!

## Documentation

You can generate api docs (using [TypeDoc](http://typedoc.org/)) for your code with the following:

* `yarn docs`

## LICENSE

This project is licensed under the GPL-3 License - see the [LICENSE](LICENSE.md) file for details.
