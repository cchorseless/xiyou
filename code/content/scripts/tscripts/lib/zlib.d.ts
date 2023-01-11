export function CompressZlib(s: string, config?: { level: number, strategy?: "fixed" | "huffman_only" | "dynamic" }): string;
export function DecompressZlib(s: string): string;
export function CompressDeflate(s: string, config?: { level: number, strategy?: "fixed" | "huffman_only" | "dynamic" }): string;
export function DecompressDeflate(s: string): string;