<p align="center">
  <a href="https://krono.fabianpiper.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="krono.png">
      <img alt="Krono logo" src="krono.png" width="auto" height="120">
    </picture>
  </a>
</p>

<h1 align="center">Krono</h1>

<p align="center">
  A type-safe, modular toolkit for building high-performance orderbook visualizations with Kraken's WebSocket API.
</p>

<p align="center">
  <a href="https://github.com/fapiper/krono/blob/main/LICENSE">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/license-MIT-21262d?style=flat&colorA=21262d&colorB=21262d">
      <img src="https://img.shields.io/badge/license-MIT-4329A6?style=flat&colorA=4329A6&colorB=4329A6" alt="MIT License">
    </picture>
  </a>
  <a href="https://github.com/fapiper/krono/actions/workflows/ci.yml">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/github/actions/workflow/status/fapiper/krono/ci.yml?style=flat&colorA=21262d&colorB=21262d&label=CI&labelColor=21262d">
      <img src="https://img.shields.io/badge/CI-passing-4329A6?style=flat&colorA=4329A6&colorB=4329A6" alt="CI Status">
    </picture>
  </a>
  <a href="https://snyk.io/test/github/fapiper/krono">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/Snyk_security-monitored-21262d?style=flat&colorA=21262d&colorB=21262d">
      <img src="https://img.shields.io/badge/Snyk_security-monitored-4329A6?style=flat&colorA=4329A6&colorB=4329A6" alt="Snyk Security">
    </picture>
  </a>
  <a href="https://www.typescriptlang.org/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/TypeScript-5.0+-21262d?style=flat&colorA=21262d&colorB=21262d&logo=typescript&logoColor=white">
      <img src="https://img.shields.io/badge/TypeScript-5.0+-4329A6?style=flat&colorA=4329A6&colorB=4329A6&logo=typescript&logoColor=white" alt="TypeScript">
    </picture>
  </a>
  <br />
  <a href="https://krono.fabianpiper.com/docs">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/docs-krono.fabianpiper.com-21262d?style=flat&colorA=21262d&colorB=21262d">
      <img src="https://img.shields.io/badge/docs-krono.fabianpiper.com-4329A6?style=flat&colorA=4329A6&colorB=4329A6" alt="Documentation">
    </picture>
  </a>
  <a href="https://turbo.build/repo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/Turborepo-latest-21262d?style=flat&colorA=21262d&colorB=21262d&logo=turborepo&logoColor=white">
      <img src="https://img.shields.io/badge/Turborepo-latest-4329A6?style=flat&colorA=4329A6&colorB=4329A6&logo=turborepo&logoColor=white" alt="Turborepo">
    </picture>
  </a>
  <a href="https://ui.shadcn.com/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/shadcn/ui-0.8.0-21262d?style=flat&colorA=21262d&colorB=21262d">
      <img src="https://img.shields.io/badge/shadcn/ui-0.8.0-4329A6?style=flat&colorA=4329A6&colorB=4329A6" alt="shadcn/ui">
    </picture>
  </a>
  <a href="https://docs.kraken.com/websockets/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/Kraken-WebSocket_API-21262d?style=flat&colorA=21262d&colorB=21262d">
      <img src="https://img.shields.io/badge/Kraken-WebSocket_API-4329A6?style=flat&colorA=4329A6&colorB=4329A6" alt="Kraken WebSocket API">
    </picture>
  </a>
  <a href="https://bun.sh/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/Bun-runtime-21262d?style=flat&colorA=21262d&colorB=21262d&logo=bun&logoColor=white">
      <img src="https://img.shields.io/badge/Bun-runtime-4329A6?style=flat&colorA=4329A6&colorB=4329A6&logo=bun&logoColor=white" alt="Bun">
    </picture>
  </a>
</p>

## Features

- **Ready-to-use Components:** Based on shadcn/ui and Tailwind CSS for orderbook visualization, configuration, and asset pair selection
- **Time Travel Playback:** Replay and analyze historical orderbook states
- **High-Performance WebSocket:** Optimized Kraken WS integration with throttling and debouncing
- **7+ React Hooks:** Composable hooks for orderbook data, subscriptions, and state management
- **Framework Agnostic:** Use with React, or build for vanilla JS and your favorite framework
- **TypeScript First:** Full type safety across core, hooks, and UI kit

## Getting Started

### Prerequisites

- Node.js 20+
- [Bun](https://bun.sh) (or npm/yarn/pnpm)

### Quick Start
```sh
# Clone the repository
git clone https://github.com/fapiper/krono.git

# Navigate to the project directory
cd krono

# Install dependencies
bun install

# Start development server
bun dev
```

For detailed setup instructions, read the [documentation](https://krono.fabianpiper.com/docs).

## Documentation

Full documentation is available at [krono.fabianpiper.com/docs](https://krono.fabianpiper.com/docs).

## Project Structure

Krono uses a monorepo structure managed by Turborepo:
```
krono/
├── apps/           # Deployable applications
│   ├── web/        # Showcase app
│   ├── docs/       # Documentation
│   └── storybook/  # Component library
├── examples/       # Example integrations
│   ├── react/      # React integration
│   └── nextjs/     # Next.js integration
└── packages/       # Shared packages
    ├── core/       # Core orderbook logic
    ├── hooks/      # React hooks
    ├── kit/        # UI components
    ├── tsconfig/   # Shared TypeScript configs
    └── ui/         # Base UI primitives
```

Each app is self-contained and independently deployable. Packages are shared across apps for consistency and maintainability.

## Development

### Tools & Stack

- [TypeScript](https://www.typescriptlang.org/) - Static type checking
- [Biome](https://biomejs.dev/) - Code linting, formatting, and fixing
- [Vitest](https://vitest.dev/) - Unit testing
- [Playwright](https://playwright.dev/) - End-to-end testing
- [Changesets](https://github.com/changesets/changesets) - Version management and publishing
- [Storybook](https://storybook.js.org/) - Component development and documentation

### Useful Commands

- `bun build` - Build all apps and packages
- `bun dev` - Develop all apps and packages
- `bun dev:ui` - Develop with Turbo's experimental UI
- `bun test` - Run all tests with Vitest
- `bun test:cov` - Run tests with coverage report
- `bun test:cov:ui` - Run tests with Vitest UI
- `bun test:e2e` - Run end-to-end tests with Playwright
- `bun lint` - Lint and format all packages
- `bun lint:fix` - Lint, format, and fix all packages
- `bun changeset` - Generate a changeset 🧑‍🔧 (WIP)
- `bun clean` - Clean up all `node_modules` and `dist` folders
- `bun ui:add:component` - Add a shadcn/ui component to `@krono/ui`
- `bun storybook` - Run Storybook for component development

## CI/CD

We use [GitHub Actions](https://github.com/features/actions) for continuous integration. Every push or pull request to the `main` branch runs:

1. **Setup** - Checks out code and sets up Bun
2. **Install** - Installs dependencies
3. **Build** - Builds all apps and packages
4. **Unit Tests** - Runs tests with Vitest
5. **E2E Tests** - Runs tests with Playwright
6. **Lint** - Performs linting and formatting checks with Biome

[![CI](https://github.com/fapiper/krono/actions/workflows/ci.yml/badge.svg)](https://github.com/fapiper/krono/actions/workflows/ci.yml)

## Contributing

We welcome contributions! See the [contributing guide](https://github.com/fapiper/krono/blob/main/.github/CONTRIBUTING.md) for details.

## Contributors

<a href="https://github.com/fapiper/krono/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=fapiper/krono" alt="Contributors" />
</a>

Made with [contrib.rocks](https://contrib.rocks).

## License

MIT © [Fabian Piper](https://fabianpiper.com)
