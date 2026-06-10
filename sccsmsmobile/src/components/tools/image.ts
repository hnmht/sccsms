
export type ImageCheckResult =
    | { isImage: true; type: '.gif' | '.jpg' | '.png' }
    | { isImage: false; type: 'none' }

const MAGIC = {
    png: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
    jpegStart: [0xff, 0xd8, 0xff],
    jpegJFIF: [0x4a, 0x46, 0x49, 0x46], // JFIF
    jpegEXIF: [0x45, 0x78, 0x69, 0x66], // Exif
    gif87a: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],
    gif89a: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
} as const;

function matchBytes(
    buf: Uint8Array,
    offset: number,
    magic: readonly number[]
): boolean {
    if (buf.length < offset + magic.length) return false

    for (let i = 0; i < magic.length; i++) {
        if (buf[offset + i] !== magic[i]) {
            return false
        }
    }
    return true
}

export function checkIsImage(buf: Uint8Array | ArrayBuffer | null): ImageCheckResult {
    if (!buf) {
        return { isImage: false, type: 'none' }
    }

    const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf)

    if (bytes.length < 8) {
        return { isImage: false, type: 'none' }
    }

    // GIF: bytes 0–5
    if (
        matchBytes(bytes, 0, MAGIC.gif87a) ||
        matchBytes(bytes, 0, MAGIC.gif89a)
    ) {
        return { isImage: true, type: '.gif' }
    }

    // JPEG: FF D8 FF at start, JFIF / Exif at offset 6
    if (
        matchBytes(bytes, 0, MAGIC.jpegStart) &&
        (matchBytes(bytes, 6, MAGIC.jpegJFIF) ||
            matchBytes(bytes, 6, MAGIC.jpegEXIF))
    ) {
        return { isImage: true, type: '.jpg' }
    }

    // PNG: bytes 0–7
    if (matchBytes(bytes, 0, MAGIC.png)) {
        return { isImage: true, type: '.png' }
    }

    return { isImage: false, type: 'none' }
}


