const fs = require("fs-extra");

const urlBase = "https://icons.getbootstrap.com/icons/";
const allIconsVariable = "allIcons";
const libFolder = "libs/dfx-bootstrap-icons/src/lib";

// source original bootstrap icons
const iconsSrcFolder = "./node_modules/bootstrap-icons/icons";
// generated folder
const generatedDestFolder = `${libFolder}/generated`;
// type output folder
const iconsDestFolder = `${generatedDestFolder}/icons`;
// template for icons
const iconTemplate = fs.readFileSync(
  "tools/tmpl/icon.ts.tmpl",
  "utf-8"
);

const indexFile = `${iconsDestFolder}/index.ts`;
const allFile = `${iconsDestFolder}/all.ts`;
const versionFile = `${generatedDestFolder}/icons.version.ts`;
const listFile = `${generatedDestFolder}/icon-names.list.ts`;
const enumFile = `${generatedDestFolder}/icon-names.enum.ts`;
const typeFile = `${generatedDestFolder}/icon-names.type.ts`;

let exportAllString = `\nexport const allIcons = {\n`;

let exportAllIconsList = `import {IconName} from './icon-names.type'\n\n`;
exportAllIconsList += `/** List with all icons. */`;
exportAllIconsList += `\nexport const IconNameList: IconName[] = [\n`;

let exportTypeString = `/** Type for icon names. */`;
exportTypeString += `\nexport type IconName =\n`;
let exportEnumString = `/** Enum with all icons. */`;
exportEnumString += `\nexport enum IconNamesEnum {\n`;

fs.emptyDirSync(iconsDestFolder);
fs.readdirSync(iconsSrcFolder).forEach((filename) => {
  if (filename.includes(".svg")) {
    const iconName = filename.replace(".svg", "").trim();

    exportAllIconsList += `/** {@link ${urlBase}${iconName}} */\n`;
    exportAllIconsList += `'${iconName}',\n`;
    exportTypeString += `/** {@link ${urlBase}${iconName}} */\n`;
    exportTypeString += `'${iconName}' | \n`;

    const fileContent = fs.readFileSync(`${iconsSrcFolder}/${filename}`, "utf-8");
    const exportName = escapedName(iconName);

    exportEnumString += `/** {@link ${urlBase}${iconName}} */\n`;
    exportEnumString += `${exportName} = '${iconName}',\n`;

    let iconOutput = iconTemplate
      .replace(/__ICON_NAME__/g, iconName)
      .replace(/__EXPORT_NAME__/g, exportName)
      .replace(/__PAYLOAD__/, fileContent.replace(/<(\w+)([^>]*)\/>/g, '<$1$2></$1>'));
    fs.writeFileSync(`${iconsDestFolder}/${iconName}.ts`, iconOutput, "utf-8");

    fs.appendFileSync(
      indexFile,
      `export { ${exportName} } from './${iconName}';\n`
    );
    fs.appendFileSync(
      allFile,
      `import { ${exportName} } from './${iconName}';\n`
    );
    exportAllString += `  ${exportName},\n`;
    console.log(`icon ${exportName} | ${iconName} generated.`);
  }
});
exportAllString += `};\n`;
exportAllIconsList += `];\n`;
exportEnumString += `};\n`;

// Remove last Pipe character ("|") from Type Output
exportTypeString = exportTypeString.slice(0, -3);
exportTypeString += `;\n`;

fs.appendFileSync(allFile, exportAllString);
fs.appendFileSync(
  indexFile,
  `\nexport { ${allIconsVariable} } from './all';\n`
);
fs.writeFileSync(enumFile, exportEnumString);
fs.writeFileSync(listFile, exportAllIconsList);
fs.writeFileSync(typeFile, exportTypeString);

const bootstrapIconsVersion = JSON.parse(fs.readFileSync('./node_modules/bootstrap-icons/package.json', 'utf8')).version;
fs.writeFileSync(versionFile, `export const BOOTSTRAP_ICONS_VERSION = "${bootstrapIconsVersion}"`)


function escapedName(input) {
  // Define a mapping of number-to-word
  const numberToWord = {
    '0': 'Zero',
    '1': 'One',
    '2': 'Two',
    '3': 'Three',
    '4': 'Four',
    '5': 'Five',
    '6': 'Six',
    '7': 'Seven',
    '8': 'Eight',
    '9': 'Nine'
  };

  // Split the input string into words
  const words = input.split('-');

  // Check if the first word starts with a number
  const firstWord = words[0];
  if (/[0-9]/.test(firstWord[0])) {
    // Replace the first character with its word form
    words[0] = numberToWord[firstWord[0]] + firstWord.slice(1);
  }

  // Rejoin the words with hyphens to form the final formatted string
  const formattedString = words.join('-');

  // lowercase first letter
  return toCamelCase(formattedString.charAt(0).toLowerCase() + formattedString.slice(1));
}

function toCamelCase(input, separator = '-') {
  if (!input) throw new Error('missing argument');

  const val = input.trim();
  if (!val.includes(separator)) return val;

  let res = '';
  let iterator = 0;

  for (iterator; iterator < input.length; iterator += 1) {
    const char = input.charAt(iterator).trim();

    if (iterator === 0) {
      res += char.toLowerCase();
      continue;
    }

    if (char === separator) {
      res += input
        .charAt(iterator + 1)
        .trim()
        .toUpperCase();
      iterator += 1;
      continue;
    }

    if (iterator > 0 && !isNaN(Number(+input.charAt(iterator - 1)))) {
      res += char.toUpperCase();
      continue;
    }

    if (iterator > 0) res += char;
  }
  return res.trim();
}

