export interface TokenClientProfile {
  quoteNumber: string;
  date: string;
  clientName: string;
  businessName?: string;
  address: string;
  phone: string;
}

export interface TokenSelections {
  staticMenuPages?: number;
  animatedMenuScreens?: number;
  decalPanels?: number;
  decalDesignCount?: number;
  tvComboSelected?: boolean;
  tvSize?: '55' | '65';
  tvExtraClips?: number;
  basicClips?: number;
  influencerClips?: number;
}

export type QuoteServiceKey = 'menu' | 'tvCombo' | 'basicClip' | 'influencer' | 'decal';

export interface QuotePresetOption {
  label: string;
  priceTag?: string;
  selections: TokenSelections;
}

export interface DecodedQuoteToken {
  profile: TokenClientProfile;
  selections?: TokenSelections;
}

export interface StoredQuotePayload {
  profile: TokenClientProfile;
  selections?: TokenSelections;
  focusNote?: string;
  visibleItems?: QuoteServiceKey[];
  presets?: QuotePresetOption[];
  createdAt?: string;
}

export const ADMIN_SALT = 'TYM-ADMIN-2026';
export const ADMIN_HASH = '1e677285bad2a6edd86b2c23aca1c68063d485358c626680419d30a52003f500';
const TOKEN_KEY = 'TYM-QUOTE-PRIV-2026';

export function isShortQuoteId(value: string | null | undefined): value is string {
  return Boolean(value && /^[a-z0-9_-]{5,24}$/i.test(value));
}

// Pure-JS FIPS 180-4 SHA-256 (works reliably over both HTTPS and local HTTP origins)
const K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

function rotr(n: number, x: number): number {
  return (x >>> n) | (x << (32 - n));
}

export function sha256Hex(input: string): string {
  const bytes = new TextEncoder().encode(input);
  const bitLen = bytes.length * 8;
  const paddedLen = Math.ceil((bytes.length + 9) / 64) * 64;
  const padded = new Uint8Array(paddedLen);
  padded.set(bytes);
  padded[bytes.length] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(paddedLen - 4, bitLen >>> 0, false);
  view.setUint32(paddedLen - 8, Math.floor(bitLen / 0x100000000), false);

  const H = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];
  const W = new Uint32Array(64);

  for (let i = 0; i < paddedLen; i += 64) {
    for (let t = 0; t < 16; t++) {
      W[t] = view.getUint32(i + t * 4, false);
    }
    for (let t = 16; t < 64; t++) {
      const s0 = rotr(7, W[t - 15]) ^ rotr(18, W[t - 15]) ^ (W[t - 15] >>> 3);
      const s1 = rotr(17, W[t - 2]) ^ rotr(19, W[t - 2]) ^ (W[t - 2] >>> 10);
      W[t] = (W[t - 16] + s0 + W[t - 7] + s1) >>> 0;
    }

    let [a, b, c, d, e, f, g, h] = H;
    for (let t = 0; t < 64; t++) {
      const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[t] + W[t]) >>> 0;
      const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    H[0] = (H[0] + a) >>> 0;
    H[1] = (H[1] + b) >>> 0;
    H[2] = (H[2] + c) >>> 0;
    H[3] = (H[3] + d) >>> 0;
    H[4] = (H[4] + e) >>> 0;
    H[5] = (H[5] + f) >>> 0;
    H[6] = (H[6] + g) >>> 0;
    H[7] = (H[7] + h) >>> 0;
  }

  return H.map((x) => x.toString(16).padStart(8, '0')).join('');
}

export function verifyAdminPasscode(passcode: string): boolean {
  return sha256Hex(`${passcode.trim()}:${ADMIN_SALT}`) === ADMIN_HASH;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(str: string): Uint8Array {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '==='.slice((b64.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function obfuscateBytes(data: Uint8Array): Uint8Array {
  const keyBytes = new TextEncoder().encode(TOKEN_KEY);
  const out = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    out[i] = data[i] ^ keyBytes[i % keyBytes.length];
  }
  return out;
}

export function encodeQuoteToken(
  profile: TokenClientProfile,
  selections?: TokenSelections
): string {
  const payload = JSON.stringify({
    p: profile,
    ...(selections ? { s: selections } : {}),
    v: 1
  });
  const encodedPayload = toBase64Url(obfuscateBytes(new TextEncoder().encode(payload)));
  const sig = sha256Hex(`${encodedPayload}:${TOKEN_KEY}`).slice(0, 10);
  return `${encodedPayload}.${sig}`;
}

export function decodeQuoteToken(token: string): DecodedQuoteToken | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [encodedPayload, sig] = parts;
    const expectedSig = sha256Hex(`${encodedPayload}:${TOKEN_KEY}`).slice(0, 10);
    if (sig !== expectedSig) return null;

    const decoded = new TextDecoder().decode(obfuscateBytes(fromBase64Url(encodedPayload)));
    const parsed = JSON.parse(decoded);
    if (!parsed?.p?.clientName || !parsed?.p?.quoteNumber) return null;
    return {
      profile: parsed.p,
      selections: parsed.s
    };
  } catch {
    return null;
  }
}
