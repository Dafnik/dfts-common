import { Mode } from './mode';
import { BitBuffer } from './bit-buffer';

export abstract class AbstractData {
  protected constructor(protected mode: Mode) {}

  abstract getLength(): number;

  abstract getBitsLength(): number;

  abstract write(bitBuffer: BitBuffer): void;
}
