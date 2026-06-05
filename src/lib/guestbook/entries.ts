import type { GuestbookEntry } from '$lib/types/guestbook';

const UUID_RE =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isGuestbookId(id: unknown): id is string {
	return typeof id === 'string' && UUID_RE.test(id);
}

/** DB에 실제로 있어야 하는 항목만 남깁니다. id 없는/잘못된 항목은 제외합니다. */
export function normalizeGuestbookEntries(rows: unknown): GuestbookEntry[] {
	if (!Array.isArray(rows)) return [];

	const byId = new Map<string, GuestbookEntry>();
	for (const row of rows) {
		if (!row || typeof row !== 'object') continue;
		const entry = row as GuestbookEntry;
		if (!isGuestbookId(entry.id)) continue;
		if (typeof entry.name !== 'string' || typeof entry.message !== 'string') continue;
		if (typeof entry.created_at !== 'string') continue;
		byId.set(entry.id, entry);
	}

	return [...byId.values()];
}
