export function ToBase64(s: string): string;
export function FromBase64(s: string): string;

declare global {
    interface String {
        byte(): Uint8Array;
    }
}