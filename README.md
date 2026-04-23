# ShopSmart

ShopSmart is a full-stack shopping application with a React frontend and an
Express + Mongoose backend backed by MongoDB.

## Tech Stack

- Frontend: React, Vite, Vitest, ESLint
- Backend: Express, Mongoose, MongoDB, Jest, Supertest, ESLint
- DevOps: GitHub Actions, Docker Compose, GitHub Pages workflow, Render
  configuration, EC2 deployment workflow

## Architecture Snapshot

- `client/` contains the storefront UI, cart state, and hosted-demo fallback
- `server/` contains the REST API, Mongoose models, service classes, and tests
- `docs/` contains rubric-oriented documentation and diagrams
- `.github/workflows/` contains CI plus deploy-ready workflows

## Evaluation Mapping

### Documentation

- Product idea: [Idea.md](./Idea.md)
- Sequence diagram:
  [docs/diagrams/Sequence_Diagram.md](./docs/diagrams/Sequence_Diagram.md)
- Class diagram:
  [docs/diagrams/Class_Diagram.md](./docs/diagrams/Class_Diagram.md)
- Use case diagram:
  [docs/diagrams/Use_Case_Diagram.md](./docs/diagrams/Use_Case_Diagram.md)
- ER diagram: [docs/diagrams/ER_Diagram.md](./docs/diagrams/ER_Diagram.md)

### Backend

- Express API with Mongoose models
- Service-oriented structure to demonstrate OOP-style separation of concerns
- Integration tests covering API + database behavior

### Frontend

- Editorial, portfolio-style storefront
- Responsive cart and filter system
- Hosted-demo fallback for static deployment platforms
- Frontend preview: [docs/frontend-preview.md](./docs/frontend-preview.md)

### Hosted Link

- GitHub Pages workflow: `.github/workflows/deploy-pages.yml`
- Expected Pages URL after pushing `main`:
  `https://nssgourav.github.io/Shops-Smart/`

## Project Status

- Core full-stack structure is completed
- Frontend UI, backend APIs, MongoDB integration, Docker setup, and CI are in
  place
- The project is now submission-focused and optimized for rubric coverage

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

### Docker

```bash
docker-compose up --build
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
- GitHub Pages deployment workflow: `.github/workflows/deploy-pages.yml`
- EC2 deployment workflow: `.github/workflows/deploy-ec2.yml`
- Idempotent deployment script: `scripts/deploy-ec2.sh`
- Rubric explanation: `docs/devops-eval.md`
