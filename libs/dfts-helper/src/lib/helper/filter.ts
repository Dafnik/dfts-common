export const notNull = <T>(value: T | null): value is T => value !== null;
export const notNullAndUndefined = <T>(value: T | null | undefined): value is T => value !== null && value !== undefined;
