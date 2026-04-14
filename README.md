# ShopSmart

ShopSmart is a full-stack shopping application with a React frontend and an Express + Mongoose backend backed by MongoDB.

## Tech Stack

- Frontend: React, Vite, Vitest, ESLint
- Backend: Express, Mongoose, MongoDB, Jest, Supertest, ESLint
- DevOps: GitHub Actions, Docker Compose, Render configuration, EC2 deployment workflow

## Project Status

- Core full-stack structure is completed.
- Frontend UI, backend APIs, MongoDB integration, Docker setup, and CI are in place.
- Main remaining gap is stronger backend test execution in restricted environments and optional bonus work like E2E testing.

Estimated completion:
- Overall project: about 80-85%
- Core features and DevOps rubric items: about 85-90%
- Production polish and bonus items: still pending

## Local Setup

### Frontend

```bash
cd client
npm ci
npm run dev
```

### Backend

```bash
cd server
npm ci
npm start
```

## Quality Checks

### Frontend

```bash
cd client
npm run lint
npm run format:check
npm test -- --run
npm run build
```

### Backend

```bash
cd server
npm run lint
npm run format:check
npm test
```

## DevOps Evaluation Notes

- CI pipeline: `.github/workflows/ci.yml`
- EC2 deployment workflow: `.github/workflows/deploy-ec2.yml`
- Idempotent deployment script: `scripts/deploy-ec2.sh`
- Rubric explanation: `docs/devops-eval.md`
