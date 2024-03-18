import { DfxCutPipe } from './pipes';

describe('Test', () => {
  const cutPipe = new DfxCutPipe();
  it('placeholder test', () => {
    expect(cutPipe.transform('test', 2)).toBe('te...');
  });
});
