# @cyc-seattle/commodore

Shared options and logging setup for cyc-seattle command-line tools. It extends [commander](https://github.com/tj/commander.js) with options that configure [winston](https://github.com/winstonjs/winston).

```sh
pnpm add @cyc-seattle/commodore commander @commander-js/extra-typings winston
```

## Usage

The package exports three options for a `Command`:

| Option          | Flag                 | Purpose                                                              |
| --------------- | -------------------- | -------------------------------------------------------------------- |
| `LoggingOption` | `--logging <format>` | Selects the log format: `pretty` (default) or `json`.                |
| `VerboseOption` | `-v, --verbose`      | Raises the log level on each use. The default start level is `warn`. |
| `OutputOption`  | `--format <format>`  | Selects the output format for results: `pretty` (default) or `json`. |

Add the options to a command, then configure winston before the action runs:

```ts
import { Command } from "@commander-js/extra-typings";
import { LoggingOption, VerboseOption } from "@cyc-seattle/commodore";
import winston from "winston";

const program = new Command("my-tool")
  .addOption(new LoggingOption())
  .addOption(new VerboseOption("info"))
  .hook("preAction", (command) => {
    const opts = command.opts();
    winston.configure({
      level: opts.verbose ?? "info",
      format: opts.logging,
      transports: new winston.transports.Stream({ stream: process.stderr }),
    });
  })
  .action(() => {
    winston.info("Started");
  });

program.parse();
```

`VerboseOption` takes the level to start from. Each `-v` moves one step along `error`, `warn`, `info`, `debug`.

## Release

Every merge to `main` releases from the PR title. The title must be a conventional commit.

| Title                                          | Release |
| ---------------------------------------------- | ------- |
| `fix:`                                         | Patch   |
| `feat:`                                        | Minor   |
| `!` after the type, or `BREAKING CHANGE`       | Major   |
| `chore:`, `docs:`, `ci:`, `test:`, `refactor:` | None    |

The release publishes to npm over OIDC, with provenance. Release notes are on the repo's GitHub releases.
