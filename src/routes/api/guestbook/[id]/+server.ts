import { json, error } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { getAdminClient } from '$lib/server/supabase';
import type { RequestHandler } from './$types';

const TABLE = 'guestbook';

// 방명록 삭제 (비밀번호 검증)
export const DELETE: RequestHandler = async ({ params, request }) => {
	const supabase = getAdminClient();
	if (!supabase) throw error(503, '방명록이 아직 설정되지 않았습니다.');

	const body = await request.json().catch(() => null);
	const password = typeof body?.password === 'string' ? body.password : '';
	if (!password) throw error(400, '비밀번호를 입력해주세요.');

	const { data: row, error: fetchError } = await supabase
		.from(TABLE)
		.select('id, password_hash')
		.eq('id', params.id)
		.single();

	if (fetchError || !row) throw error(404, '존재하지 않는 글입니다.');

	const ok = await bcrypt.compare(password, row.password_hash as string);
	if (!ok) throw error(403, '비밀번호가 일치하지 않습니다.');

	const { error: deleteError } = await supabase.from(TABLE).delete().eq('id', params.id);
	if (deleteError) throw error(500, '삭제에 실패했습니다.');

	return json({ success: true });
};
