# dfx-helper

Angular Library with tons of utility tools helping in all projects.

[![NPM](https://nodei.co/npm/dfx-helper.png)](https://npmjs.org/package/dfx-helper)

### Information

- [NPM package link](https://www.npmjs.com/package/dfx-helper)
- [Usage](#usage)
- [Development](#development)
- [Deployment notes](#deployment-notes)
- [Project website](https://datepoll.org)

## Usage

```shell
npm install dfx-helper
```

_If you have not already installed [@angular/cdk](https://material.angular.io/cdk)_

```shell
npm install @angular/cdk
```

### Useful classes:

- **Components**
  - `ABlock` - Building block from ui stuff
  - `AComponent`
  - `ADirective`
- **Decorator**/**Annotations**
  - `Confirmable()`
  - `Delay()`
  - `MeasureTime()`
  - `Once`
  - `RememberResult`
  - `RunOutesideChangeDetection`
  - `Throttle()`
- **Directives**
  - `hideIfOnline` & `hideIfOffline`
  - `hideIfPingSucceeds` & `hideIfPingFails`
  - `print`
  - `trackByPropertyName`, `trackById` & `trackByIndex`
- **Helper**
  - `ArrayHelper`
  - `BrowserHelper`
  - `ClipboradHelper`
  - `Converter`
  - `DateHelper`
  - `Generator`
  - `Logger` / `LoggerFactory`
  - `Stopwatch`
  - `StorageHelper`
  - `StringHelper`
  - `Thread`
  - `TypeHelper`
  - `UIHelper`
- **Entities**
  - `HasID` & `HasName`
  - `IEntity` & `IEntityWithName`
  - `AEntity` & `AEntityWithName`
  - **EntityServices**
    - `AEntityService`
    - `ASelectableEntityService`
- **Interceptors**
  - `BaseUrlInterceptor`
  - `LoggingInterceptor`
  - `PostPutJsonContentTypeInterceptor`
- **Pipes**
  - `cut`
  - `implode` & `implodeMapped`
  - `timespan`
  - `truncate`
- **Services**
  - `IsMobileService`
- **Strategies**
  - `AbstractTitleStrategy`
  - `DfxPreloadStrategy`
- **Collections**
  - `List`
  - `EntityList`
  - `IList`

## Development

Everything important in this library is located in `projects/dfx-helper`, that's the "real" library. (following
commands still have to be executed at the root level)

#### Dependency installation

```shell
npm install
```

#### Building a production version

```shell
npm run helper:build
```

#### Lint

```shell
npm run helper:lint
```

#### Starting development environment (with automatic tests)

```shell
npm helper:test
```

#### Generating a coverage report

```shell
npm run helper:test:coverage
```

#### Starting the development environment (for direct use in another project)

```shell
npm run helper:watch
```

### Deployment notes

dfx-helper deployments are managed
via [.gitlab-ci](https://gitlab.com/DatePoll/common/dfx-common/-/blob/development/.gitlab-ci.yml)

All builds are uploaded
to [releases.datepoll.org/common/dfx-helper](https://releases.datepoll.org/common/dfx-helper)

#### Development builds

Commits to the [development](https://gitlab.com/DatePoll/common/dfx-helper/-/tree/development) branch create a dev
build downloadable via [this link](https://releases.datepoll.org/common/dfx-helper/dfx-helper-dev.zip).

#### Production builds

Tags create a release build downloadable
via [this link](https://releases.datepoll.org/common/dfx-helper/dfx-helper-latest.zip). Additionally, a versioned
zip is uploaded and the package is published to [npm](https://www.npmjs.com/package/dfx-helper).
