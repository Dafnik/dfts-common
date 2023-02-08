# Get the path to the markdown file from the command line
markdown_file=$1

# Extract the first section of the markdown file
markdown=$(cat "$markdown_file")
first_section=$(echo "$markdown" | awk 'BEGIN {RS="\n#"; FS="\n"} /\[.*\]/{header=$0; getline; section=header ORS $0; print section; exit}')

echo "$first_section" > RELEASE_CHANGELOG.md
echo "Success"