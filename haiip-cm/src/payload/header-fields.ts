import {PayloadContext} from './base';
import {PayloadField} from './field';
import BufferReader from '../buffer-reader';
import BufferWriter from '../buffer-writer';

export class Unknown0004 implements PayloadField<number> {
  public value: number = 0;

  public get name(): string {
    return 'Unknown0004';
  }

  decode(ctx: PayloadContext, reader: BufferReader): void {
    this.value = reader.readUInt32LE();
  }

  encode(ctx: PayloadContext, writer: BufferWriter): void {
    writer.writeUInt32LE(this.value);
  }

  getLength(ctx: PayloadContext): number {
    return 4;
  }
}

export class Unknown0404 implements PayloadField<number> {
  public value: number = 0;

  public get name(): string {
    return 'Unknown0404';
  }

  decode(ctx: PayloadContext, reader: BufferReader): void {
    this.value = reader.readUInt32LE();
  }

  encode(ctx: PayloadContext, writer: BufferWriter): void {
    writer.writeUInt32LE(this.value);
  }

  getLength(ctx: PayloadContext): number {
    return 4;
  }
}
