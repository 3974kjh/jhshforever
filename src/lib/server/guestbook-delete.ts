import { json, error } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { isGuestbookId } from '$lib/guestbook/entries';
import { getAdminClient } from '$lib/server/supabase';

const TABLE = 'guestbook';
const NO_STORE = { 'Cache-Control': 'no-store' };

function requireAdminClient() {
	const supabase = getAdminClient();
	if (!supabase) throw error(503, '방명록이 아직 설정되지 않았습니다. 관리자에게 문의해주세요.');
	return supabase;
}

export async function deleteGuestbookEntryById(id: unknown, password: unknown) {
	const supabase = requireAdminClient();
	const entryId = typeof id === 'string' ? id.trim() : '';
	if (!isGuestbookId(entryId)) throw error(400, '잘못된 요청입니다.');

	const plainPassword = typeof password === 'string' ? password : '';
	if (!plainPassword) throw error(400, '비밀번호를 입력해주세요.');

	const { data: row, error: fetchError } = await supabase
		.from(TABLE)
		.select('id, password_hash')
		.eq('id', entryId)
		.maybeSingle();

	if (fetchError) {
		console.error('[guestbook][DELETE] fetch failed:', fetchError.message);
		throw error(500, '삭제에 실패했습니다.');
	}
	if (!row) throw error(404, '존재하지 않는 글입니다.');

	let passwordOk = false;
	try {
		passwordOk = await bcrypt.compare(plainPassword, row.password_hash);
	} catch (err) {
		console.error('[guestbook][DELETE] bcrypt compare failed:', err);
		throw error(500, '삭제에 실패했습니다.');
	}
	if (!passwordOk) throw error(403, '비밀번호가 일치하지 않습니다.');

	const { error: deleteError, count } = await supabase
		.from(TABLE)
		.delete({ count: 'exact' })
		.eq('id', entryId);

	if (deleteError) {
		console.error('[guestbook][DELETE] delete failed:', deleteError.message);
		throw error(500, '삭제에 실패했습니다.');
	}
	if (count === 0) {
		console.error('[guestbook][DELETE] no rows deleted for id:', entryId);
		throw error(
			500,
			'삭제 권한이 없습니다. SUPABASE_SERVICE_ROLE_KEY 설정을 확인해주세요.'
		);
	}

	return json({ success: true }, { headers: NO_STORE });
}
