import BufferReader from '../buffer-reader';
import {Unknown0004} from './header-fields';
import {PayloadField} from './field';
import {AbstractPayload} from './payload';
import {
  PayloadContext
} from './base';
import {PayloadHeader} from './header';
import BufferWriter from '../buffer-writer';

export class Stage01UsernameField implements PayloadField<string> {
  public value: string = '';

  public get name(): string {
    return 'Stage01UsernameField';
  }

  decode(ctx: PayloadContext, reader: BufferReader): void {
    const buf = reader.readBuffer(this.getLength(ctx));
    this.value = buf.toString('utf8').trim();
  }

  encode(ctx: PayloadContext, writer: BufferWriter): void {
    const t1 = Buffer.from(this.value);
    const length = this.getLength(ctx);
    writer.writeBuffer(t1);
    if (t1.byteLength < length) {
      writer.writeBuffer(Buffer.alloc(length - t1.byteLength));
    }
  }

  getLength(ctx: PayloadContext): number {
    return 256;
  }
}
export class Stage01HostnameField implements PayloadField<string> {
  public value: string = '';

  public get name(): string {
    return 'Stage01HostnameField';
  }

  decode(ctx: PayloadContext, reader: BufferReader): void {
    const buf = reader.readBuffer(this.getLength(ctx));
    this.value = buf.toString('utf8').trim();
  }

  encode(ctx: PayloadContext, writer: BufferWriter): void {
    const t1 = Buffer.from(this.value);
    const length = this.getLength(ctx);
    writer.writeBuffer(t1);
    if (t1.byteLength < length) {
      writer.writeBuffer(Buffer.alloc(length - t1.byteLength));
    }
  }

  getLength(ctx: PayloadContext): number {
    return 304;
  }
}
export class Stage01TunIPField implements PayloadField<string> {
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
    this.value = `${buf[0]}.${buf[1]}.${buf[2]}.${buf[3]}`
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

export class Stage01Payload extends AbstractPayload<Stage01Payload> {
  public header: PayloadHeader;
  public username: Stage01UsernameField = new Stage01UsernameField();
  public tunIp: Stage01TunIPField = new Stage01TunIPField();
  public hostname: Stage01HostnameField = new Stage01HostnameField();

  public static isPayload(o: AbstractPayload<any>): o is Stage01Payload {
    return o.name === 'Stage01Payload';
  }

  public get name(): string {
    return 'Stage01Payload';
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
    this.addField(this.username);
    this.addField(this.tunIp);
    this.addField(this.hostname);
  }

  public fillDefaultHeader() {
    // 01 00 00 00  01 00 00 00
    this.header.unknown0004.value = 0x00000001;
    this.header.unknown0404.value = 0x00000001;
  }

  checkPacketType(unknown0004: Unknown0004): boolean {
    return unknown0004.value === 1;
  }

  newInstance(header?: PayloadHeader): Stage01Payload {
    return new Stage01Payload(header);
  }
}
