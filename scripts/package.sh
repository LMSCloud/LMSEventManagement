#!/usr/bin/env bash

if [ "$1" == "" ]; then
  exit 1
fi

PLUGIN_PATH="$(echo "$1" | tr -s '::' '/')"
if [ "$PLUGIN_PATH" == "" ]; then
  exit 1
fi

if [ "$2" == "" ]; then
  exit 1
fi

if [ "$3" = "" ]; then
  exit 1
fi

echo "$PLUGIN_PATH"
mkdir dist
cp -r Koha dist/.
sed -i -e "s/{VERSION}/${PLUGIN_VERSION}/g" "dist/${PLUGIN_PATH}.pm"
sed -i -e "s/1900-01-01/$(date -I)/g" "dist/${PLUGIN_PATH}.pm"
(
  cd dist || exit 1
  zip -r ../"${2}-${3}".kpz ./Koha
)
rm -rf dist
