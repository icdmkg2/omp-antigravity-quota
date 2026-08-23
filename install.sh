#!/usr/bin/env bash
set -e

echo -e "\033[36m=====================================================\033[0m"
echo -e "\033[1;32m  OMP Live Google Antigravity Quota Installer\033[0m"
echo -e "\033[36m=====================================================\033[0m\n"

if ! command -v bun &> /dev/null; then
    echo -e "\033[31m[ERROR] Bun runtime is not installed or not in PATH.\033[0m"
    echo "Please install Bun first: curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
bun "${SCRIPT_DIR}/install.ts"
