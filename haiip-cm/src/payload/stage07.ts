import {Unknown0004} from './header-fields';
import {AbstractPayload} from './payload';
import {PayloadHeader} from './header';
import {PayloadField} from './field';
import {PayloadContext} from './base';
import BufferReader from '../buffer-reader';
import BufferWriter from '../buffer-writer';

export class Stage07PublicVpnIpField implements PayloadField<string> {
  public value: string = '';

  public get name(): string {
    return 'Stage07PublicVpnIpField';
  }

  decode(ctx: PayloadContext, reader: BufferReader): void {
    const buf: number[] = [];
    buf.push(reader.readUInt8());
    buf.push(reader.readUInt8());
    buf.push(reader.readUInt8());
    buf.push(reader.readUInt8());
    this.value = `${buf[0]}.${buf[1]}.${buf[2]}.${buf[3]}`;
  }

  encode(ctx: PayloadContext, writer: BufferWriter): void {
    const arr = this.value.split('.').map(v => parseInt(v));
    writer.writeUInt8(arr[0]);
    writer.writeUInt8(arr[1]);
    writer.writeUInt8(arr[2]);
    writer.writeUInt8(arr[3]);
  }

  getLength(ctx: PayloadContext): number {
    return 4;
  }
}

export class Stage07Payload extends AbstractPayload<Stage07Payload> {
  public header!: PayloadHeader;
  public publicVpnIp: Stage07PublicVpnIpField = new Stage07PublicVpnIpField();

  public static isPayload(o: AbstractPayload<any>): o is Stage07Payload {
    return o.name === 'Stage07Payload';
  }

  public get name(): string {
    return 'Stage07Payload';
  }

  protected _getHeader(): PayloadHeader {
    return this.header;
  }

  constructor(header?: PayloadHeader) {
    super();
    if (header) {
      this.header = header;
    } else {
      this.header = new PayloadHeader();
      this.fillDefaultHeader();
    }
    this.addField(this.publicVpnIp);
  }

  public fillDefaultHeader() {
    // 03 00 00 00  00 00 00 00
    this.header.unknown0004.value = 0x00000003;
    this.header.unknown0404.value = 0x00000000;
  }

  checkPacketType(unknown0004: Unknown0004): boolean {
    return unknown0004.value === 0x03;
  }

  newInstance(header?: PayloadHeader): Stage07Payload {
    return new Stage07Payload(header);
  }
}
