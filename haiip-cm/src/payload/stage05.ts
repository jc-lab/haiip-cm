import {Unknown0004} from './header-fields';
import {AbstractPayload} from './payload';
import {PayloadHeader} from './header';

export class Stage05Payload extends AbstractPayload<Stage05Payload> {
  public header: PayloadHeader = new PayloadHeader();

  public static isPayload(o: AbstractPayload<any>): o is Stage05Payload {
    return o.name === 'Stage05Payload';
  }

  public get name(): string {
    return 'Stage05Payload';
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
  }

  public fillDefaultHeader() {
    // 1b 00 00 00  00 00 00 00
    this.header.unknown0004.value = 0x0000001b;
    this.header.unknown0404.value = 0x00000000;
  }

  checkPacketType(unknown0004: Unknown0004): boolean {
    return unknown0004.value === 0x1b;
  }

  newInstance(header?: PayloadHeader): Stage05Payload {
    return new Stage05Payload(header);
  }
}
