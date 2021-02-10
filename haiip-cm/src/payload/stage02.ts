import {Unknown0004} from './header-fields';
import {AbstractPayload} from './payload';
import {PayloadHeader} from './header';

export class Stage02Payload extends AbstractPayload<Stage02Payload> {
  public header!: PayloadHeader;

  public static isPayload(o: AbstractPayload<any>): o is Stage02Payload {
    return o.name === 'Stage02Payload';
  }

  public get name(): string {
    return 'Stage02Payload';
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
    }
  }

  checkPacketType(unknown0004: Unknown0004): boolean {
    return unknown0004.value === 0x07;
  }

  newInstance(header?: PayloadHeader): Stage02Payload {
    return new Stage02Payload(header);
  }
}
