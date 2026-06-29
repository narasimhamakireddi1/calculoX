/**
 * Generates public/favicon.ico from public/favicon.png.
 * Modern ICO format embeds PNG data directly (Windows Vista+, all browsers).
 * Zero external dependencies — pure Node.js Buffer manipulation.
 *
 * Run: node scripts/generate-favicon-ico.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pngPath = path.join(__dirname, '../public/favicon.png');
const icoPath = path.join(__dirname, '../public/favicon.ico');

if (!fs.existsSync(pngPath)) {
  console.error('favicon.png not found at', pngPath);
  process.exit(1);
}

const png = fs.readFileSync(pngPath);

// Read width/height from PNG IHDR chunk (bytes 16–23, big-endian uint32)
const width  = png.readUInt32BE(16);
const height = png.readUInt32BE(20);
// ICO uses 0 to mean 256; values > 256 are unsupported
const w = width  >= 256 ? 0 : width;
const h = height >= 256 ? 0 : height;

// ICONDIR — 6 bytes
const dir = Buffer.alloc(6);
dir.writeUInt16LE(0, 0); // reserved
dir.writeUInt16LE(1, 2); // type = 1 (ICO)
dir.writeUInt16LE(1, 4); // image count = 1

// ICONDIRENTRY — 16 bytes
const entry = Buffer.alloc(16);
entry.writeUInt8(w, 0);                  // width
entry.writeUInt8(h, 1);                  // height
entry.writeUInt8(0, 2);                  // color count (0 = trucolor)
entry.writeUInt8(0, 3);                  // reserved
entry.writeUInt16LE(1,  4);              // color planes
entry.writeUInt16LE(32, 6);             // bits per pixel
entry.writeUInt32LE(png.length, 8);      // byte size of PNG data
entry.writeUInt32LE(22, 12);             // offset = 6 (dir) + 16 (entry)

fs.writeFileSync(icoPath, Buffer.concat([dir, entry, png]));
console.log(`favicon.ico created — ${width}x${height}px — public/favicon.ico`);
