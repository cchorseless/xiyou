import { CompressionMethodType } from '../types/CompressionMethod';
import { OperatingSystemType } from '../types/OperatingSystem';
import DeflateOptionInterface from './DeflateOptionInterface';

export default interface FileInterface {
  buffer: Uint8Array;
  option: {
    comment: Uint8Array;
    compressionMethod: CompressionMethodType;
    date?: Date;
    extraField: Uint8Array;
    filename: Uint8Array;
    os?: OperatingSystemType;
    password?: Uint8Array;
    deflateOption: DeflateOptionInterface;
  };
  compressed: boolean;
  encrypted: boolean;
  size: number;
  crc32: number;
}
