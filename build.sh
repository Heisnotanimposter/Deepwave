#!/bin/bash
# Rebuild Script for heisnotanimposter.github.io

echo "[*] Setting up Tier-1 Systems AI Portfolio..."

# Ensure Hugo is installed (uncomment if you don't have it on your Mac)
# brew install hugo

echo "[*] Injecting PaperMod theme..."
git submodule add --depth=1 https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
git submodule update --init --recursive

echo "[*] Launching blazingly fast local dev server..."
hugo server -D
