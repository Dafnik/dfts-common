import { HttpHeaders } from '@angular/common/http';

import { ParamsOption } from './params-option';
import { QuerySerializer } from './query-serializer';
import { QuerySerializerOptions } from './query-serializer-options';
import { RequestBodyOption } from './request-body-option';

export type RequestOptions<T> = ParamsOption<T> &
  RequestBodyOption<T> & {
    baseUrl?: string;
    headers?: HttpHeaders;
    querySerializer?: QuerySerializer<unknown> | QuerySerializerOptions;
  };
