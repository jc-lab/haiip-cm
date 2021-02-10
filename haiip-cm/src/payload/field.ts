import BufferReader from '../buffer-reader';
import BufferWriter from '../buffer-writer';
import {PayloadContext} from './base';

export interface PayloadField<T> {
  readonly name: string;
  readonly value: T;
  getLength(ctx: PayloadContext): number;
  decode(ctx: PayloadContext, reader: BufferReader): void;
  encode(ctx: PayloadContext, writer: BufferWriter): void;
}
