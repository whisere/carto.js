#!/bin/bash

# Pull requests and commits to other branches shouldn't try to deploy
if [ "$TRAVIS_PULL_REQUEST" != "false" ] || [ "$TRAVIS_BRANCH" != "public-api" ]; then
  echo "Skip deploy: $TRAVIS_BRANCH"
  exit 0
fi

echo "Starting deployment"
echo "Target: gh-pages branch"

DOCS_DIR="docs"
EXAMPLES_DIR="examples"
TMP_DOCS_DIR="tmp_docs"
TMP_EXAMPLES_DIR="tmp_examples"

CURRENT_COMMIT=`git rev-parse HEAD`
ORIGIN_URL=`git config --get remote.origin.url`
ORIGIN_URL_WITH_CREDENTIALS="https://$GITHUB_TOKEN@github.com/$TRAVIS_REPO_SLUG"

echo "Generating documentation"
npm run docs
npm run docs:internal

echo "Move documentation to tmp file"
mv $DOCS_DIR $TMP_DOCS_DIR

echo "Move examples to tmp file"
mv $EXAMPLES_DIR $TMP_EXAMPLES_DIR

echo "Copy index.html"
cp config/jsdoc/index.html $TMP_DOCS_DIR/index.html || exit 1

echo "Fetching gh-pages branch"
git fetch origin gh-pages:refs/remotes/origin/gh-pages || exit 1

echo "Checking out gh-pages branch"
git checkout -b gh-pages origin/gh-pages || exit 1

echo "Copying source content to root"
rm -rf $DOCS_DIR/v4 || exit 1
mv $TMP_DOCS_DIR/public $DOCS_DIR/v4 || exit 1
rm -rf $DOCS_DIR/v4-internal || exit 1
mv $TMP_DOCS_DIR/internal $DOCS_DIR/v4-internal || exit 1
rm -rf $EXAMPLES_DIR/v4 || exit 1
mv $TMP_EXAMPLES_DIR/public $EXAMPLES_DIR/v4 || exit 1
mv $TMP_DOCS_DIR/index.html index.html || exit 1

echo "Pushing new content to $ORIGIN_URL"
git config user.name "Cartofante" || exit 1
git config user.email "systems@cartodb.com" || exit 1

git add index.html || exit 1
git add $DOCS_DIR || exit 1
git add $EXAMPLES_DIR || exit 1
git commit --allow-empty -m "Update docs/examples for $CURRENT_COMMIT" || exit 1
git push --force --quiet "$ORIGIN_URL_WITH_CREDENTIALS" gh-pages > /dev/null 2>&1

echo "Deployed successfully."
exit 0