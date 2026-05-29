# Contributing to MemeGag

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and follow our code of conduct.

## Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- PostgreSQL 15+
- Redis 7+
- Docker (for running services locally)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ChaitanyaJoshi1769/MemeGag.git
   cd MemeGag
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm run install:turbo
   ```

3. **Setup environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development services**
   ```bash
   docker-compose up -d
   npm run db:push
   npm run dev
   ```

## Development Workflow

### Branch Naming
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code refactoring
- `test/description` - Tests

### Commit Messages

Follow conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: feat, fix, docs, style, refactor, perf, test, chore

**Example**:
```
feat(api-gateway): add rate limiting middleware

- Implement token bucket algorithm
- Support per-endpoint rate limits
- Add rate limit headers to response

Closes #123
```

### Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier (configured in .prettierrc)
- **Linting**: ESLint with TypeScript support
- **Line length**: 100 characters max

Run before committing:
```bash
npm run format
npm run lint
npm run type-check
```

### Testing Requirements

All code changes must include tests:

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test -- --watch
```

**Test Structure**:
- Unit tests for utilities and services
- Integration tests for API endpoints
- E2E tests for critical user flows
- Minimum 80% code coverage

### Pull Request Process

1. **Create feature branch** from `main`
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Implement changes** with tests

3. **Verify quality**
   ```bash
   npm run lint
   npm run type-check
   npm run test:coverage
   ```

4. **Push to remote**
   ```bash
   git push origin feature/your-feature
   ```

5. **Create pull request** with:
   - Clear description of changes
   - Screenshots (if UI changes)
   - Link to related issues
   - Testing instructions

6. **Address review feedback**

7. **Get approval** from at least 2 reviewers

8. **Merge** via squash or rebase

## Architecture Guidelines

### Microservice Structure
```
apps/service-name/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── controllers/
│   ├── services/
│   ├── dtos/
│   └── utils/
├── test/
├── Dockerfile
└── package.json
```

### Shared Package Structure
```
packages/package-name/
├── src/
│   └── index.ts
├── test/
├── package.json
└── tsconfig.json
```

### Naming Conventions
- Files: `kebab-case` (file.service.ts)
- Classes: `PascalCase` (UserService)
- Functions: `camelCase` (getUserById)
- Constants: `UPPER_SNAKE_CASE` (API_PORT)
- Interfaces: `PascalCase` with `I` prefix (IUserService)

## Database Changes

### Schema Changes
1. Create migration
   ```bash
   npm run db:migrate
   ```
2. Update schema in `prisma/schema.prisma`
3. Create migration file
4. Test locally
5. Include in PR

### Seeding Data
Add seeds to `prisma/seed.ts`:
```bash
npm run db:seed
```

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for exported functions
- Update API docs for endpoint changes
- Add architecture docs for structural changes

## Performance Considerations

- Keep response times under 200ms (p95)
- Use indexes for frequently queried fields
- Implement caching for expensive operations
- Monitor N+1 query problems
- Optimize images and videos

## Security Practices

- Never commit secrets or API keys
- Use parameterized queries (Prisma)
- Validate all user input
- Implement rate limiting
- Add authorization checks
- Log sensitive operations

## Release Process

### Version Bumping
We use semantic versioning: MAJOR.MINOR.PATCH

```
MAJOR - Breaking changes
MINOR - New features (backward compatible)
PATCH - Bug fixes
```

### Creating a Release
1. Update version in package.json
2. Update CHANGELOG.md
3. Create git tag
4. Push to GitHub
5. CI/CD creates release and publishes

## Getting Help

- **Documentation**: See `/docs` directory
- **Issues**: Check GitHub issues for known problems
- **Discussions**: Join our community discussions
- **Email**: Contact chaitanyajoshi15@gmail.com

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes for significant contributions
- Monthly contributor spotlight

---

**Thank you for contributing to MemeGag!** 🎭
