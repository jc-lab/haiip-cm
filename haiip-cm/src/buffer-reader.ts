/*! *****************************************************************************
Copyright (c) JC-Lab. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

type AfterReadHandler = (bytes: number) => void;

export interface IOptions {
  buffer: Buffer;
  offset?: number;
  limit?: number;
  afterReadHandler?: (bytes: number) => void;
}

export default class BufferReader {
  private _buffer: Buffer;
  private _offset: number;
  private _limit: number;
  private _afterReadHandler?: AfterReadHandler;

  constructor(buffer: Buffer | IOptions, offset?: number, limit?: number) {
    if (Buffer.isBuffer(buffer)) {
      this._buffer = buffer;
      this._offset = offset || 0;
      this._limit = limit || buffer.length;
      this._afterReadHandler = undefined;
    } else {
      this._buffer = buffer.buffer;
      this._offset = buffer.offset || 0;
      this._limit = buffer.limit || buffer.buffer.length;
      this._afterReadHandler = buffer.afterReadHandler;
    }
  }

  readUIntLE(byteLength: number): number {
    const out = this._buffer.readUIntLE(this._offset, byteLength);
    this._offset += byteLength;
    if (this._afterReadHandler) this._afterReadHandler(byteLength);
    return out;
  }

  readUIntBE(byteLength: number): number {
    const out = this._buffer.readUIntBE(this._offset, byteLength);
    this._offset += byteLength;
    if (this._afterReadHandler) this._afterReadHandler(byteLength);
    return out;
  }

  readIntLE(byteLength: number): number {
    const out = this._buffer.readIntLE(this._offset, byteLength);
    this._offset += byteLength;
    if (this._afterReadHandler) this._afterReadHandler(byteLength);
    return out;
  }

  readIntBE(byteLength: number): number {
    const out = this._buffer.readIntBE(this._offset, byteLength);
    this._offset += byteLength;
    if (this._afterReadHandler) this._afterReadHandler(byteLength);
    return out;
  }

  readUInt8(noAssert?: boolean): number {
    return this.readUIntLE(1);
  }

  readUInt16LE(noAssert?: boolean): number {
    return this.readUIntLE(2);
  }

  readUInt16BE(noAssert?: boolean): number {
    return this.readUIntBE(2);
  }

  readUInt32LE(noAssert?: boolean): number {
    return this.readUIntLE(4);
  }

  readUInt32BE(noAssert?: boolean): number {
    return this.readUIntBE(4);
  }

  readInt8(noAssert?: boolean): number {
    return this.readIntLE(1);
  }

  readInt16LE(noAssert?: boolean): number {
    return this.readIntLE(2);
  }

  readInt16BE(noAssert?: boolean): number {
    return this.readIntBE(4);
  }

  readInt32LE(noAssert?: boolean): number {
    return this.readIntLE(4);
  }

  readInt32BE(noAssert?: boolean): number {
    return this.readIntBE(4);
  }

  readFloatLE(noAssert?: boolean): number {
    const out = this._buffer.readFloatLE(this._offset);
    this._offset += 4;
    if (this._afterReadHandler) this._afterReadHandler(4);
    return out;
  }

  readFloatBE(noAssert?: boolean): number {
    const out = this._buffer.readFloatBE(this._offset);
    this._offset += 4;
    if (this._afterReadHandler) this._afterReadHandler(4);
    return out;
  }

  readDoubleLE(noAssert?: boolean): number {
    const out = this._buffer.readDoubleLE(this._offset);
    this._offset += 8;
    if (this._afterReadHandler) this._afterReadHandler(8);
    return out;
  }

  readDoubleBE(noAssert?: boolean): number {
    const out = this._buffer.readDoubleBE(this._offset);
    this._offset += 8;
    if (this._afterReadHandler) this._afterReadHandler(8);
    return out;
  }

  readBuffer(byteLength: number): Buffer {
    const dest = this._buffer.subarray(this.offset, this.offset + byteLength);
    this._offset += dest.length;
    if (this._afterReadHandler) this._afterReadHandler(dest.length);
    return dest;
  }

  readString(): { out: string, complete: boolean } {
    let ch = 1;
    let out = '';
    let complete = false;
    let count = 0;
    while (this.remaining > 0) {
      ch = this._buffer.readUInt8(this._offset++);
      count++;
      if (ch) {
        out += String.fromCharCode(ch);
      } else {
        complete = true;
        break;
      }
    }
    if (this._afterReadHandler) this._afterReadHandler(count);
    return { out, complete };
  }

  get offset() {
    return this._offset;
  }

  increaseOffset(length: number) {
    this._offset += length;
  }

  get remaining() {
    return this._limit - this._offset;
  }

  readBufferTo(buffer: Buffer | number[], length: number) {
    if (Buffer.isBuffer(buffer)) {
      this._buffer.copy(buffer, 0, this._offset, this._offset + length);
    } else {
      buffer.push(...this._buffer.subarray(this._offset, this._offset + length).toJSON().data);
    }
    if (this._afterReadHandler) this._afterReadHandler(length);
    this._offset += length;
  }

  readRemainingBuffer(): Buffer {
    const dest = this._buffer.subarray(this._offset, this._limit);
    this._offset += dest.length;
    if (this._afterReadHandler) this._afterReadHandler(dest.length);
    return dest;
  }

  get footerSize() {
    return this._buffer.length - this._limit;
  }

  getFooterBuffer(): Buffer {
    return this._buffer.subarray(this._limit, this._buffer.length);
  }
}
