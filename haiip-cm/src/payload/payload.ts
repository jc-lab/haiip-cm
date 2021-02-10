import BufferReader from '../buffer-reader';
import BufferWriter from '../buffer-writer';
import {Unknown0004} from './header-fields';
import {PayloadContext} from './base';
import {PayloadField} from './field';

export abstract class AbstractPayload<T extends AbstractPayload<any>> {
  protected _fields: PayloadField<any>[];

  constructor() {
    this._fields = [];
  }

  public abstract get name(): string;

  protected addField(field: PayloadField<any>) {
    this._fields.push(field);
  }

  public abstract newInstance(header?: PayloadHeader): AbstractPayload<T>;

  public abstract checkPacketType(unknown0004: Unknown0004): boolean;

  protected decodeFixedFields(ctx: PayloadContext, reader: BufferReader): void {
    for (let i=0; i < this._fields.length; i++) {
      const field = this._fields[i];
      field.decode(ctx, reader);
    }
  }

  protected encodeFixedFields(ctx: PayloadContext, writer: BufferWriter): void {
    for (let i=0; i < this._fields.length; i++) {
      const field = this._fields[i];
      field.encode(ctx, writer);
    }
  }

  public decode(ctx: PayloadContext, reader: BufferReader): void {
    return this.decodeFixedFields(ctx, reader);
  }
  public encode(ctx: PayloadContext, writer: BufferWriter): void {
    const header = this._getHeader();
    if (header) {
      header.encode(ctx, writer);
    }
    return this.encodeFixedFields(ctx, writer);
  }

  protected _getHeader(): AbstractPayload<any> | null {
    return null;
  }
}

import {PayloadHeader} from './header';
