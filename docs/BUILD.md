# Building the Plugin

This document describes how to produce a `.kpz` archive from a fresh clone of the repository.

## Prerequisites

| Tool | Purpose | Install |
|------|---------|---------|
| [Node.js](https://nodejs.org/) >= 20 | JS toolchain | `brew install node` or [nvm](https://github.com/nvm-sh/nvm) |
| [npm](https://www.npmjs.com/) | Package manager (ships with Node) | — |
| [just](https://github.com/casey/just) | Command runner | `brew install just` |
| [rolldown](https://rolldown.rs/) | JS bundler | installed via `npm install` (local) |

`just package` calls `scripts/package.sh` which only needs `zip` (available by default on macOS and most Linux distros).

## Steps

### 1. Clone with submodules

```bash
git clone --recurse-submodules https://github.com/LMSCloud/LMSEventManagement.git
cd LMSEventManagement
```

If you already cloned without `--recurse-submodules`:

```bash
git submodule update --init --recursive
```

### 2. Install JS dependencies

```bash
npm install
```

### 3. Build

The full build (sync Util modules, generate CSS, format code, bundle JS, package `.kpz`):

```bash
npm run build
```

Or without formatting:

```bash
npm run build:no-fmt
```

This runs:
1. `tools/sync_util.sh` — copies vendor Util modules into the plugin namespace
2. `tools/generate_tw_css_result.mjs` — generates Tailwind CSS
3. `rolldown -c` — bundles the TypeScript/JS sources
4. `just package` — zips the `Koha/` tree into a `.kpz`

The output is a file named `lms-event-management-<version>.kpz` in the project root.

### 4. Install in Koha

Upload the `.kpz` file via the Koha staff interface at **Home > Tools > Plugins > Upload plugin**.

## Individual Build Steps

You can run each step independently:

```bash
# Sync Util modules from vendor submodule
npm run util:sync

# Generate Tailwind CSS
npm run css:build

# Bundle JS/TS
npx rolldown -c

# Package .kpz only (assumes everything else is already built)
just package

# Format TypeScript
npm run format:ts

# Format Perl
npm run format:pl
```

## Translations

```bash
# Extract translatable strings into a .pot file
npm run translate:extract

# Create a new .po file for a locale
npm run translate:instantiate

# Compile .po files to JSON and register static routes
npm run translate:package
```
