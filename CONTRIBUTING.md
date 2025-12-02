# Contribution Guide

Before submitting your contribution, please make sure to take a moment and read through the following guide:

## Repository Setup

To set the repository up:

| Step                                                                                                     | Command |
|----------------------------------------------------------------------------------------------------------|--------|
| 1. Install [Node.js](https://nodejs.org/), using the [latest LTS](https://nodejs.org/en/about/releases/) | - |
| 2. Install [Bun](https://bun.sh/docs/installation)                                                       | - |
| 3. Install dependencies under the project root                                                           | `bun install` |

## Commands

### `bun dev`

Start the development environment.

### `bun run build`

Build the project for production. The result is usually under `dist/`.

### `bun run lint`

This project uses [ESLint](https://eslint.org/) or [Biome](https://biomejs.dev/) for **both linting and formatting**. They also lint JSON, YAML, and Markdown files if they exist.

You can run `bun run lint --fix` to let ESLint format and lint the code.

Learn more about the [ESLint Setup](#eslint) and the [Biome Setup](#biome).

[**Prettier is not used**](#no-prettier).

### `bun test`

Run the tests. This project uses [Vitest](https://vitest.dev/) - a replacement for [Jest](https://jestjs.io/).

You can filter the tests to be run by `bun test [match]`, for example, `bun test foo` will only run test files that contain `foo`.

Config options are under the `test` field of `vitest.config.ts`.

Vitest runs in [watch mode by default](https://vitest.dev/guide/features.html#watch-mode), so you can modify the code and see the test result automatically, which is great for [test-driven development](https://en.wikipedia.org/wiki/Test-driven_development). To run the test only once, you can do `bun test --run`.

There are multiple types of tests set up. Run `bun test:unit` for unit tests, `bun test:e2e` for end-to-end tests. `bun test` runs them together, but you can run them separately as needed.

Vitest also has a UI mode which you can run with `bun test --ui` or `bun test:ui` in most projects.

### `bun run docs`

If the project contains documentation, you can run `bun run docs` to start the documentation dev server. Use `bun run docs:build` to build the docs for production.

### `bun run`

For more, you can run bare `bun run`, which will prompt a list of all available scripts.

## Sending Pull Request

### Discuss First

Before you start to work on a feature pull request, it's always better to open a feature request issue first to discuss with the maintainers whether the feature is desired and the design of those features. This would help save time for both the maintainers and the contributors and help features to be shipped faster.

For typo fixes, it's recommended to batch multiple typo fixes into one pull request to maintain a cleaner commit history.

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for commit messages, which allows the changelog to be auto-generated based on the commits. Please read the guide through if you aren't familiar with it already.

Only `fix:` and `feat:` will be presented in the changelog.

Note that `fix:` and `feat:` are for **actual code changes** (that might affect logic).
For typo or document changes, use `docs:` or `chore:` instead:

* ~~`fix: typo`~~ -> `docs: fix typo`

### Pull Request

If you don't know how to send a Pull Request, the [GitHub guide](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) is recommended reading.

When sending a pull request, make sure your PR's title also follows the [Commit Convention](#commit-convention).

If your PR fixes or resolves an existing issue, please add the following line in your PR description (replace `123` with a real issue number):

```markdown
fix #123
```

This will let GitHub know the issues are linked, and automatically close them once the PR gets merged. Learn more at [the guide](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword).

It's ok to have multiple commits in a single PR, you don't need to rebase or force push for your changes as `Squash and Merge` will be used to squash the commits into one commit when merging.

## 📖 References

### Corepack

#### TL; DR

To enable it, run

```bash
corepack enable
```

You only need to do it once after Node.js is installed.

<table><tr><td width="500px" valign="top">

#### What's Corepack

[Corepack](https://nodejs.org/api/corepack.html) makes sure you are using the correct version for package manager when you run corresponding commands. Projects might have `packageManager` field in their `package.json`.

Under projects with configuration as shown on the right, corepack will install `v1.1.0` of `bun` (if you don't have it already) and use it to run your commands. This makes sure everyone working on this project has the same behavior for the dependencies and the lockfile.

</td><td width="500px"><br>

`package.json`

```jsonc
{
  "packageManager": "bun@1.1.0"
}
```

</td></tr></table>

### ESLint

This project uses [ESLint](https://eslint.org/) for both linting and formatting with [`@antfu/eslint-config`](https://github.com/antfu/eslint-config).

### Biome

This project uses [Biome](https://biomejs.dev/) for both linting and formatting with a custom [configuration](https://biomejs.dev/reference/configuration/).

### IDE Setup

[VS Code](https://code.visualstudio.com/) is recommended along with the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) or the [Biome extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome).

With the appropriate settings, you can have auto fix and formatting when you save the code you are editing.

A minimal `.vscode/settings.json` file is usually included that configures the correct extension for the specific project.

### No Prettier

Since ESLint is already configured to format the code, there is no need to duplicate the functionality with Prettier. To format the code, you can run `bun run lint --fix` or refer to the [ESLint section](#eslint) for IDE Setup.

If you have Prettier installed in your editor, it's recommended to disable it when working on the project to avoid conflicts.

### Turborepo

This project uses [Turborepo](https://github.com/vercel/turborepo) for monorepo management. It's a great tool for managing multiple packages in a single repository. You can read more about it [here](https://turbo.build/repo).

## Acknowledgements

This guide is heavily inspired by [Anthony Fu's contribution guide](https://github.com/antfu/contribution-guide).
