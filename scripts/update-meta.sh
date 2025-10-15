#!/usr/bin/env bash

if [[ -z "$NO_COLOR" ]]; then
    CYAN='\033[0;36m'
    RED='\033[0;31m'
    NC='\033[0m' # No Color
else
    CYAN=''
    RED=''
    NC=''
fi

exit_on_failure() {
    local message=$1
    echo -e "${RED}${message}${NC}"
    exit 1
}

# Stash local changes
echo -e "${CYAN}Stashing local changes...${NC}"
if ! git stash; then
    exit_on_failure "Failed to stash local changes."
fi

# Pull latest changes from the repository
echo -e "${CYAN}Pulling latest commits from koha-plugin:main...${NC}"
if ! git pull https://github.com/pders01/koha-plugin.git main; then
    exit_on_failure "Failed to pull latest changes."
fi

# Pop the stash
echo -e "${CYAN}Popping stash...${NC}"
if ! git stash pop; then
    exit_on_failure "Failed to pop the stash."
fi
