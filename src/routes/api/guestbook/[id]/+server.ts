import { error } from '@sveltejs/kit';
import { deleteGuestbookEntryById } from '$lib/server/guestbook-delete';
import type { RequestHandler } from './$types';

async function readPassword(request: Request) {
	const body = await request.json().catch(() => null);
	return body?.password;
}

// DELETE 본문이 중간에서 제거되는 환경이 있어 POST(action=delete)도 지원합니다.
export const DELETE: RequestHandler = async ({ params, request }) =>
	deleteGuestbookEntryById(params.id, await readPassword(request));

export const POST: RequestHandler = async ({ params, request }) => {
	const body = await request.json().catch(() => null);
	if (body?.action !== 'delete') throw error(400, '잘못된 요청입니다.');
	return deleteGuestbookEntryById(params.id, body.password);
};
