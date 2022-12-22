export class Thread {
  /**
   * Sleeps method chain without stopping UI thread
   * @description <i>Usage</i>: <code>await Thread.sleep(ms)</code>
   * @param milliseconds How long the thread "sleeps"
   */
  static async sleep(milliseconds: number): Promise<unknown> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  /**
   * @deprecated
   * <b>!!! WARNING! USE WITH CAUTION ONLY !!!</b>
   * <br/><b>SHOULD NEVER BE USED IN PRODUCTION</b>
   * <br>This method sleeps/blocks the UI thread/browser
   * <br>Use <code>Thread.sleep(ms)</code> for a better alternative.
   * <br>Sleeps browser thread
   * @description <i>Usage</i>: <code>Thread.block(ms)</code>
   * @param milliseconds How long the thread sleeps
   */
  static block(milliseconds: number): void {
    const exit = new Date().getTime() + milliseconds;
    // eslint-disable-next-line no-empty
    while (new Date().getTime() <= exit) {}
  }
}
