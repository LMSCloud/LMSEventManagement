#!/usr/bin/env just --justfile

set dotenv-load

# Lists available commands.
default:
  @just --list

# Careful! This removes Koha/ and package.json
clean:
  #!/usr/bin/env bash
  rm -rf Koha;
  rm -f package.json

# Initialises a new koha plugin based on your input.
init:
  carton exec ./scripts/init.pl

# Adds a component to your initialised koha plugin based on your input.
add component:
  carton exec ./scripts/add.pl {{component}}

# Increments the version in your local .env, base module and package.json if present. This also updates date_updated!
increment type='patch' times='1':
  ./scripts/increment.pl --version "${PLUGIN_VERSION}" --name "${PLUGIN_NAME}" --type {{type}} --times {{times}}

# Creates a kpz file by zipping the current state of the `Koha` directory.
package:
  ./scripts/package.sh "${PLUGIN_NAME}" "${PLUGIN_RELEASE_FILENAME}" "${PLUGIN_VERSION}"

# Updates the staticapi.json file within the plugin to expose all files within static directories.
staticapi:
  ./scripts/staticapi.sh "${PLUGIN_NAME}" ${PLUGIN_STATIC_DIRS}

ktd container="kohadev-koha-1" binary="docker":
  ./scripts/ktd.sh {{container}} {{binary}}

# Attempts to update the koha-plugin repository itself. If you've updated core components, you'll have to resolve the conflicts yourself, though.
update-meta:
  ./scripts/update-meta.sh
