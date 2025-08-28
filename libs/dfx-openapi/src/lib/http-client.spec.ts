/* eslint-disable @typescript-eslint/no-unused-vars */
// noinspection JSUnusedLocalSymbols
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { OpenAPIHttpClient, createOpenAPIHttpClient } from './http-client';
import { paths } from './test-api-path.spec';

describe('OpenAPIHttpClient type tests', () => {
  let api: OpenAPIHttpClient<paths>;
  beforeEach(() => {
    void TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    }).compileComponents();

    api = createOpenAPIHttpClient<paths>(TestBed.inject(HttpClient), {
      baseUrl: 'http://localhost',
    });
  });

  it('check get type with query params', () => {
    api
      .request('get', '/v1/team', {
        params: {
          query: {
            page: 1,
            size: 1,
            sort: ['name', 'desc'],
          },
        },
      })
      .subscribe((response) => {
        const numberOfItems = response.numberOfItems;
        const numberOfPages = response.numberOfPages;
      });
    api
      .get('/v1/team', {
        params: {
          query: {
            page: 1,
            size: 1,
            sort: ['name', 'desc'],
          },
        },
      })
      .subscribe((response) => {
        const numberOfItems = response.numberOfItems;
        const numberOfPages = response.numberOfPages;
      });

    expect(true).toBeTruthy();
  });

  it('check get single type with path param', () => {
    api
      .get('/v1/team/{id}', {
        params: {
          path: {
            id: 'test',
          },
        },
      })
      .subscribe((response) => {
        const id = response.id;
        const name = response.name;
      });

    expect(true).toBeTruthy();
  });

  it('check post', () => {
    api
      .post('/v1/team', {
        body: {
          name: 'test',
        },
      })
      .subscribe((response) => {
        const id = response.id;
        const name = response.name;
      });

    expect(true).toBeTruthy();
  });

  it('check put', () => {
    api
      .put('/v1/team', {
        body: {
          id: '1234',
          name: 'test',
        },
      })
      .subscribe((response) => {
        const id = response.id;
        const name = response.name;
      });

    expect(true).toBeTruthy();
  });

  it('check delete', () => {
    api.delete('/v1/team/{id}', {
      params: {
        path: {
          id: 'test',
        },
      },
    });

    expect(true).toBeTruthy();
  });
});
