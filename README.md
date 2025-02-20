<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

# MVP Application - CMS and Announcements Service

## Overview

This is a NestJS-based REST API service that manages tenant-specific and global announcements, as well as static content pages. The service is built with TypeScript and uses PostgreSQL as the primary data store.

## Features

### CMS Module

- Create and manage static content pages
- Multi-tenant support (global or tenant-specific content)
- URL-friendly slug-based routing
- Basic SEO configuration support

### Announcements Module

- Create and manage announcements
- Scheduling system with start/end dates
- Status management (ACTIVE, SCHEDULED, EXPIRED)
- Multi-tenant support
- Filtering capabilities by tenant and status

## Technical Stack

- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Documentation**: Swagger
- **Container**: Docker
- **Testing**: Jest

## Getting Started

### Prerequisites

- Node.js v20.14.0 or higher
- Docker and Docker Compose
- PostgreSQL (if running locally)

### Environment Setup

Create a `.env` file in the root directory:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=nestdb
NODE_ENV=development
```

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run with Docker (recommended):

```bash
# Production mode
docker-compose up

# Development mode
docker-compose -f docker-compose.dev.yml up
```

3. Run locally:

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Documentation

### Swagger Documentation

The API documentation is available through Swagger UI at:

http://localhost:3000/api

To use the Swagger UI:

1. Start the application
2. Navigate to http://localhost:3000/api in your browser
3. Explore and test the available endpoints

### Announcements Endpoints

#### Create Announcement

`POST /announcements`
Create a new announcement with scheduling capabilities.

#### Update Announcement

`PUT /announcements/:id`
Update an existing announcement's details.

#### Get Announcements

`GET /announcements`
Retrieve announcements with optional tenant and status filters.

### CMS Endpoints

#### Create Page

`POST /cms/pages`
Create a new static content page.

#### Update Page

`PUT /cms/pages/:page_id`
Update an existing CMS page.

#### Get Page

`GET /cms/pages/:slug`
Retrieve a CMS page by its slug.

## Testing

Run the test suite:

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Database Migrations

This project uses TypeORM for database management. The schema will automatically synchronize in development mode. For production, it's recommended to generate and run migrations:

```bash
# Generate a migration
npm run typeorm:generate-migration

# Run migrations
npm run typeorm:run-migrations
```

## Docker Support

The application includes both development and production Docker configurations:

- `Dockerfile` - Multi-stage build for production
- `docker-compose.yml` - Production setup
- `docker-compose.dev.yml` - Development setup with hot-reload

## Project Structure

```
src/
├── modules/
│   ├── cms/                # CMS module
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── entities/
│   │   └── dto/
│   └── announcements/      # Announcements module
│       ├── controllers/
│       ├── services/
│       ├── entities/
│       └── dto/
├── app.module.ts          # Main application module
├── main.ts               # Application entry point
└── config/              # Configuration files
```

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the Prosperity Public License 3.0.0 - see the [LICENSE](LICENSE) file for details.

### Commercial Licensing

For commercial use of this software, please contact the author to obtain a commercial license. Commercial use includes:

- Running the software in production for commercial purposes
- Using the software to provide services to commercial entities
- Including the software in commercial products
- Using the software to generate revenue directly or indirectly

To inquire about commercial licensing, please:

1. Open an issue in the repository with the label "commercial-license"
2. Send an email to [christophervistal25@gmail.com]
3. Include details about your intended use case

All commercial inquiries will be handled on a case-by-case basis.

```

```
