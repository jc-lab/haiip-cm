import * as net from 'net';
import * as events from 'events';
import BufferReader from './buffer-reader';
import {
  DefaultPayloadContext,
  PayloadContext,
  PayloadHeader,
  AbstractPayload,
  Stage01Payload,
  Stage02Payload,
  Stage03Payload,
  Stage04Payload,
  Stage05Payload,
  Stage06Payload,
  Stage07Payload,
  Stage08Payload,
  Stage09Payload,
  Stage10Payload
} from './payload';
import BufferWriter from './buffer-writer';
import * as util from 'util';

const PACKET_SIZE_LIMIT = 65536;

export type Supplier<T> = T | (() => T) | (() => Promise<T>);

export interface HaiipConnectOptions {
  serverHost: string;
  username: string;
  localHostname: Supplier<string>;
  tunLocalIp: Supplier<string>;
}

interface HaiipConnectionManagerEvents extends events.EventEmitter {
  on(event: string | symbol, listener: (...args: any[]) => void): this;
}

const payloadHeaderType = new PayloadHeader();
const payloadTypes: AbstractPayload<any>[] = [
  new Stage01Payload(),
  new Stage02Payload(),
  new Stage03Payload(),
  new Stage04Payload(),
  new Stage05Payload(),
  new Stage06Payload(),
  new Stage07Payload(),
  new Stage08Payload(),
  new Stage09Payload(),
  new Stage10Payload(),
];

function getFromSupplier<T>(supplier: Supplier<T>): Promise<T> {
  if (typeof supplier !== 'string' && supplier instanceof Function) {
    return Promise.resolve(supplier());
  } else {
    return Promise.resolve(supplier);
  }
}

export class HaiipConnectionManager extends events.EventEmitter implements HaiipConnectionManagerEvents {
  private _options: HaiipConnectOptions;
  private _socket!: net.Socket;
  private _prevBuffer: Buffer | null = null;
  private _recvRemaining: number = 0;
  private _recvBuffers!: Buffer[];
  private _error: Error | null = null;

  private _publicVpnIp: string = '';

  constructor(options: HaiipConnectOptions) {
    super();
    this._options = options;
    this._connectExchange();
  }

  private _processPacket(buffer: Buffer) {
    const reader = new BufferReader(buffer);
    const ctx: PayloadContext = new DefaultPayloadContext();
    const header = payloadHeaderType.newInstance();
    header.decode(ctx, reader);

    try {
      for (let i = 0; i < payloadTypes.length; i++) {
        const factory = payloadTypes[i];
        if (factory.checkPacketType(header.unknown0004)) {
          const payload = factory.newInstance(header);
          payload.decode(ctx, reader);
          return this._processPayload(payload);
        }
      }
    } catch (e) {
      return Promise.reject(e);
    }

    return Promise.resolve();
  }

  private _sendStage3(): Promise<void> {
    const payload = new Stage03Payload();
    return this._sendPayload(payload);
  }

  private _sendStage567(): Promise<void> {
    const payloadA = new Stage05Payload();
    return this._sendPayload(payloadA)
      .then(() => {
        const payloadB = new Stage06Payload();
        return this._sendPayload(payloadB);
      })
      .then(() => {
        const payloadC = new Stage07Payload();
        payloadC.publicVpnIp.value = this._publicVpnIp;
        return this._sendPayload(payloadC);
      });
  }

  private _processPayload(payload: AbstractPayload<any>): Promise<void> {
    console.log('payload : ', payload);
    if (Stage02Payload.isPayload(payload)) {
      return this._sendStage3();
    } else if (Stage04Payload.isPayload(payload)) {
      this._publicVpnIp = payload.publicVpnIp.value;
      return this._sendStage567();
    }
    return Promise.resolve();
  }

  private _sendPayload(payload: AbstractPayload<any>) {
    const ctx = new DefaultPayloadContext();
    const writer = new BufferWriter();
    writer.writeUInt32LE(0);
    payload.encode(ctx, writer);
    const buffer = writer.build();
    buffer.writeUInt32LE(writer.position, 0);
    console.log('send payload : ', payload, '\n', buffer.toString('hex'));
    return util.promisify(this._socket.write.bind(this._socket))(buffer);
  }

  private _sendStage1() {
    const payload = new Stage01Payload();
    return Promise.all([
      getFromSupplier(this._options.localHostname),
      getFromSupplier(this._options.tunLocalIp)
    ])
      .then(([localHostname, tunInterfaceIp]) => {
        payload.hostname.value = localHostname;
        payload.tunIp.value = tunInterfaceIp;
        payload.username.value = this._options.username;
        this._sendPayload(payload);
      });
  }

  private _connectExchange() {
    const socket = net.connect({
      host: this._options.serverHost,
      port: 10010
    });
    this._socket = socket;
    socket
      .on('error', (e) => {
        this.emit('error', e);
      })
      .on('connect', () => {
        console.log('exchange socket: connected');
        this._sendStage1()
          .catch((e) => this.emit('error', e));
      })
      .on('close', () => {
        console.log('exchange socket: closed');
      })
      .on('data', (cbuf: Buffer) => {
        if (this._error) {
          return ;
        }
        const temp: Buffer[] = [];
        let continueProcess = true;
        if (this._prevBuffer)
          temp.push(this._prevBuffer);
        temp.push(cbuf);
        const reader = new BufferReader(Buffer.concat(temp));
        new Promise<void>((resolve, reject) => {
          const process = () => {
            if (reader.remaining === 0) {
              continueProcess = false;
            }
            const next = () => {
              if (reader.remaining > 0 || continueProcess) {
                process();
              } else {
                resolve();
              }
            };
            if (this._recvRemaining === 0) {
              if (reader.remaining < 4) {
                this._prevBuffer = reader.readRemainingBuffer();
              } else {
                this._recvRemaining = reader.readUInt32LE();
                this._recvBuffers = [];
                if (this._recvRemaining > PACKET_SIZE_LIMIT) {
                  const e = new Error(`Too large payload: size=${this._recvRemaining}`);
                  this._error = e;
                  reject(e);
                  return ;
                }
                this._recvRemaining -= 4;
              }
            } else {
              if (this._recvRemaining > 0) {
                const avail = Math.min(reader.remaining, this._recvRemaining);
                const partial = reader.readBuffer(avail);
                this._recvRemaining -= partial.byteLength;
                this._recvBuffers.push(partial);
                if (this._recvRemaining === 0) {
                  const buf = Buffer.concat(this._recvBuffers);
                  this._recvBuffers = [];
                  console.log('receive : ' + buf.toString('hex'));
                  this._processPacket(buf)
                    .then(() => next())
                    .catch((e) => reject(e));
                  return ;
                }
              }
            }
            next();
          };
          process();
        })
          .then(() => console.log('payload process done'))
          .catch((e) => {
            this._error = e;
            this.emit('error', e);
          });
      });
  }
}
