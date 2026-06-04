-- 방명록 테이블
-- Supabase 프로젝트의 SQL Editor 에서 1회 실행하세요.

create table if not exists public.guestbook (
	id uuid primary key default gen_random_uuid(),
	name text not null check (char_length(name) between 1 and 20),
	message text not null check (char_length(message) between 1 and 500),
	password_hash text not null,
	created_at timestamptz not null default now()
);

create index if not exists guestbook_created_at_idx
	on public.guestbook (created_at desc);

-- RLS 활성화
alter table public.guestbook enable row level security;

-- 조회/작성은 공개로 허용. (삭제/수정 정책은 없음 → anon 불가)
-- 실제 삭제는 서버(service-role)가 비밀번호 검증 후 수행하며 RLS 를 우회합니다.
-- 비밀번호 해시(password_hash)는 서버 API 응답에서 제외되므로 클라이언트로 노출되지 않습니다.
drop policy if exists "guestbook_select_public" on public.guestbook;
create policy "guestbook_select_public" on public.guestbook
	for select using (true);

drop policy if exists "guestbook_insert_public" on public.guestbook;
create policy "guestbook_insert_public" on public.guestbook
	for insert with check (true);
