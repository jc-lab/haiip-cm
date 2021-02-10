import {Unknown0004} from './header-fields';
import {AbstractPayload} from './payload';
import {PayloadHeader} from './header';

export class Stage08Payload extends AbstractPayload<Stage08Payload> {
  public header!: PayloadHeader;

  public static isPayload(o: AbstractPayload<any>): o is Stage08Payload {
    return o.name === 'Stage08Payload';
  }

  public get name(): string {
    return 'Stage08Payload';
  }

  protected _getHeader(): PayloadHeader {
    return this.header;
  }

  constructor(header?: PayloadHeader) {
    super();
    this.header = header || new PayloadHeader();
  }

  checkPacketType(unknown0004: Unknown0004): boolean {
    return unknown0004.value === 0x1c;
  }

  newInstance(header?: PayloadHeader): Stage08Payload {
    return new Stage08Payload(header);
  }
}
