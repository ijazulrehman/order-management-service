# Order Management Service

## Overview

This is a straightforward Order Management Service developed using Nest.js, a powerful Node.js framework, along with Express. It incorporates Swagger for API documentation, TypeORM for database interactions, Docker for containerization, and PostgreSQL for data storage.

## Things to improve

- [ ] Use transactions, especially for endpoints like creating orders.
- [ ] Enhance the "Update Order" endpoint to accommodate updates in order products.
- [ ] Improve test coverage.
- [ ] Add missing DTO validation

## Getting Started

To quickly set up and run this project locally, follow these steps:

1. Install project dependencies:

```bash
$ yarn
```

2. Build the project to generate Swagger documentation (see the section below):

```bash
$ yarn run build
```

3. Copy the environment configuration files:

```bash
$ cp .env.example .env
$ cp docker.env.example docker.env
```

4. Start the application along with PostgreSQL, Redis, and the Nest.js app:

```bash
$ docker-compose up -d
```

Your API will be accessible at http://localhost:3030. To test the API using Swagger with the authentication token provided in the `.env` file, follow these steps:

1. Open the Swagger documentation by visiting [http://localhost:3030/swagger](http://localhost:3030/swagger) in your web browser. Replace `localhost:3030` with the appropriate hostname and port if your application is hosted differently.

2. Click on an endpoint that requires authentication, such as one that is protected by JWT (JSON Web Tokens).

3. In the Swagger UI, you'll likely find an "Authorize" button. Click on it.

4. In the "Value" field, enter your authentication token as a Bearer token.

## Development

If you wish to modify the codebase, you can use `docker-compose.dev.yml` to start only PostgreSQL and Redis.

Then, you can run the Nest.js app separately with hot reloading:

```bash
$ yarn run start:dev
```

### Installation

Install project dependencies with:

```bash
$ yarn install
```

### Generating Swagger API Documentation

To generate the Swagger API documentation, run:

```bash
$ yarn run build
```

To test the API using Swagger with the authentication token provided in the `.env` file, follow these steps:

1. Open the Swagger documentation by visiting [http://localhost:3030/swagger](http://localhost:3030/swagger) in your web browser. Replace `localhost:3030` with the appropriate hostname and port if your application is hosted differently.

2. Click on an endpoint that requires authentication, such as one that is protected by JWT (JSON Web Tokens).

3. In the Swagger UI, you'll likely find an "Authorize" button. Click on it.

4. In the "Value" field, enter your authentication token as a Bearer token.

### Environment Configuration

Create environment configuration files by copying the examples:

```bash
$ cp .env.development.example .env
$ cp docker.env.example docker.env
```

### Running the Application

To start the application and associated services:

- Launch PostgreSQL and Redis:

```bash
$ docker-compose up -f docker-compose.dev.yml
```

- Start the application in development mode:

```bash
$ yarn run start
```

- Activate watch mode for development (with hot reloading):

```bash
$ yarn run start:dev
```

- Deploy the application in production mode:

```bash
$ yarn run start:prod
```

### Testing

Execute unit tests, end-to-end tests, or test coverage checks:

- Run unit tests:

```bash
$ yarn run test
```

- Run end-to-end tests:

```bash
$ yarn run test:e2e
```

- Check test coverage:

```bash
$ yarn run test:cov
```

## License

This project is open source and available under the [MIT License](LICENSE).
