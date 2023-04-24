#!/bin/bash

# Configuration variables
OUTPUT_FILE=""
SOURCE_FILES=""
TEMPLATE_FILES=""

# Parse command-line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
    -o | --output)
        OUTPUT_FILE="$2"
        shift
        ;;
    -s | --source)
        SOURCE_FILES="$SOURCE_FILES $2"
        shift
        ;;
    -t | --template)
        TEMPLATE_FILES="$TEMPLATE_FILES $2"
        shift
        ;;
    *)
        echo "Unknown parameter passed: $1"
        exit 1
        ;;
    esac
    shift
done

# Load environment variables from .env file if no CLI arguments are passed
if [ -z "$OUTPUT_FILE" ] && [ -z "$SOURCE_FILES" ] && [ -z "$TEMPLATE_FILES" ]; then
    if [ -f ".env" ]; then
        while IFS='=' read -r key value; do
            if [[ ! $key =~ ^# ]]; then
                export "$key=$value"
            fi
        done < <(grep -v '^#' .env)
    else
        echo ".env file not found"
        exit 1
    fi
fi

# Use environment variables if CLI arguments are not provided
if [ -z "$OUTPUT_FILE" ]; then
    OUTPUT_FILE="$OUTPUT_FILE_ENV"
fi
if [ -z "$SOURCE_FILES" ]; then
    SOURCE_FILES="$SOURCE_FILES_ENV"
fi
if [ -z "$TEMPLATE_FILES" ]; then
    TEMPLATE_FILES="$TEMPLATE_FILES_ENV"
fi

# Check if all required arguments are provided
if [ -z "$OUTPUT_FILE" ] || [ -z "$SOURCE_FILES" ] || [ -z "$TEMPLATE_FILES" ]; then
    echo "Usage: $0 --output OUTPUT_FILE --source SOURCE_FILES --template TEMPLATE_FILES"
    exit 1
fi

# Create the output file if it doesn't exist
if [ ! -f "$OUTPUT_FILE" ]; then
    touch "$OUTPUT_FILE"
fi

# Extract strings from specified files
xgettext --from-code=utf-8 --force-po --output="$OUTPUT_FILE" \
    --keyword=__ --keyword=gtx.gettext --keyword=i18n:1,2 \
    $SOURCE_FILES

# Extract strings from .tt files and merge with existing .pot file
xgettext-tt2 --from-code=utf-8 --force-po --output="$OUTPUT_FILE" \
    --keyword=__ --keyword=gtx.gettext --keyword=i18n:1,2 \
    --join-existing \
    $TEMPLATE_FILES
