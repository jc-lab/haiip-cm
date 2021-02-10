import {Unknown0004} from './header-fields';
import {AbstractPayload} from './payload';
import {PayloadHeader} from './header';

export class Stage03Payload extends AbstractPayload<Stage03Payload> {
  public header: PayloadHeader;

  public static isPayload(o: AbstractPayload<any>): o is Stage03Payload {
    return o.name === 'Stage03Payload';
  }

  public get name(): string {
    return 'Stage03Payload';
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
    // 02 00 00 00  00 00 00 00
    this.header.unknown0004.value = 0x00000002;
    this.header.unknown0404.value = 0x00000000;
  }

  checkPacketType(unknown0004: Unknown0004): boolean {
    return unknown0004.value === 0x02;
  }

  newInstance(header?: PayloadHeader): Stage03Payload {
    return new Stage03Payload(header);
  }
}
