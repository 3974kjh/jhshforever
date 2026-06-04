import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';

// 브라우저용 (anon) 클라이언트.
// 환경변수가 없으면 null 을 반환해, 키 미설정 상태에서도 앱이 깨지지 않게 합니다.
const url = env.PUBLIC_SUPABASE_URL;
const anonKey = env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null;
