import {s_imploder} from './imploder';

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
