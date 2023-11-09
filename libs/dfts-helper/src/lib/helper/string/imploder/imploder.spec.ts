import { ImploderBuilder, s_imploder } from './imploder';

describe('imploder', () => {
  it('imploder', () => {
    const test = ['Apple', 'Bannana', 'Rasberry', 'Pie', 'Ananas', 'Lannanas'];
    expect(s_imploder(test).separator(', ').build()).toBe('Apple, Bannana, Rasberry, Pie, Ananas, Lannanas');
    expect(s_imploder(test).separator(', ').maxLength(40).suffix('...').build()).toBe('Apple, Bannana, Rasberry, Pie, Ananas, L...');
    expect(s_imploder(test).separator(', ').maxLength(40).build()).toBe('Apple, Bannana, Rasberry, Pie, Ananas, L');
    expect(s_imploder(test).separator(', ').maxLength(15).build()).toBe('Apple, Bannana,');
    expect(s_imploder(test).separator(', ').maxLength(15).suffix('BBB').build()).toBe('Apple, Bannana,BBB');
    expect(s_imploder(test).separator(', ').maxLength(15).suffix('...').build()).toBe('Apple, Bannana,...');
    expect(s_imploder(test).separator('; ').build()).toBe('Apple; Bannana; Rasberry; Pie; Ananas; Lannanas');
  });
});

describe('ImploderBuilder', () => {
  it('should create an instance of ImploderBuilder', () => {
    const builder = new ImploderBuilder();
    expect(builder).toBeInstanceOf(ImploderBuilder);
  });

  it('should create an instance of ImploderBuilder using static get method', () => {
    const builder = ImploderBuilder.get();
    expect(builder).toBeInstanceOf(ImploderBuilder);
  });

  it('should set and retrieve the source correctly', () => {
    const source = ['one', 'two', 'three'];
    const builder = new ImploderBuilder().source(source);
    expect(builder.build()).toEqual(source.join(''));
  });

  it('should map source correctly', () => {
    const source = [1, 2, 3];
    const builder = new ImploderBuilder().mappedSource(source, (it) => it.toString());
    expect(builder.build()).toEqual(source.join(''));
  });

  it('should set and retrieve the maxLength correctly', () => {
    const maxLength = 5;
    const builder = new ImploderBuilder().maxLength(maxLength);
    expect(builder.build().length).toBeLessThanOrEqual(maxLength);
  });

  it('should set and retrieve the offset correctly', () => {
    const offset = 2;
    const source = ['one', 'two', 'three'];
    const expected = source.slice(offset).join('');
    const builder = new ImploderBuilder().source(source).offset(offset);
    expect(builder.build()).toEqual(expected);
  });

  it('should set and retrieve the separator correctly', () => {
    const separator = ', ';
    const source = ['one', 'two', 'three'];
    const expected = source.join(separator);
    const builder = new ImploderBuilder().source(source).separator(separator);
    expect(builder.build()).toEqual(expected);
  });

  it('should set and retrieve the suffix correctly', () => {
    const suffix = '...';
    const source = ['one', 'two', 'three'];
    const builder = new ImploderBuilder().source(source).suffix(suffix);
    expect(builder.build()).toEqual(source.join(''));
  });

  it('should set and retrieve the suffix and max length correctly', () => {
    const suffix = '...';
    const source = ['one', 'two', 'three'];
    const builder = new ImploderBuilder().source(source).suffix(suffix).maxLength(10);
    expect(builder.build()).toEqual('onetwothre...');
  });

  it('should handle a null source gracefully', () => {
    const builder = new ImploderBuilder().source(null);
    expect(builder.build()).toEqual('');
  });

  it('should handle undefined values gracefully', () => {
    const builder = new ImploderBuilder();
    expect(builder.build()).toEqual('');
  });
});

describe('s_imploder', () => {
  it('should create an instance of ImploderBuilder using s_imploder', () => {
    const builder = s_imploder();
    expect(builder).toBeInstanceOf(ImploderBuilder);
  });

  it('should create an instance of ImploderBuilder with the provided source using s_imploder', () => {
    const source = ['one', 'two', 'three'];
    const builder = s_imploder(source);
    expect(builder.build()).toEqual(source.join(''));
  });
});

describe('Edge Cases', () => {
  it('should handle a null source gracefully when using s_imploder', () => {
    const builder = s_imploder(null);
    expect(builder.build()).toEqual('');
  });

  it('should handle undefined values gracefully when using s_imploder', () => {
    const builder = s_imploder(undefined);
    expect(builder.build()).toEqual('');
  });

  it('should handle mapping with a null source when using mappedSource', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const builder = new ImploderBuilder().mappedSource(null, (it) => it.toString());
    expect(builder.build()).toEqual('');
  });

  it('should handle mapping without a map function when using mappedSource and numbers', () => {
    const source = [1, 2, 3];
    const builder = new ImploderBuilder().mappedSource(source);
    expect(builder.build()).toEqual(source.join(''));
  });

  it('should handle mapping without a map function when using mappedSource and strings', () => {
    const source = ['1', '2', '3'];
    const builder = new ImploderBuilder().mappedSource(source);
    expect(builder.build()).toEqual(source.join(''));
  });

  it('should handle maxLength exceeding the string length when using maxLength', () => {
    const maxLength = 100;
    const source = ['one', 'two', 'three'];
    const builder = new ImploderBuilder().source(source).maxLength(maxLength);
    expect(builder.build()).toEqual(source.join(''));
  });

  it('should handle a negative offset when using offset', () => {
    const offset = -2;
    const source = ['one', 'two', 'three'];
    const builder = new ImploderBuilder().source(source).offset(offset);
    expect(builder.build()).toEqual('twothree');
  });

  it('should handle a negative offset when using offset and max length', () => {
    const offset = -2;
    const source = ['one', 'two', 'three'];
    const builder = new ImploderBuilder().source(source).offset(offset);
    expect(builder.build()).toEqual('twothree');
  });

  it('should handle null separator when using separator', () => {
    const source = ['one', 'two', 'three'];
    const builder = new ImploderBuilder().source(source).separator(null);
    expect(builder.build()).toEqual(source.join(''));
  });

  it('should handle null suffix when using suffix', () => {
    const source = ['one', 'two', 'three'];
    const builder = new ImploderBuilder().source(source).suffix(null);
    expect(builder.build()).toEqual(source.join(''));
  });

  it('should handle an empty source when using source', () => {
    const source: string[] = [];
    const builder = new ImploderBuilder().source(source);
    expect(builder.build()).toEqual('');
  });

  it('should handle a source with empty strings when using source', () => {
    const source = ['', '', ''];
    const builder = new ImploderBuilder().source(source);
    expect(builder.build()).toEqual('');
  });

  it('should build correctly with maxLength and suffix', () => {
    const source = ['one', 'two', 'three'];
    const maxLength = 5;
    const suffix = '...';
    const builder = new ImploderBuilder().source(source).maxLength(maxLength).suffix(suffix);
    const expected = source.join('').slice(0, maxLength) + suffix;
    expect(builder.build()).toEqual(expected);
  });

  it('should build correctly with offset and separator', () => {
    const source = ['one', 'two', 'three', 'four'];
    const offset = 1;
    const separator = ', ';
    const builder = new ImploderBuilder().source(source).offset(offset).separator(separator);
    const expected = source.slice(offset).join(separator);
    expect(builder.build()).toEqual(expected);
  });

  it('should handle mapping with a custom mapping function when using mappedSource', () => {
    const source = [1, 2, 3];
    const mappingFunction = (it: number) => `Item ${it}`;
    const builder = new ImploderBuilder().mappedSource(source, mappingFunction);
    const expected = source.map(mappingFunction).join('');
    expect(builder.build()).toEqual(expected);
  });

  it('should handle mapping with a custom mapping function and maxLength when using mappedSource', () => {
    const source = [1, 2, 3];
    const mappingFunction = (it: number) => `Item ${it}`;
    const maxLength = 5;
    const builder = new ImploderBuilder().mappedSource(source, mappingFunction).maxLength(maxLength);
    const expected = source.map(mappingFunction).join('').slice(0, maxLength);
    expect(builder.build()).toEqual(expected);
  });
});
