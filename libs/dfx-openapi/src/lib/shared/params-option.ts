import { RequiredKeysOf } from 'openapi-typescript-helpers';

import { DefaultParamsOption } from './default-params-option';

export type ParamsOption<T> = T extends { parameters: any }
  ? RequiredKeysOf<T['parameters']> extends never
    ? { params?: T['parameters'] }
    : { params: T['parameters'] }
  : DefaultParamsOption;
