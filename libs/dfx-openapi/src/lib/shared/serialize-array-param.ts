import { serializePrimitiveParam } from './serialize-primitive-param';

/**
 * Serialize array param (shallow only)
 * @type {import('./index.js').serializeArrayParam}
 */
export function serializeArrayParam(
  name: string,
  value: unknown[],
  options: {
    style: 'simple' | 'label' | 'matrix' | 'form' | 'spaceDelimited' | 'pipeDelimited';
    explode: boolean;
    allowReserved?: boolean;
  },
): string {
  if (!Array.isArray(value)) {
    return '';
  }

  // explode: false
  if (!options.explode) {
    const joiner =
      // @ts-expect-error JS syntax valid
      {
        form: ',',
        spaceDelimited: '%20',
        pipeDelimited: '|',
      }[options.style] || ','; // note: for arrays, joiners vary wildly based on style + explode behavior

    // @ts-expect-error Type issue
    const final = (options.allowReserved === true ? value : value.map((v) => encodeURIComponent(v))).join(joiner);
    switch (options.style) {
      case 'simple': {
        return final;
      }
      case 'label': {
        return `.${final}`;
      }
      case 'matrix': {
        return `;${name}=${final}`;
      }
      // case "spaceDelimited":
      // case "pipeDelimited":
      default: {
        return `${name}=${final}`;
      }
    }
  }

  // explode: true
  // @ts-expect-error JS syntax valid
  const joiner = { simple: ',', label: '.', matrix: ';' }[options.style] || '&';
  const values = [];
  for (const v of value) {
    if (options.style === 'simple' || options.style === 'label') {
      // @ts-expect-error Type issue
      values.push(options.allowReserved === true ? v : encodeURIComponent(v));
    } else {
      // @ts-expect-error Type issue
      values.push(serializePrimitiveParam(name, v, options));
    }
  }
  return options.style === 'label' || options.style === 'matrix' ? `${joiner}${values.join(joiner)}` : values.join(joiner);
}
