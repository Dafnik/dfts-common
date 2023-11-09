import { HttpContextToken } from '@angular/common/http';

export const BASE_URL_INTERCEPTOR = new HttpContextToken(() => false);
export const LOGGING_INTERCEPTOR = new HttpContextToken(() => false);
export const POST_PUT_JSON_CONTENT_TYPE_INTERCEPTOR = new HttpContextToken(() => false);
