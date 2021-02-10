import {Unknown0004} from './header-fields';
import {AbstractPayload} from './payload';
import {PayloadHeader} from './header';
import {PayloadField} from './field';
import {PayloadContext} from './base';
import BufferReader from '../buffer-reader';

export class Stage04PublicVpnIpField implements PayloadField<string> {
  public value: string = '';

  public get name(): string {
    return 'Stage01TunIPField';
  }

  decode(ctx: PayloadContext, reader: BufferReader): void {
    const buf: number[] = [];
    buf.push(reader.readUInt8());
    buf.push(reader.readUInt8());
    buf.push(reader.readUInt8());
    buf.push(reader.readUInt8());
    this.value = `${buf[0]}.${buf[1]}.${buf[2]}.${buf[3]}`;
  }

  encode(ctx: PayloadContext): Buffer {
    const arr = this.value.split('.').map(v => parseInt(v));
    return Buffer.from([arr[0], arr[1], arr[2], arr[3]]);
  }

  getLength(ctx: PayloadContext): number {
    return 4;
  }
}

export class Stage04Payload extends AbstractPayload<Stage04Payload> {
  public header!: PayloadHeader;
  public publicVpnIp: Stage04PublicVpnIpField;

  public static isPayload(o: AbstractPayload<any>): o is Stage04Payload {
    return o.name === 'Stage04Payload';
  }

  public get name(): string {
    return 'Stage04Payload';
  }

  protected _getHeader(): PayloadHeader {
    return this.header;
  }

  constructor(header?: PayloadHeader) {
    super();
    this.header = header || new PayloadHeader();
    this.publicVpnIp = new Stage04PublicVpnIpField();
    this.addField(this.publicVpnIp);
  }

  checkPacketType(unknown0004: Unknown0004): boolean {
    return unknown0004.value === 0x0a;
  }

  newInstance(header?: PayloadHeader): Stage04Payload {
    return new Stage04Payload(header);
  }
}
