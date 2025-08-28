import { MediaType, ResponseObjectMap, SuccessResponse } from 'openapi-typescript-helpers';

export type HttpClientResponse<T extends Record<string | number, any>, Media extends MediaType> = SuccessResponse<
  ResponseObjectMap<T>,
  Media
>;
