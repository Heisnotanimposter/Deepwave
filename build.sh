#!/bin/bash
# Rebuild Script for heisnotanimposter.github.io

echo "[*] Setting up Tier-1 Systems AI Portfolio..."

if ! command -v hugo &> /dev/null; then
    echo "[*] Hugo not found. Downloading the standalone binary to bypass brew permissions..."
    curl -sL https://github.com/gohugoio/hugo/releases/download/v0.125.4/hugo_extended_0.125.4_darwin-universal.tar.gz -o hugo.tar.gz
    tar -xzf hugo.tar.gz hugo
    rm hugo.tar.gz
    HUGO_CMD="./hugo"
else
    HUGO_CMD="hugo"
fi
echo "[*] Injecting PaperMod theme..."
git submodule add --depth=1 https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
git submodule update --init --recursive

echo "[*] Launching blazingly fast local dev server..."
$HUGO_CMD server -D
