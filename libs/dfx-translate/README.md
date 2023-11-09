# dfx-translate

A simple translation package for Angular.

[![npm version](https://badge.fury.io/js/dfx-translate.svg)](https://npmjs.org/package/dfx-translate)
[![NPM](https://img.shields.io/npm/dw/dfx-translate?logo=npm)](https://npmjs.org/package/dfx-translate)
[![npm bundle size](https://img.shields.io/bundlephobia/min/dfx-translate?cacheSeconds=86400)](https://npmjs.org/package/dfx-translate)

### Features

- inline html translations via pipe
- opt-in type-safety without declaring your own pipes and services.
- in-code translation with services
- an easy-to-use json structure
- auto-translation feature via [LibreTranslate](https://github.com/LibreTranslate/LibreTranslate) API integration

### Information

- [Supported languages for auto-translation](#supported-languages)
- [Setup](#setup)
- [Usage](#usage)
  - [Language switching](#switching-languages)
  - [Pipeline](#pipeline-usage)
  - [Service](#service-usage)

### Version compatibility

| Angular | dfx-translate |
| ------- | ------------- |
| 17.x.x  | 4.x.x         |
| 16.x.x  | 3.x.x         |
| 15.x.x  | 2.x.x         |

## Setup

### Installation

```shell
npm install dfx-translate@latest
```

After the installation a folder is automatically created at `src/assets/i18n`. You can use this folder for your
translation files, or you delete it and configure dfx-translate to use your own folder. More to this in
[Configuration](#configuration)

### Language file setup

Choose a primary language and let's say you've picked **english**. Create an `en.json` file with following content:

```json
{
  "WELCOME": "Welcome",
  "WELCOME_SUBTEXT": "stranger."
}
```

_Note: The json structure must always consist of a key and value pair._

#### Manual translation

Choose an additional language, lets say you've picked **german**. Create an `de.json` file

```json
{
  "WELCOME": "Willkomen",
  "WELCOME_SUBTEXT": "Fremder."
}
```

_Note: You **do not** have to translate all strings if you are using
the [auto-translate feature](#auto-deep-learning-translation)._

#### Auto translation

dfx-translate can translate the primary language into a whole new language **and will take partially manual translated
languages into account**, meaning it will only translate strings which are not occurring in the manual created
translations.

[Read more](#auto-deep-learning-translation)

### Registration in root (app) module

This has to be done only once in the project. Ideal in `app.module.ts`

```typescript
import {DfxTranslateModule} from "dfx-translate";

@NgModule({
  declarations: [...],
  imports: [
    ...
      DfxTranslateModule.setup({
        configuration: {
          languagesWithAutoTranslation: ['de'],
          useLocalStorage: false
        }
      })
  ],
  bootstrap: [...]
})
export class AppModule {
}
```

### Configuration

| property                        | description                                                       |     | default value |
| ------------------------------- | ----------------------------------------------------------------- | :-- | ------------- |
| defaultLanguage                 | Short code of the primary language (identically to the file name) |     | `en`          |
| languagesWithAutoTranslation    | Short code array of languages with auto translated translations   |     | `[]`          |
| useLocalStorage                 | Saves selected languages as into local storage                    |     | `true`        |
| defaultUndefinedOrNullBooleanTo | Boolean translations default to an empty string if it's null      |     | `null`        |
| assetsPath                      | Path to translations files                                        |     | `assets/i18n` |

### Registration in feature module

```typescript
import {DfxTranslateModule} from "dfx-translate";

@NgModule({
  declarations: [...],
  imports: [
    DfxTranslateModule,
    ...
  ],
})
export class FeatureModule {
}
```

### Generate types

dfx-translate sadly can't provide type information out of the box. But with a little workaround we still can access
the nice features of TypeScript.

```shell
translate-cli generateTypes {SOURCE_LANGUAGE_PATH}
```

If you defined a default language you do not have to provide the source language path.

If you want to change the folder where your default language is searched, you can do this with `--dir {PATH}`

#### Do it automatically

`package.json`

```json
{
  ...
  "scripts": {
    "start": "translate-cli generateTypes && ng serve",
    "prepare": "translate-cli generateTypes"
  },
  ...
}
```

#### Reset types

```shell
translate-cli resetTypes
```

## Usage

### Switching languages

```angular2html
<select id='language'
        [(ngModel)]='selected' (ngModelChange)='setLang($event)'>
  <option value='en'>English</option>
  <option value='de'>German</option>
  <option value='es'>Spanish</option>
  <option value='fr'>France</option>
  <option value='it'>Italien</option>
  <option value='pt'>Portugues</option>
</select>
```

```typescript
import {TranslateService} from "dfx-translate";

@Component({
  selector: 'app-example',
  templateUrl: ...,
  styleUrls: [...],
})
export class ExampleLanguageSwitcher {
  selected: string;

  constructor(private translator: TranslateService) {
    this.selected = this.translator.getSelectedLanguage();
  }

  setLang(lang: string) {
    this.translator.use(lang);
  }
}
```

### Pipeline usage

```angular2html
<h1>{{'WELCOME' | tr}}</h1>
<span>{{'WELCOME_SUBTEXT' | tr}}</span>
```

### Service usage

Access translations via code with `TranslateService`

```typescript
import {Component, OnInit} from '@angular/core';
import {TranslateService} from 'dfx-translate';

@Component({
  selector: 'app-example',
})
export class ExampleComponent implements OnInit {
  constructor(private translator: TranslateService) {}

  ngOnInit(): void {
    window.alert(this.translator.translate('WELCOME'));
  }
}
```

## Auto deep learning translation

It's possible to translate not manual translated strings via
[LibreTranslate](https://github.com/LibreTranslate/LibreTranslate) API. LibreTranslate is an open-source, self-hostable
machine-translation service.

dfx-translate can translate the primary language into a whole new language and will take partially manual translated
languages into account, meaning it will only translate strings which are not occurring in the manual created
translations.

Simple usage:

```shell
translate-cli {API_URL} {TARGET_LANGUAGE_CODE} --source src/assets/i18n/{DEFAULT_LANGUAGE_CODE}.json
```

You do not have to use the `--source` argument if you define the default language in your `DfxTranslateModule.setup( {...})` call. Also, you **never** have to auto-translate fully manual translated files.

### Supported languages

[View the list](https://libretranslate.com/languages)

Keep in mind that at least one of the fully manual translated files has to be in such a language for this feature to
work.

### Example

- **Primary language: en**; **Fully translated language: de**; **Partially translated language: es**; **Not translated
  language: fr**
  ```shell
  translate-cli https://translate.abc.abc/translate es
  translate-cli https://translate.abc.abc/translate fr
  ```
  Following files should be in `src/assets/i18n/` folder.
  - `en.json` - the primary language
  - `de.json` - additional language, fully manual translated
  - `es.json` - additional language, partially manual translated
  - `es_auto.json` - additional language, auto-translated missing strings of `es.json` compared to the primary language
  - `fr_auto.json` - additional language, completely auto-translated containing all translations

### Simplifying

For simplicity purposes I wrote a little shell script. Put this at the top / root level of the project

```shell
#!/usr/bin/env bash
main () {
 translate-cli https://translate.abc.abc/translate de
 translate-cli https://translate.abc.abc/translate fr
 translate-cli https://translate.abc.abc/translate es
 translate-cli https://translate.abc.abc/translate it
 translate-cli https://translate.abc.abc/translate pt

 # If you have any prettier library intstalled, execute it here
 # prettier --config ./.prettierrc --write ./src/assets/i18n

 printf "\nFinished!"
}
time main
```

Now you only have to run this script.

By [Dafnik](https://dafnik.me)
