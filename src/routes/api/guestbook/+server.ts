import { json, error } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { normalizeGuestbookEntries } from '$lib/guestbook/entries';
import { getAdminClient } from '$lib/server/supabase';
import type { RequestHandler } from './$types';

const TABLE = 'guestbook';
const HASH_ROUNDS = 8;
const NO_STORE = { 'Cache-Control': 'no-store' };

function requireAdminClient() {
	const supabase = getAdminClient();
	if (!supabase) throw error(503, '방명록이 아직 설정되지 않았습니다. 관리자에게 문의해주세요.');
	return supabase;
}

// 방명록 목록
export const GET: RequestHandler = async () => {
	const supabase = requireAdminClient();

	const { data, error: dbError } = await supabase
		.from(TABLE)
		.select('id, name, message, created_at')
		.order('created_at', { ascending: false })
		.limit(200);

	if (dbError) {
		console.error('[guestbook][GET] Supabase query failed:', dbError.message);
		throw error(500, '방명록을 불러오지 못했습니다.');
	}
	return json({ entries: normalizeGuestbookEntries(data) }, { headers: NO_STORE });
};

// 방명록 등록
export const POST: RequestHandler = async ({ request }) => {
	const supabase = requireAdminClient();

	const body = await request.json().catch(() => null);
	const name = typeof body?.name === 'string' ? body.name.trim() : '';
	const message = typeof body?.message === 'string' ? body.message.trim() : '';
	const password = typeof body?.password === 'string' ? body.password : '';

	if (!name || name.length >= 10) throw error(400, '이름은 9자 이하로 입력해주세요.');
	if (!message || message.length > 500) throw error(400, '내용을 1~500자로 입력해주세요.');
	if (password.length < 4) throw error(400, '비밀번호를 4자 이상 입력해주세요.');

	const password_hash = await bcrypt.hash(password, HASH_ROUNDS);

	const { data, error: dbError } = await supabase
		.from(TABLE)
		.insert({ name, message, password_hash })
		.select('id, name, message, created_at')
		.single();

	if (dbError) {
		console.error('[guestbook][POST] Supabase insert failed:', dbError.message);
		throw error(500, '방명록 등록에 실패했습니다.');
	}
	return json({ entry: data }, { status: 201, headers: NO_STORE });
};
