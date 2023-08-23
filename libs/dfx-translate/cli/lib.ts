import * as fs from 'fs';

type KeyValue = {key: string; value: string};
type jsonType = {[key: string]: string};

export const getDefaultLanguage = async (log: boolean): Promise<string> => {
  const appModulePath = './src/app/app.module.ts';
  const mainPath = './src/main.ts';
  let defaultLanguage: string | undefined;

  // Check if the app.module.ts file exists.
  try {
    await fs.promises.access(appModulePath);
    const jsonMatch = /DfxTranslateModule\.setup\((.+)\)\s*,/.exec(await fs.promises.readFile(appModulePath, 'utf-8'));

    if (jsonMatch === null) {
      console.log('dfx-translate >> getDefaultLanguage: Unable to find the config object in DfxTranslateModule.setup({...})');
      throw new Error('Unable to find the config object in DfxTranslateModule.setup({...})');
    }
    const json = jsonMatch[1].replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ').replace(/'/g, '"');

    // Parse the JSON string and return the defaultLanguage property.
    defaultLanguage = (JSON.parse(json) as {defaultLanguage?: string}).defaultLanguage;
    if (!defaultLanguage) {
      console.log('dfx-translate >> getDefaultLanguage: Unable to extract default language out of json');
      throw new Error('Unable to extract default language out of json');
    }
  } catch {
    if (log) console.log('dfx-translate >> getDefaultLanguage: app.module.ts not found - trying app.component.ts');

    // If the app.module.ts file does not exist, check if the app.component.ts file exists.
    try {
      await fs.promises.access(mainPath);
      const jsonMatch = /withDefaultLanguage\((['"])(.*?)\1\)/.exec(await fs.promises.readFile(mainPath, 'utf-8'));

      if (jsonMatch === null) {
        console.log('dfx-translate >> getDefaultLanguage: Unable find the withDefaultLanguage() method');
        throw new Error('Unable find the withDefaultLanguage() method');
      }

      defaultLanguage = jsonMatch[2];
      if (!defaultLanguage) {
        console.log('dfx-translate >> getDefaultLanguage: Unable to extract default language out of the function call');
        throw new Error('Unable to extract default language out of the function call');
      }
    } catch {
      console.log('dfx-translate >> getDefaultLanguage: Neither app.module.ts or app.component.ts found - cancelling');
      throw Error('Neither app.module.ts or app.component.ts found');
    }
  }

  return defaultLanguage;
};

export const exists = (path: string): boolean => fs.existsSync(path);

export const createDir = (path: string): string | undefined => fs.mkdirSync(path, {recursive: true});

/**
 * Get json from local machine
 * @param {String} filename on local machine
 * @returns {Promise} resolved object is JSON
 */
export const getJSON = async (filename: string): Promise<jsonType> => JSON.parse(await fs.promises.readFile(filename, 'utf-8')) as jsonType;

/**
 * Saves object as JSON into file
 * @param {String} filename, name of file to be saved
 * @param {string} obj to be saved as json
 * @returns {Promise}
 */
export const writeToFile = async (filename: string, obj: string): Promise<void> => {
  return fs.promises.writeFile(filename, obj);
};

/**
 * Converts object to array
 * @param {Object} obj
 * @returns {Array}
 * @example
 * convertToArray({fullName:"Full Name"})
 * returns [{key:"fullName", value:"Full name"}]
 */
export const convertToArray = (obj: jsonType): KeyValue[] => Object.keys(obj).map((key) => ({key, value: obj[key]}));

/**
 * Converts array to object
 * @returns {Object}
 * @example
 * // returns {fullName:"Full Name"}
 * convertToObject([{key:"fullName", value:"Full name"}])
 * @param arr
 */
export const convertToObject = (arr: KeyValue[]): jsonType =>
  arr.reduce((acc, curr) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    acc[curr.key] = curr.value;
    return acc;
  }, {});

/**
 * Processes all the input array and calls `getTranslation` onEach row
 * @param {Array} arr, array of objects term to be translated in the shape of `{key:"", value:""}`, eg. `{key:"fullName", value:"Full name"}
 * @returns {string} resolved array is in the same shape as input
 */
export const getTypeStringFromArray = (arr: KeyValue[]): string =>
  `export type translationKeys = string | undefined | null | ${arr.map((term) => `'${term.key}'`).join(' | ')};`;

export const translateIntoLanguage = async (
  url: string,
  sourceLang: string,
  targetLang: string,
  arr: KeyValue[],
  dir: string,
  cacheEnabled: boolean,
  log: boolean,
): Promise<KeyValue[]> => {
  const manualTranslationPath = `${dir}${targetLang}.json`;
  const manualTranslation: jsonType | undefined = exists(manualTranslationPath) ? await getJSON(manualTranslationPath) : undefined;
  if (log) console.log(`dfx-translate >> manual translation lookup path: "${manualTranslationPath}"`);
  if (manualTranslation === undefined) {
    console.log(`dfx-translate >> no manual translation found for: "${targetLang}"`);
  } else {
    // Clear manual translated files from array which is to be translated
    for (const term of arr) {
      if (manualTranslation[term.key] != null) {
        if (log) console.log(`dfx-translate >> found manual translation for "${term.key}"`);
        arr.splice(arr.indexOf(term), 1);
      }
    }
  }

  const targetLangLocalCachePath = './node_modules/dfx-translate/translation/translation_cache_' + targetLang + '.json';
  const localCache: jsonType | undefined =
    exists(targetLangLocalCachePath) && cacheEnabled ? await getJSON(targetLangLocalCachePath) : undefined;
  if (log) console.log(`dfx-translate >> cache lookup path: "${targetLangLocalCachePath}"`);
  if (localCache === undefined) {
    console.log(`dfx-translate >> no local cache found for "${targetLang}"`);
  }

  const translated: KeyValue[] = [];
  for (const ogTranslation of arr) {
    const cachedValue = localCache ? localCache[ogTranslation.value] : undefined;
    if (cachedValue) {
      console.log(`Translating "${ogTranslation.value}" from cache to ${targetLang}: "${cachedValue}"`);
      translated.push({
        key: ogTranslation.key,
        value: cachedValue,
      });
    } else {
      try {
        const t = await getTranslation(url, sourceLang, targetLang, ogTranslation);
        if (localCache) {
          localCache[ogTranslation.value] = t.value;
        }
        translated.push(t);
      } catch (e) {
        console.log(e);
        console.log(`dfx-translate >> error during fetch for "${ogTranslation.value}" to ${targetLang}`);
      }
    }
  }
  if (localCache) {
    void fs.promises.writeFile(targetLangLocalCachePath, JSON.stringify(localCache)).then(() => {
      console.log(`dfx-translate >> cache saved in "${targetLangLocalCachePath}"`);
    });
  }

  return translated;
};

const getTranslation = async (url: string, source: string, target: string, term: KeyValue): Promise<KeyValue> => {
  const body = JSON.stringify({
    format: 'text',
    q: term.value,
    target,
    source,
  });

  const controller = new AbortController();
  setTimeout(() => controller.abort(), 5000);

  const response = await fetch(`${url}/translate`, {
    signal: controller.signal,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`Fetch failed with status code ${response.status}`);
  }

  const json = (await response.json()) as {translatedText: string};
  console.log(`Translating "${term.value}" to ${target}: "${json.translatedText}"`);
  return {key: term.key, value: json.translatedText};
};
