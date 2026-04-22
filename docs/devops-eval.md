# DevOps Evaluation Mapping

## Architecture

- `client/` contains the React + Vite frontend.
- `server/` contains the Express API, Mongoose models, service classes, and tests.
- MongoDB is used for persistence through Mongoose.
- GitHub Actions handles continuous integration plus deploy-ready workflows.
- Docker Compose is used to run MongoDB, backend, and frontend together for local development.

## Workflow

- Every push and pull request to `main` triggers `.github/workflows/ci.yml`.
- The CI workflow installs dependencies, runs ESLint, performs a Prettier format check, executes tests, and builds the frontend.
- `.github/workflows/deploy-pages.yml` can publish the frontend to GitHub Pages for a stable hosted submission link.
- `.github/workflows/deploy-ec2.yml` can deploy to EC2 through SSH when the required GitHub secrets are configured.

## Testing Strategy

- Unit testing:
  Frontend components are covered with Vitest and Testing Library.
- Integration testing:
  The backend uses Supertest with Mongoose and MongoDB to validate API + database behavior together.
- E2E testing:
  Not implemented yet, so this remains a bonus opportunity rather than a claimed capability.

## Progress

- Architecture and core implementation: completed
- CI workflow and lint/test automation: completed
- MongoDB migration and Mongoose integration: completed
- Docker-based local environment: completed
- Static frontend hosting workflow: completed
- EC2 deployment automation: prepared and dependent on external secrets
- Bonus E2E testing: not completed

## Design Decisions

- MongoDB aligns better with flexible catalog and cart-style application data.
- Mongoose provides a direct model layer for MongoDB without an extra ORM code-generation step.
- A service-oriented backend structure improves maintainability and demonstrates OOP-style separation of concerns.
- Separate client and server jobs make CI failures easier to isolate.
- The frontend includes a curated demo-data fallback so the hosted UI still works on static platforms like GitHub Pages.

## Challenges

- Removing Prisma required replacing the generated client with explicit Mongoose models and updating each route to use Mongo-native relations and population.
- Backend linting was missing, so pull requests could not fail on server-side quality issues.
- Static hosting does not provide a live database-backed API, so the frontend needed a graceful fallback mode for demos and evaluation.
