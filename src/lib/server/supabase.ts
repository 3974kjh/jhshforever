import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env as publicEnv } from '$env/dynamic/public';
import { env as privateEnv } from '$env/dynamic/private';

// 서버 전용 (service-role) 클라이언트.
// $lib/server 하위에 위치하므로 클라이언트 번들에 포함되지 않습니다.
// 방명록 등록/조회/삭제(비밀번호 검증)에 사용합니다.
export function getAdminClient(): SupabaseClient | null {
	const url = publicEnv.PUBLIC_SUPABASE_URL;
	const serviceKey = privateEnv.SUPABASE_SERVICE_ROLE_KEY;
	if (!url || !serviceKey) return null;
	return createClient(url, serviceKey, {
		auth: { persistSession: false, autoRefreshToken: false }
	});
}
