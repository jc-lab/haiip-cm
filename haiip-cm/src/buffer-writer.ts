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

const BLOCK_SIZE = 1024;

function alignedSize(size: number): number {
  let newSize = size;
  const a = size % BLOCK_SIZE;
  if (a) {
    newSize += BLOCK_SIZE - a;
  }
  return newSize;
}

export default class BufferWriter {
  private _buffer: Buffer;
  private _position: number;

  constructor() {
    this._buffer = Buffer.alloc(1024);
    this._position = 0;
  }

  public buffer(): Buffer {
    return this._buffer;
  }

  get position() {
    return this._position;
  }

  /**
   * increase buffer and position
   *
   * @param size size to increment
   * @return old position
   */
  private _checkAndIncrease(size: number): number {
    const position = this._position;
    const needSize = position + size;
    if (this._buffer.byteLength < needSize) {
      const newSize = alignedSize(needSize);
      const newBuffer = Buffer.alloc(newSize);
      this._buffer.copy(newBuffer, 0, position);
      this._buffer = newBuffer;
    }
    this._position = needSize;
    return position;
  }

  writeUInt8(value: number): this {
    const position = this._checkAndIncrease(1);
    this._buffer.writeUInt8(value, position);
    return this;
  }

  writeUInt16LE(value: number): this {
    const position = this._checkAndIncrease(2);
    this._buffer.writeUInt16LE(value, position);
    return this;
  }

  writeUInt16BE(value: number): this {
    const position = this._checkAndIncrease(1);
    this._buffer.writeUInt16BE(value, position);
    return this;
  }

  writeUInt32LE(value: number): this {
    const position = this._checkAndIncrease(4);
    this._buffer.writeUInt32LE(value, position);
    return this;
  }

  writeUInt32BE(value: number): this {
    const position = this._checkAndIncrease(4);
    this._buffer.writeUInt32BE(value, position);
    return this;
  }

  writeInt8(value: number): this {
    const position = this._checkAndIncrease(1);
    this._buffer.writeInt8(value, position);
    return this;
  }

  writeInt16LE(value: number): this {
    const position = this._checkAndIncrease(2);
    this._buffer.writeInt16LE(value);
    return this;
  }

  writeInt16BE(value: number): this {
    const position = this._checkAndIncrease(2);
    this._buffer.writeInt16BE(value, position);
    return this;
  }

  writeInt32LE(value: number): this {
    const position = this._checkAndIncrease(4);
    this._buffer.writeInt32LE(value, position);
    return this;
  }

  writeInt32BE(value: number): this {
    const position = this._checkAndIncrease(4);
    this._buffer.writeInt32BE(value, position);
    return this;
  }

  writeBuffer(buffer: Buffer, offset?: number, length?: number): this {
    const _offset: number = offset || 0;
    const _length: number = (typeof length === 'undefined') ? buffer.byteLength : length;
    const position = this._checkAndIncrease(_length);
    buffer.copy(this._buffer, position, _offset, _length);
    return this;
  }

  public build(): Buffer {
    return this._buffer.slice(0, this._position);
  }
}
