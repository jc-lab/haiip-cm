import {Unknown0004} from './header-fields';
import {AbstractPayload} from './payload';
import {PayloadHeader} from './header';

export class Stage06Payload extends AbstractPayload<Stage06Payload> {
  public header: PayloadHeader;

  public static isPayload(o: AbstractPayload<any>): o is Stage06Payload {
    return o.name === 'Stage06Payload';
  }

  public get name(): string {
    return 'Stage06Payload';
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
    // 18 00 00 00  00 00 00 00
    this.header.unknown0004.value = 0x00000018;
    this.header.unknown0404.value = 0x00000000;
  }

  checkPacketType(unknown0004: Unknown0004): boolean {
    return unknown0004.value === 0x18;
  }

  newInstance(header?: PayloadHeader): Stage06Payload {
    return new Stage06Payload(header);
  }
}
