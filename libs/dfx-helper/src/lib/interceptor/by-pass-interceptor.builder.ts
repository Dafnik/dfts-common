import { HttpContext, HttpContextToken } from '@angular/common/http';

import { IBuilder } from 'dfts-helper';

import { BASE_URL_INTERCEPTOR, LOGGING_INTERCEPTOR, POST_PUT_JSON_CONTENT_TYPE_INTERCEPTOR } from './http-context-token';

export const interceptorByPass = (context?: HttpContext): ByPassInterceptorBuilder => {
  return new ByPassInterceptorBuilder().context(context);
};

export class ByPassInterceptorBuilder implements IBuilder<HttpContext> {
  private tokens: HttpContextToken<boolean>[] = [];
  private _context?: HttpContext;

  static byPassInterceptor(context?: HttpContext): ByPassInterceptorBuilder {
    return interceptorByPass(context);
  }

  baseUrl(): this {
    this.tokens.push(BASE_URL_INTERCEPTOR);
    return this;
  }

  logging(): this {
    this.tokens.push(LOGGING_INTERCEPTOR);
    return this;
  }

  postPutJsonContentType(): this {
    this.tokens.push(POST_PUT_JSON_CONTENT_TYPE_INTERCEPTOR);
    return this;
  }

  custom(token: HttpContextToken<boolean>): this {
    this.tokens.push(token);
    return this;
  }

  context(context?: HttpContext): this {
    this._context = context;
    return this;
  }

  build(): HttpContext {
    this._context = this._context ?? new HttpContext();
    for (const token of this.tokens) {
      this._context.set(token, true);
    }
    return this._context;
  }

  buildAsOptions(): { context: HttpContext } {
    return { context: this.build() };
  }
}
