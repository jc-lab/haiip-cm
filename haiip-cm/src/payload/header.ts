import {
  PayloadContext,
} from './base';
import BufferReader from '../buffer-reader';
import BufferWriter from '../buffer-writer';

import {
  Unknown0004,
  Unknown0404
} from './header-fields';
import {AbstractPayload} from './payload';

export class PayloadHeader extends AbstractPayload<PayloadHeader> {
  public unknown0004: Unknown0004 = new Unknown0004();
  public unknown0404: Unknown0404 = new Unknown0404();

  public get name(): string {
    return 'PayloadHeader';
  }

  constructor() {
    super();
    this.addField(this.unknown0004);
    this.addField(this.unknown0404);
  }

  newInstance(header?: PayloadHeader): PayloadHeader {
    return new PayloadHeader();
  }

  checkPacketType(unknown0004: Unknown0004): boolean {
    // Not unused
    return true;
  }

  decode(ctx: PayloadContext, reader: BufferReader): void {
    this.decodeFixedFields(ctx, reader);
  }

  encode(ctx: PayloadContext, writer: BufferWriter): void {
    this.encodeFixedFields(ctx, writer);
  }
}
