import {Unknown0004} from './header-fields';
import {AbstractPayload} from './payload';
import {PayloadHeader} from './header';
import {PayloadField} from './field';
import {PayloadContext} from './base';
import BufferReader from '../buffer-reader';
import BufferWriter from '../buffer-writer';

export class Stage10PublicVpnIpField implements PayloadField<string> {
  public value: string = '';

  public get name(): string {
    return 'Stage10PublicVpnIpField';
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

export class Stage10Payload extends AbstractPayload<Stage10Payload> {
  public header!: PayloadHeader;
  public publicVpnIp: Stage10PublicVpnIpField;

  public static isPayload(o: AbstractPayload<any>): o is Stage10Payload {
    return o.name === 'Stage10Payload';
  }

  public get name(): string {
    return 'Stage10Payload';
  }

  constructor(header?: PayloadHeader) {
    super();
    this.header = header || new PayloadHeader();
    this.publicVpnIp = new Stage10PublicVpnIpField();
    this.addField(this.publicVpnIp);
  }

  checkPacketType(unknown0004: Unknown0004): boolean {
    return unknown0004.value === 0x0c;
  }

  newInstance(header?: PayloadHeader): Stage10Payload {
    return new Stage10Payload(header);
  }
}
