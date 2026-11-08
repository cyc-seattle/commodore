# AGENTS.md

Guidance for coding agents working in this repository.

Follow `cyc:conventions` (the rules shared by every cyc-seattle repo).

## Overview

`@cyc-seattle/commodore` is a small npm library of shared [commander](https://github.com/tj/commander.js) options
that set up [winston](https://github.com/winstonjs/winston) logging for cyc-seattle's command-line tools. Its users
are clubspot-sdk, calendar-sync, and platform's syncs. See `README.md` for the API.

## Tasks

mise provides the tools. Run `mise trust`, then `mise run install`.

- `mise run ci`: `check`, then `test`
- `mise run check`: typecheck, Prettier check, ESLint
- `mise run format`: fix formatting and lint
- `mise run test`: run the tests with vitest
- `mise run build`: compile into `dist/`

## Releases

Every merge to `main` publishes to npm, with the version picked from the PR title (see `README.md`). A `fix:` or
`feat:` title ships a release to every user, so use `chore:`, `docs:`, `test:` or `refactor:` for changes that
don't touch the published code.

## Code style

TypeScript with ESLint and Prettier from `@cyc-seattle/ts-config`. ESM: import paths carry the `.js` extension. PR
titles are conventional commits. Never push to `main`.

Comments explain **why**, not what. Keep them to a line or two, and cite an issue instead of recounting it.
