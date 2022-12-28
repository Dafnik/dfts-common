export const cl_copy = (value: string): void => void navigator.clipboard.writeText(value);

export const cl_read = (): Promise<string> => navigator.clipboard.readText();
