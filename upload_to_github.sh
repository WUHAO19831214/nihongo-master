#!/bin/bash

# Initialize Git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Rename branch to main
git branch -M main

# Add remote (or set if exists)
if git remote | grep -q 'origin'; then
    git remote set-url origin https://github.com/WUHAO19831214/nihongo-master.git
else
    git remote add origin https://github.com/WUHAO19831214/nihongo-master.git
fi

# Push
git push -u origin main

echo "Done! Project uploaded to GitHub."
