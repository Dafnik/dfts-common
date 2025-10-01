/* eslint-disable @typescript-eslint/no-unused-vars */
// noinspection JSUnusedLocalSymbols
import { provideHttpClient } from '@angular/common/http';
import { Injector, computed, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { OpenAPIResource, createOpenAPIResource } from './resource-client';
import { paths } from './test-api-path.spec';

describe('OpenAPIResource type tests', () => {
  let api: OpenAPIResource<paths>;
  beforeEach(() => {
    void TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    }).compileComponents();

    api = createOpenAPIResource<paths>(
      {
        baseUrl: 'http://localhost',
      },
      TestBed.inject(Injector),
    );
  });

  it('check get type with query params', () => {
    let response = api.request(
      'get',
      () => '/v1/team',
      () => ({
        params: {
          query: {
            page: 1,
            size: 1,
            sort: ['name', 'desc'],
          },
        },
      }),
    );
    response.hasValue();
    response.error();
    response.isLoading();
    let numberOfItems = response.value()?.numberOfItems;
    let numberOfPages = response.value()?.numberOfPages;

    const page = signal(1);

    response = api.get(
      computed(() => '/v1/team'),
      computed(() => ({
        params: {
          query: {
            page: page(),
            size: 1,
            sort: ['name', 'desc'],
          },
        },
      })),
    );

    response.hasValue();
    response.error();
    response.isLoading();
    numberOfItems = response.value()?.numberOfItems;
    numberOfPages = response.value()?.numberOfPages;

    expect(true).toBeTruthy();
  });
});
