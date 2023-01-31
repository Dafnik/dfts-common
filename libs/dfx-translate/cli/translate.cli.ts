// noinspection RequiredAttributes

import {
  convertToArray,
  convertToObject,
  createDir,
  exists,
  getDefaultLanguage,
  getJSON,
  getTypeStringFromArray,
  translateIntoLanguage,
  writeToFile,
} from './lib';
import {program} from 'commander';

const translationKeysTypePath = './node_modules/dfx-translate/lib/translationKeys.d.ts';
const defaultAssetsPath = './src/assets/i18n/';

program.name('translate-cli').description('dfx-translate development tools and helper scripts').version('1.0.0');

program
  .command('generateTypes')
  .description('Generates type-definitions for your default language')
  .argument('[sourceLanguagePath]', 'Path to source language file')
  .option('--log', 'Log more information')
  .option('--dir <path>', 'Path to language files folder', defaultAssetsPath)
  .action(async (sourcePath: string | undefined, options: {log: boolean; dir: string}) => {
    try {
      sourcePath = sourcePath ?? options.dir + (await getDefaultLanguage(options.log)) + '.json';
    } catch {
      console.error('Default language could not be determined. Please provide the "sourceLanguagePath" in the command.');
      console.log('Example: "translate-cli generateTypes [sourceLanguagePath]"');
      return;
    }
    if (options.log) console.log(`dfx-translate >> source path: "${sourcePath}"`);
    getJSON(sourcePath)
      .then((input_vars) => convertToArray(input_vars))
      .then((input_arr) => getTypeStringFromArray(input_arr))
      .then((typeString) => {
        if (options.log) console.log(`dfx-translate >> new types: "${typeString}"`);
        return writeToFile(translationKeysTypePath, typeString);
      })
      .then(() => console.log('dfx-translate >> Successfully saved translation types')) // outputs success
      .catch((err) => console.error('Error', err)); // shows error in case above fails
  });

program
  .command('resetTypes')
  .description('Resets type-definitions')
  .action(async () => {
    await writeToFile(translationKeysTypePath, 'export type translationKeys = string | undefined | null;');
    console.log('dfx-translate >> Types reset.');
  });

program
  .command('createDir')
  .description('Creates the default directory for all language files')
  .option('--log', 'Log more information')
  .action((options: {log: boolean}) => {
    if (!exists(defaultAssetsPath)) {
      createDir(defaultAssetsPath);
      console.log('dfx-translate >> Created default language assets directory.');
    } else if (options.log) {
      console.log('dfx-translate >> Language directory already exists');
    }
  });

program
  .command('autoTranslate')
  .description('Translates a file into another language')
  .argument('<url>', 'LibreTranslate Instance URL')
  .argument('<targetLanguageCode>', 'Wanted language')
  .option('--log', 'Log more information')
  .option('--disable-cache', 'Disables cache', false)
  .option('--source <path>', 'Path to source language file')
  .option('--dir <path>', 'Path to language files folder', defaultAssetsPath)
  .action(async (instanceUrl: string, targetLang: string, options: {log: boolean; disableCache: boolean; source: string; dir: string}) => {
    let sourcePath = '';

    try {
      sourcePath = options.source ?? options.dir + (await getDefaultLanguage(options.log)) + '.json';
    } catch {
      console.error('Default language could not be determined. Please provide the "sourceLanguagePath" in the command.');
      console.log('Example: "translate-cli generateTypes [sourceLanguagePath]"');
      return;
    }

    const sourceLang = sourcePath.split('/').pop()?.split('.').at(0);
    if (!sourceLang) {
      console.log('dfx-translate >> ERROR: Could not extract source language');
      if (options.log) {
        console.log(`dfx-translate >> path: "${sourcePath}"`);
      }
      return;
    }

    getJSON(sourcePath)
      .then((input_vars) => convertToArray(input_vars))
      .then((input_arr) =>
        translateIntoLanguage(instanceUrl, sourceLang, targetLang, input_arr, options.dir, options.disableCache, options.log)
      )
      .then((transl_arr) => convertToObject(transl_arr))
      .then((output_vars) => writeToFile(`${options.dir}${targetLang}_auto.json`, JSON.stringify(output_vars)))
      .then(() => console.log('dfx-translate >> translation successfully saved'))
      .catch((err) => console.error('Error', err));
  });

program.parse();
