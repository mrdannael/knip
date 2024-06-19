---
title: Script Parser
---

Knip parses shell commands and scripts to find additional dependencies and entry
files in various places:

- In [`package.json`][1]
- In specific [`config` files][2]
- In [source code][3]

Shell scripts can be read and statically analyzed, but not executed.

## package.json

The `main`, `bin`, `exports` and `scripts` fields may contain entry files. Let's
take a look at this example:

```json title="package.json"
{
  "name": "my-package",
  "main": "index.js",
  "exports": {
    "./lib": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  },
  "bin": {
    "program": "bin/cli.js"
  },
  "scripts": {
    "build": "bundle src/entry.ts",
    "start": "node --loader tsx server.ts"
  }
}
```

From this example, Knip automatically adds the following files as entry files:

- `index.js`
- `./dist/index.mjs`
- `./dist/index.cjs`
- `bin/cli.js`
- `src/entry.ts`
- `server.ts`

### Excluded files

Knip would not add the `exports` if the `dist` folder is matching a pattern in a
relevant `.gitignore` file or `ignore` option.

Knip does not add scripts without a standard extension. For instance, the
`bin/tool` file might be a valid executable for Node.js, but wouldn't be added
or parsed by Knip.

### Scripts parsing

When parsing the `scripts` entries of `package.json`, `knip` also detect
dependencies of `-r`, `--require`, `--loader` or `--import` arguments. Example:

```json
{
  "name": "my-lib",
  "scripts": {
    "start": "node --import tsx/esm run.ts"
  }
}
```

This will have `tsx` marked as a referenced dependency, and adds `run.ts` as an
entry file.

## Plugins

Some plugins also use the script parser to extract entry files and dependencies
from commands. A few examples:

- GitHub Actions: workflow files may contain `run` commands (e.g.
  `.github/workflows/ci.yml`)
- Husky & Lefthook: Git hooks such as `.git/hooks/pre-push` contain scripts;
  also `lefthook.yml` has `run` commands
- Lint Staged: configuration values are all commands
- Nx: task executors and `nx:run-commands` executors in `project.json` contains
  scripts
- Release It: `hooks` contain commands

## Source Code

When Knip is walking the abstract syntax trees (ASTs) of JavaScript and
TypeScript source code files, it looks for imports and exports. But there's a
few more (rather obscure) things that Knip detects in the process. Below are
examples of additional scripts Knip parses to find entry files and dependencies.

### bun

If the `bun` dependency is imported in source code, Knip considers the contents
of `$` template tags to be scripts:

```ts
import { $ } from 'bun';
await $`bun boxen I ❤ unicorns`;
await $`boxen I ❤ unicorns`;
```

Parsing the script results in the `boxen` binary (the `boxen-cli` dependency) as
referenced (twice).

### execa

If the `execa` dependency is imported in source code, Knip considers the
contents of `$` template tags to be scripts:

```ts
await $({ stdio: 'inherit' })`c8 node hydrate.js`;
```

Parsing the script results in `hydrate.js` added as an entry file and the `c8`
binary/dependency as referenced.

### zx

If the `zx` dependency is imported in source code, Knip considers the contents
of `$` template tags to be scripts:

```ts
await $`node scripts/parse.js`;
```

This will add `scripts/parse.js` as an entry file.

[1]: #packagejson
[2]: #plugins
[3]: #source-code
