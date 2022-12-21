export class ClipboardHelper {
  /**
   * @deprecated
   */
  static copy = (value: string, legacyCopy: boolean = false): void => clipboardCopy(value);

  /**
   * @deprecated
   */
  static read = (): Promise<string> => clipboardRead();
}

export const clipboardCopy = (value: string): void => void navigator.clipboard.writeText(value);

export const clipboardRead = (): Promise<string> => navigator.clipboard.readText();
