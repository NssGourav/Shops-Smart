# DevOps Evaluation Mapping

## Architecture

- `client/` contains the React + Vite frontend.
- `server/` contains the Express API, Mongoose models, and tests.
- MongoDB is used for persistence through Mongoose.
- GitHub Actions handles continuous integration and optional EC2 deployment automation.

## Workflow

- Every push and pull request to `main` triggers `.github/workflows/ci.yml`.
- The CI workflow installs dependencies, runs ESLint, performs a Prettier format check, executes tests, and builds the frontend.
- `.github/dependabot.yml` checks npm and GitHub Actions dependencies weekly.
- `.github/workflows/deploy-ec2.yml` can deploy to EC2 through SSH when the required GitHub secrets are configured.

## Testing Strategy

- Unit testing:
  Frontend components are covered with Vitest and Testing Library.
- Integration testing:
  The backend uses Supertest with Mongoose and MongoDB to validate API + database behavior together.
- E2E testing:
  Not implemented yet, so this remains a bonus opportunity rather than a claimed capability.

## Design Decisions

- MongoDB aligns better with flexible catalog and cart-style application data.
- Mongoose provides a direct model layer for MongoDB without an extra ORM code-generation step.
- Separate client and server jobs make CI failures easier to isolate.
- `scripts/deploy-ec2.sh` is written to be idempotent where possible by using `mkdir -p`, `git fetch`, and repeat-safe dependency/database steps.

## Challenges

- Removing Prisma required replacing the generated client with explicit Mongoose models and updating each route to use Mongo-native relations and population.
- Backend linting was missing, so pull requests could not fail on server-side quality issues.
- Frontend checks were present in CI but lint failures were being ignored, which weakened PR enforcement.
