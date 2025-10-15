#!/usr/bin/env bash

if [ "$1" == "" ]; then
  exit 1
fi

PLUGIN_PATH="$(echo "$1" | tr -s '::' '/')"
if [ "$PLUGIN_PATH" == "" ]; then
  exit 1
fi

# Support multiple directories as remaining arguments
shift
STATIC_DIRS=("$@")

if [ ${#STATIC_DIRS[@]} -eq 0 ]; then
  echo "Error: At least one static directory must be specified"
  exit 1
fi

staticapi_template_file="templates/staticapi.json"
if [ ! -f "$staticapi_template_file" ]; then
  echo "Error: Template file not found at $staticapi_template_file"
  exit 1
fi

spec_body=$(cat "$staticapi_template_file")
json_fragments=()

# Process each static directory
for STATIC_DIR in "${STATIC_DIRS[@]}"; do
  STATIC_PATH="$PLUGIN_PATH/$STATIC_DIR"

  if [ ! -d "$STATIC_PATH" ]; then
    echo "Warning: Directory $STATIC_PATH not found, skipping"
    continue
  fi

  echo "Processing directory: $STATIC_DIR"

  while IFS= read -r -d '' file; do
    if [ -f "$file" ]; then
      path_name="${file//$PLUGIN_PATH/}"
      echo "  Creating $path_name"
      json_fragments+=("$path_name")
    fi
  done < <(find "$STATIC_PATH" -type f -print0)
done

if [ ${#json_fragments[@]} -eq 0 ]; then
  echo "Error: No files found in specified directories"
  exit 1
fi

# Build a proper JSON object with all endpoints
{
  echo "{"
  for i in "${!json_fragments[@]}"; do
    path="${json_fragments[$i]}"
    echo "  \"$path\": $spec_body"
    if [ "$i" -lt $((${#json_fragments[@]} - 1)) ]; then
      echo ","
    fi
  done
  echo "}"
} | jq . >"$PLUGIN_PATH/staticapi.json"

echo "staticapi.json has been created at $PLUGIN_PATH"
