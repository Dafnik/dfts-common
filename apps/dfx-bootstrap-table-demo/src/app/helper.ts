export class Helper {
  private static data: EventType[] = [];

  public static getTestData(max: number): EventType[] {
    if (this.data.length > 0) {
      return this.data;
    }
    for (let i = 0; i < max; i++) {
      this.data.push({
        id: i,
        name: 'Event ' + i,
        something_complicated: 'Text',
      });
    }
    return this.data;
  }
}

export type EventType = {
  id: number;
  name: string;
  something_complicated: string;
};
