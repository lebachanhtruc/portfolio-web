import { createHash, randomBytes } from 'node:crypto';
import {
  BlobAccessError,
  BlobNotFoundError,
  BlobPreconditionFailedError,
  BlobStoreNotFoundError,
  del,
  get,
  put
} from '@vercel/blob';

interface TokenClientProfile {
  quoteNumber: string;
  date: string;
  clientName: string;
  businessName?: string;
  address: string;
  phone: string;
}

interface TokenSelections {
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

type QuoteServiceKey = 'menu' | 'tvCombo' | 'basicClip' | 'influencer' | 'decal';

interface QuotePresetOption {
  label: string;
  priceTag?: string;
  selections: TokenSelections;
}

interface StoredQuotePayload {
  profile: TokenClientProfile;
  selections?: TokenSelections;
  focusNote?: string;
  visibleItems?: QuoteServiceKey[];
  presets?: QuotePresetOption[];
  createdAt?: string;
}

const ADMIN_SALT = 'TYM-ADMIN-2026';
const ADMIN_HASH = '1e677285bad2a6edd86b2c23aca1c68063d485358c626680419d30a52003f500';
const SHORT_ID_ALPHABET = '23456789abcdefghjkmnpqrstuvwxyz';
const MAX_REQUEST_BYTES = 16 * 1024;
const ALLOWED_SERVICE_KEYS = new Set<QuoteServiceKey>([
  'menu',
  'tvCombo',
  'basicClip',
  'influencer',
  'decal'
]);

function isShortQuoteId(value: string | null | undefined): value is string {
  return Boolean(value && /^[a-z0-9_-]{5,24}$/i.test(value));
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'private, no-store'
    }
  });
}

function blobPathForId(id: string): string {
  return `quotes/${id.toLowerCase()}.json`;
}

function generateShortId(length = 7): string {
  const bytes = randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i++) {
    out += SHORT_ID_ALPHABET[bytes[i] % SHORT_ID_ALPHABET.length];
  }
  return out;
}

function authorizeAdmin(request: Request): boolean {
  const passcode = request.headers.get('x-admin-passcode');
  if (!passcode || passcode.length > 128) return false;
  const expectedHash = process.env.TYM_ADMIN_PASS_HASH || ADMIN_HASH;
  const digest = createHash('sha256')
    .update(`${passcode.trim()}:${ADMIN_SALT}`)
    .digest('hex');
  return digest === expectedHash;
}

function clampString(val: unknown, maxLen: number): string {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, maxLen);
}

function nonNegInt(val: unknown, max = 500): number {
  const num = Number(val);
  if (!Number.isFinite(num) || num < 0) return 0;
  return Math.min(Math.floor(num), max);
}

function sanitizeSelections(raw: unknown): TokenSelections | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const s = raw as Record<string, unknown>;
  return {
    staticMenuPages: nonNegInt(s.staticMenuPages),
    animatedMenuScreens: nonNegInt(s.animatedMenuScreens),
    decalPanels: nonNegInt(s.decalPanels),
    decalDesignCount: nonNegInt(s.decalDesignCount),
    tvComboSelected: Boolean(s.tvComboSelected),
    tvSize: s.tvSize === '65' ? '65' : '55',
    tvExtraClips: nonNegInt(s.tvExtraClips),
    basicClips: nonNegInt(s.basicClips),
    influencerClips: nonNegInt(s.influencerClips)
  };
}

function sanitizePayload(raw: unknown): StoredQuotePayload | null {
  if (!raw || typeof raw !== 'object') return null;
  const body = raw as Record<string, unknown>;
  const p = (body.profile && typeof body.profile === 'object'
    ? body.profile
    : body) as Record<string, unknown>;

  const clientName = clampString(p.clientName, 120);
  const quoteNumber = clampString(p.quoteNumber, 40) || 'TYM-2611-001';
  if (!clientName) return null;

  const profile: TokenClientProfile = {
    quoteNumber,
    date: clampString(p.date, 30) || new Date().toLocaleDateString('en-GB'),
    clientName,
    businessName: clampString(p.businessName, 120),
    address: clampString(p.address, 240) || 'Québec, Canada',
    phone: clampString(p.phone, 40)
  };

  const selections = sanitizeSelections(body.selections);
  const focusNote = clampString(body.focusNote, 400);

  const visibleItems = Array.isArray(body.visibleItems)
    ? body.visibleItems
        .map((item) => String(item) as QuoteServiceKey)
        .filter((item) => ALLOWED_SERVICE_KEYS.has(item))
        .slice(0, 5)
    : undefined;

  const presets = Array.isArray(body.presets)
    ? body.presets
        .slice(0, 6)
        .map((item): QuotePresetOption | null => {
          if (!item || typeof item !== 'object') return null;
          const rec = item as Record<string, unknown>;
          const label = clampString(rec.label, 120);
          const sel = sanitizeSelections(rec.selections);
          if (!label || !sel) return null;
          const priceTag = clampString(rec.priceTag, 60);
          return { label, ...(priceTag ? { priceTag } : {}), selections: sel };
        })
        .filter((item): item is QuotePresetOption => item !== null)
    : undefined;

  return {
    profile,
    ...(selections ? { selections } : {}),
    ...(focusNote ? { focusNote } : {}),
    ...(visibleItems && visibleItems.length > 0 ? { visibleItems } : {}),
    ...(presets && presets.length > 0 ? { presets } : {}),
    createdAt: clampString(body.createdAt, 40) || new Date().toISOString()
  };
}

function handleBlobError(err: unknown, fallbackMessage: string) {
  if (err instanceof BlobNotFoundError) {
    return jsonResponse({ error: 'Quote not found' }, 404);
  }
  const msg = err instanceof Error ? err.message : String(err);
  if (
    err instanceof BlobAccessError ||
    err instanceof BlobStoreNotFoundError ||
    /No token found|BLOB_READ_WRITE_TOKEN|BLOB_STORE_ID|suspended/i.test(msg)
  ) {
    return jsonResponse({ error: 'Storage is not configured on this deployment' }, 503);
  }
  return jsonResponse({ error: fallbackMessage }, 500);
}

interface ParsedQuoteRequest {
  payload?: StoredQuotePayload;
  requestedId?: string;
  response?: Response;
}

async function parseQuoteRequest(request: Request): Promise<ParsedQuoteRequest> {
  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_REQUEST_BYTES) {
      return { response: jsonResponse({ error: 'Payload too large' }, 413) };
    }
    body = JSON.parse(text);
  } catch {
    return { response: jsonResponse({ error: 'Invalid JSON request body' }, 400) };
  }

  const payload = sanitizePayload(body);
  if (!payload) {
    return { response: jsonResponse({ error: 'Missing required clientName' }, 400) };
  }

  const requestedId =
    body && typeof body === 'object' && 'requestedId' in body
      ? String((body as Record<string, unknown>).requestedId ?? '').trim().toLowerCase()
      : '';

  if (requestedId && !isShortQuoteId(requestedId)) {
    return { response: jsonResponse({ error: 'Invalid requestedId format' }, 400) };
  }

  return { payload, requestedId };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rawId = url.searchParams.get('id')?.trim().toLowerCase() ?? '';
  if (!isShortQuoteId(rawId)) {
    return jsonResponse({ error: 'Invalid quote id' }, 400);
  }

  try {
    const result = await get(blobPathForId(rawId), {
      access: 'private',
      useCache: false
    });
    if (!result || result.statusCode !== 200) {
      return jsonResponse({ error: 'Quote not found' }, 404);
    }
    const quote = (await new Response(result.stream).json()) as StoredQuotePayload;
    return jsonResponse({ id: rawId, quote }, 200);
  } catch (err) {
    return handleBlobError(err, 'Failed to load quote');
  }
}

export async function POST(request: Request) {
  if (!authorizeAdmin(request)) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const parsed = await parseQuoteRequest(request);
  if (parsed.response) return parsed.response;
  if (!parsed.payload) return jsonResponse({ error: 'Invalid quote payload' }, 400);
  const sanitized = parsed.payload;
  const requestedSlug = parsed.requestedId || '';

  try {
    const maxAttempts = requestedSlug ? 1 : 4;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const id = requestedSlug || generateShortId(7);
      try {
        await put(blobPathForId(id), JSON.stringify(sanitized), {
          access: 'private',
          contentType: 'application/json',
          addRandomSuffix: false,
          allowOverwrite: false
        });
        return jsonResponse({ id, quote: sanitized }, 201);
      } catch (err) {
        const msg = err instanceof Error ? err.message : '';
        const isConflict =
          err instanceof BlobPreconditionFailedError || /already exists/i.test(msg);
        if (isConflict && !requestedSlug && attempt < maxAttempts - 1) {
          continue;
        }
        if (isConflict && requestedSlug) {
          return jsonResponse({ error: 'Quote id already exists' }, 409);
        }
        throw err;
      }
    }
    return jsonResponse({ error: 'Failed to allocate unique short id' }, 500);
  } catch (err) {
    return handleBlobError(err, 'Failed to save quote');
  }
}

export async function PUT(request: Request) {
  if (!authorizeAdmin(request)) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const url = new URL(request.url);
  const id = url.searchParams.get('id')?.trim().toLowerCase() ?? '';
  if (!isShortQuoteId(id)) {
    return jsonResponse({ error: 'Invalid quote id' }, 400);
  }

  const parsed = await parseQuoteRequest(request);
  if (parsed.response) return parsed.response;
  if (!parsed.payload) return jsonResponse({ error: 'Invalid quote payload' }, 400);

  try {
    const existing = await get(blobPathForId(id), { access: 'private', useCache: false });
    if (!existing || existing.statusCode !== 200) {
      return jsonResponse({ error: 'Quote not found' }, 404);
    }
    await put(blobPathForId(id), JSON.stringify(parsed.payload), {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true
    });
    return jsonResponse({ id, quote: parsed.payload }, 200);
  } catch (err) {
    return handleBlobError(err, 'Failed to update quote');
  }
}

export async function DELETE(request: Request) {
  if (!authorizeAdmin(request)) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const url = new URL(request.url);
  const id = url.searchParams.get('id')?.trim().toLowerCase() ?? '';
  if (!isShortQuoteId(id)) {
    return jsonResponse({ error: 'Invalid quote id' }, 400);
  }

  try {
    await del(blobPathForId(id));
    return jsonResponse({ deleted: true, id }, 200);
  } catch (err) {
    return handleBlobError(err, 'Failed to delete quote');
  }
}
