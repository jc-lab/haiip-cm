import {Unknown0004} from './header-fields';
import {AbstractPayload} from './payload';
import {PayloadHeader} from './header';

export class Stage09Payload extends AbstractPayload<Stage09Payload> {
  public header!: PayloadHeader;

  public static isPayload(o: AbstractPayload<any>): o is Stage09Payload {
    return o.name === 'Stage09Payload';
  }

  public get name(): string {
    return 'Stage09Payload';
  }

  protected _getHeader(): PayloadHeader {
    return this.header;
  }

  constructor(header?: PayloadHeader) {
    super();
    this.header = header || new PayloadHeader();
  }

  checkPacketType(unknown0004: Unknown0004): boolean {
    return unknown0004.value === 0x19;
  }

  newInstance(header?: PayloadHeader): Stage09Payload {
    return new Stage09Payload(header);
  }
}
