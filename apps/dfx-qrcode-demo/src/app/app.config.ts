import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { biCacheInterceptor } from 'dfx-bootstrap-icons';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withInterceptors([biCacheInterceptor]))],
};
