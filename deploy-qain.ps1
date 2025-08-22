# Initialize git if not already
git init

# Add all files
git add .

# Commit initial version
git commit -m "Initial QAIN site commit"

# Create new GitHub repo and push
gh repo create qain-project --public --source=. --remote=origin --push

# Create gh-pages branch
git checkout -b gh-pages
git push origin gh-pages

# Enable GitHub Pages via API
$USER = gh api user --jq ".login"
gh api repos/$USER/qain-project/pages --method POST --field source=branch=gh-pages,path=/

