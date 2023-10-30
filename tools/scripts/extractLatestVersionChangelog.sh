# Get the path to the markdown file from the command line
source_file=$1

diff --changed-group-format='%>' --unchanged-group-format='' <( git show HEAD~1:"$source_file" ) "$source_file" > RELEASE_CHANGELOG.md || true

echo "Success"
exit 0;
