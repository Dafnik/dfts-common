export type QuerySerializer<T> = (
  query: T extends { parameters: any } ? NonNullable<T['parameters']['query']> : Record<string, unknown>,
) => string;
