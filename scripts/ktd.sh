#!/usr/bin/env bash

# Color handling (optional NO_COLOR environment variable)
if [[ -z "$NO_COLOR" ]]; then
    CYAN='\033[0;36m'
    RED='\033[0;31m'
    NC='\033[0m' # No Color
else
    CYAN=''
    RED=''
    NC=''
fi

# Function to exit on failure with a message
exit_on_failure() {
    local message=$1
    echo -e "${RED}${message}${NC}"
    exit 1
}

# Check if the correct number of arguments is passed
if [ "$#" -ne 2 ]; then
    exit 1
fi

# Positional arguments
CONTAINER_NAME=$1
DOCKER_BINARY=$2

# Commands with positional arguments (using arrays to avoid ShellCheck SC2089)
COPY_COMMAND=("$DOCKER_BINARY" "cp" "Koha" "$CONTAINER_NAME:/var/lib/koha/kohadev/plugins/")
INSTALL_COMMAND=("$DOCKER_BINARY" "exec" "$CONTAINER_NAME" "/kohadevbox/koha/misc/devel/install_plugins.pl")
RESTART_COMMAND=("$DOCKER_BINARY" "exec" "$CONTAINER_NAME" "bash" "-c" "koha-plack --restart kohadev")

# Copy plugin code into the container
echo -e "${CYAN}Copying files to the container...${NC}"
if ! "${COPY_COMMAND[@]}"; then
    exit_on_failure "Failed to copy files to the container."
fi

# Install the plugin
echo -e "${CYAN}Installing plugins...${NC}"
if ! "${INSTALL_COMMAND[@]}"; then
    exit_on_failure "Failed to install the plugin."
fi

# Restart Koha
echo -e "${CYAN}Restarting Koha...${NC}"
if ! "${RESTART_COMMAND[@]}"; then
    exit_on_failure "Failed to restart Koha."
fi
