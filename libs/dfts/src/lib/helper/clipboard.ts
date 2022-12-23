export class ClipboardHelper {
  /**
   * @deprecated
   */
  static copy = (value: string): void => cl_copy(value);

  /**
   * @deprecated
   */
  static read = (): Promise<string> => cl_read();
}

export const cl_copy = (value: string): void => void navigator.clipboard.writeText(value);

export const cl_read = (): Promise<string> => navigator.clipboard.readText();
