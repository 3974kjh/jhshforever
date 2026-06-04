import { json, error } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { getAdminClient } from '$lib/server/supabase';
import type { RequestHandler } from './$types';

const TABLE = 'guestbook';

// 방명록 목록
export const GET: RequestHandler = async () => {
	const supabase = getAdminClient();
	if (!supabase) return json({ entries: [] });

	const { data, error: dbError } = await supabase
		.from(TABLE)
		.select('id, name, message, created_at')
		.order('created_at', { ascending: false })
		.limit(200);

	if (dbError) throw error(500, '방명록을 불러오지 못했습니다.');
	return json({ entries: data ?? [] });
};

// 방명록 등록
export const POST: RequestHandler = async ({ request }) => {
	const supabase = getAdminClient();
	if (!supabase) throw error(503, '방명록이 아직 설정되지 않았습니다.');

	const body = await request.json().catch(() => null);
	const name = typeof body?.name === 'string' ? body.name.trim() : '';
	const message = typeof body?.message === 'string' ? body.message.trim() : '';
	const password = typeof body?.password === 'string' ? body.password : '';

	if (!name || name.length > 20) throw error(400, '이름을 1~20자로 입력해주세요.');
	if (!message || message.length > 500) throw error(400, '내용을 1~500자로 입력해주세요.');
	if (password.length < 4) throw error(400, '비밀번호를 4자 이상 입력해주세요.');

	const password_hash = await bcrypt.hash(password, 10);

	const { data, error: dbError } = await supabase
		.from(TABLE)
		.insert({ name, message, password_hash })
		.select('id, name, message, created_at')
		.single();

	if (dbError) throw error(500, '방명록 등록에 실패했습니다.');
	return json({ entry: data }, { status: 201 });
};
