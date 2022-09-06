import { CompressionMethodType } from '../types/CompressionMethod';
import DeflateOptionInterface from './DeflateOptionInterface';

export default interface ZipOptionInterface {
  filename: Uint8Array;
  extraField: Uint8Array;
  compressionMethod: CompressionMethodType;
  compress?: boolean;
  comment: Uint8Array;
  deflateOption: DeflateOptionInterface;
  password?: Uint8Array;
  verify?: boolean;
}
