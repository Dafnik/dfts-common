describe('test-api-path placeholder', () => {
  it('placeholder', () => {
    expect(true).toBeTruthy();
  });
});

export interface paths {
  '/v1/team': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Get all teams, if global admin return all teams, else user specific teams
     * @description <b>Required auth:</b> ROLE_ADMIN | TEAM_MEMBER
     */
    get: operations['getAll_1'];
    /**
     * Update team
     * @description <b>Required auth:</b> ROLE_ADMIN | TEAM_ADMIN
     */
    put: operations['update_1'];
    /**
     * Add team
     * @description <b>Required auth:</b> ROLE_ADMIN
     */
    post: operations['create_1'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/team/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Get team
     * @description <b>Required auth:</b> ROLE_ADMIN | TEAM_MEMBER
     */
    get: operations['get_1'];
    put?: never;
    post?: never;
    /**
     * Delete team
     * @description <b>Required auth:</b> ROLE_ADMIN | TEAM_ADMIN
     */
    delete: operations['delete_1'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
type webhooks = Record<string, never>;
interface components {
  schemas: {
    IdResponse: {
      id: string;
    };
    UpdateTeamDto: {
      id: string;
      name: string;
    };
    TeamResponse: {
      id: string;
      name: string;
      /** Format: date-time */
      deleted?: string;
    };
    CreateTeamDto: {
      name: string;
    };
    PaginatedResponseTeamResponse: {
      /** Format: int64 */
      numberOfItems: number;
      /** Format: int32 */
      numberOfPages: number;
      data: components['schemas']['TeamResponse'][];
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
type $defs = Record<string, never>;
interface operations {
  getAll_1: {
    parameters: {
      query?: {
        /** @description Zero-based page index (0..N) */
        page?: number;
        /** @description The size of the page to be returned */
        size?: number;
        /** @description Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. */
        sort?: string[];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          '*/*': components['schemas']['PaginatedResponseTeamResponse'];
        };
      };
    };
  };
  update_1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['UpdateTeamDto'];
      };
    };
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          '*/*': components['schemas']['TeamResponse'];
        };
      };
    };
  };
  create_1: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['CreateTeamDto'];
      };
    };
    responses: {
      /** @description Created */
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          '*/*': components['schemas']['TeamResponse'];
        };
      };
    };
  };
  get_1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          '*/*': components['schemas']['TeamResponse'];
        };
      };
    };
  };
  delete_1: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
}
