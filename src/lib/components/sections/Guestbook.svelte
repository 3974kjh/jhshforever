<script lang="ts">
	import { onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import { content } from '$lib/config/content';
	import { reveal } from '$lib/actions/reveal';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { normalizeGuestbookEntries } from '$lib/guestbook/entries';
	import type { GuestbookEntry } from '$lib/types/guestbook';

	const gb = content.guestbook;

	let entries = $state<GuestbookEntry[]>([]);
	let visibleCount = $state(gb.initialCount);
	const visibleEntries = $derived(entries.slice(0, visibleCount));
	const hasMore = $derived(entries.length > visibleCount);
	let loading = $state(true);
	let submitting = $state(false);
	let formError = $state('');
	let listError = $state('');

	let name = $state('');
	let password = $state('');
	let message = $state('');

	let deleteModalOpen = $state(false);
	let deleteTarget = $state<GuestbookEntry | null>(null);
	let deletePassword = $state('');
	let deleteError = $state('');
	let deleting = $state(false);

	$effect(() => {
		if (!deleteModalOpen && deleteTarget !== null && !deleting) {
			deleteTarget = null;
			deletePassword = '';
			deleteError = '';
		}
	});

	const entryIn = { y: -20, duration: 280, easing: cubicOut };
	const entryOut = { y: -28, duration: 260, easing: cubicOut, opacity: 0 };

	const FORM_VALIDATION_ERROR = '이름, 내용, 비밀번호(4자 이상)를 모두 입력해주세요.';

	function dismissValidationError() {
		if (formError === FORM_VALIDATION_ERROR) formError = '';
	}

	function onFormFocusOut(e: FocusEvent) {
		const form = e.currentTarget as HTMLElement;
		const next = e.relatedTarget as Node | null;
		if (!next || !form.contains(next)) dismissValidationError();
	}

	const DEFAULT_ERRORS: Record<number, string> = {
		400: '입력값을 확인해주세요.',
		403: '비밀번호가 일치하지 않습니다.',
		404: '대상을 찾을 수 없습니다.',
		500: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
		503: '방명록이 아직 설정되지 않았습니다. 관리자에게 문의해주세요.'
	};

	async function getErrorMessage(res: Response, fallback: string) {
		const asJson = await res.json().catch(() => null);
		if (typeof asJson?.message === 'string' && asJson.message) return asJson.message;
		return DEFAULT_ERRORS[res.status] ?? fallback;
	}

	function guestbookUrl(path: string) {
		const sep = path.includes('?') ? '&' : '?';
		return `${path}${sep}_=${Date.now()}`;
	}

	async function guestbookFetch(path: string, init?: RequestInit) {
		const method = init?.method?.toUpperCase() ?? 'GET';
		const url = method === 'GET' ? guestbookUrl(path) : path;
		return fetch(url, {
			...init,
			cache: 'no-store',
			headers: {
				'Cache-Control': 'no-cache',
				Pragma: 'no-cache',
				...init?.headers
			}
		});
	}

	function formatDate(iso: string) {
		const d = new Date(iso);
		return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
	}

	function loadMore() {
		visibleCount = Math.min(visibleCount + gb.loadMoreCount, entries.length);
	}

	async function load() {
		loading = true;
		listError = '';
		try {
			const res = await guestbookFetch('/api/guestbook');
			if (!res.ok) {
				listError = await getErrorMessage(res, '방명록을 불러오지 못했습니다.');
				entries = [];
				visibleCount = gb.initialCount;
				return;
			}
			const data = await res.json();
			entries = normalizeGuestbookEntries(data.entries);
			visibleCount = gb.initialCount;
		} catch {
			listError = '방명록을 불러오는 중 오류가 발생했습니다.';
			entries = [];
			visibleCount = gb.initialCount;
		} finally {
			loading = false;
		}
	}

	onMount(load);

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		formError = '';
		if (!name.trim() || !message.trim() || password.length < 4) {
			formError = FORM_VALIDATION_ERROR;
			return;
		}
		submitting = true;
		try {
			const res = await guestbookFetch('/api/guestbook', {
				method: 'POST',
				headers: { 'content-type': 'application/json', accept: 'application/json' },
				body: JSON.stringify({ name, message, password })
			});
			if (!res.ok) {
				formError = await getErrorMessage(res, '등록에 실패했습니다.');
				return;
			}
			const data = await res.json();
			const [added] = normalizeGuestbookEntries([data.entry]);
			if (added) {
				entries = [added, ...entries.filter((e) => e.id !== added.id)];
			}
			name = '';
			password = '';
			message = '';
		} catch {
			formError = '등록 중 오류가 발생했습니다.';
		} finally {
			submitting = false;
		}
	}

	function closeDeleteModal() {
		deleteModalOpen = false;
		deleteTarget = null;
		deletePassword = '';
		deleteError = '';
		deleting = false;
	}

	function askDelete(entry: GuestbookEntry) {
		deleting = false;
		deletePassword = '';
		deleteError = '';
		deleteTarget = entry;
		deleteModalOpen = true;
	}

	async function confirmDelete() {
		if (!deleteTarget) return;
		if (deleting) return;

		deleteError = '';
		const targetId = deleteTarget.id;
		deleting = true;

		try {
			const res = await guestbookFetch(`/api/guestbook/${encodeURIComponent(targetId)}`, {
				method: 'POST',
				headers: { 'content-type': 'application/json', accept: 'application/json' },
				body: JSON.stringify({ action: 'delete', password: deletePassword })
			});

			if (!res.ok) {
				deleteError = await getErrorMessage(res, '삭제에 실패했습니다.');
				if (res.status === 404) {
					entries = entries.filter((x) => x.id !== targetId);
				}
				return;
			}

			closeDeleteModal();
			entries = entries.filter((x) => x.id !== targetId);
		} catch {
			deleteError = '삭제 중 오류가 발생했습니다.';
		} finally {
			deleting = false;
		}
	}
</script>

<section class="guestbook" use:reveal>
	<SectionHeading label={gb.label} title={gb.title} />
	{#if gb.description}<p class="desc">{gb.description}</p>{/if}

	<form class="form" onsubmit={submit} onfocusout={onFormFocusOut}>
		<div class="row">
			<input
				class="input"
				type="text"
				placeholder="이름"
				bind:value={name}
				maxlength="9"
				onfocus={dismissValidationError}
			/>
			<input
				class="input"
				type="password"
				placeholder="비밀번호"
				bind:value={password}
				maxlength="20"
				onfocus={dismissValidationError}
			/>
		</div>
		<textarea
			class="input area"
			placeholder="축하 메시지를 남겨주세요."
			bind:value={message}
			maxlength="500"
			rows="3"
			onfocus={dismissValidationError}
		></textarea>
		{#if formError}<p class="error">{formError}</p>{/if}
		<button class="submit" type="submit" disabled={submitting}>
			{submitting ? '등록 중...' : '방명록 남기기'}
		</button>
	</form>

	<div class="list">
		{#if listError}
			<p class="error list-error">{listError}</p>
		{/if}
		{#if loading && entries.length === 0}
			<p class="empty">불러오는 중...</p>
		{:else if entries.length === 0}
			<p class="empty" in:fade={{ duration: 220 }}>첫 번째 축하 메시지를 남겨주세요.</p>
		{/if}
		{#each visibleEntries as entry (entry.id)}
			<article class="entry" in:fly={entryIn} out:fly={entryOut}>
				<div class="entry-head">
					<span class="entry-name">{entry.name}</span>
					<div class="entry-meta">
						<span class="entry-date">{formatDate(entry.created_at)}</span>
						<button type="button" class="del" aria-label="삭제" onclick={() => askDelete(entry)}>
							×
						</button>
					</div>
				</div>
				<p class="entry-msg">{entry.message}</p>
			</article>
		{/each}
		{#if hasMore}
			<button type="button" class="more" onclick={loadMore}>
				더보기 <span class="chev">⌄</span>
			</button>
		{/if}
	</div>
</section>

<Modal bind:open={deleteModalOpen} title="방명록 삭제">
	<div class="delete-modal">
		<p>작성 시 입력한 비밀번호를 입력해주세요.</p>
		<input
			class="input"
			type="password"
			placeholder="비밀번호"
			bind:value={deletePassword}
			maxlength="20"
		/>
		{#if deleteError}<p class="error">{deleteError}</p>{/if}
		<div class="delete-actions">
			<button type="button" class="ghost" onclick={closeDeleteModal} disabled={deleting}>
				취소
			</button>
			<button type="button" class="danger" onclick={confirmDelete} disabled={deleting}>
				{deleting ? '삭제 중...' : '삭제'}
			</button>
		</div>
	</div>
</Modal>

<style>
	.guestbook {
		padding: 3.5rem 1.6rem 4rem;
	}
	.desc {
		text-align: center;
		color: var(--color-ink-soft);
		font-size: 0.92rem;
		margin-bottom: 2rem;
	}
	.form {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		margin-bottom: 2.4rem;
	}
	.row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.6rem;
	}
	.input {
		width: 100%;
		padding: 0.8rem 0.9rem;
		border: 1px solid var(--color-line);
		border-radius: 8px;
		background: #fff;
		font-size: 0.9rem;
		color: var(--color-ink);
		font-family: inherit;
	}
	.input:focus {
		outline: none;
		border-color: var(--color-accent-soft);
	}
	.area {
		resize: none;
	}
	.submit {
		padding: 0.9rem;
		border: none;
		border-radius: 8px;
		background: var(--color-accent);
		color: #fff;
		font-size: 0.92rem;
		cursor: pointer;
	}
	.submit:disabled {
		opacity: 0.6;
	}
	.error {
		color: var(--color-point);
		font-size: 0.82rem;
	}
	.list {
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
	}
	.empty {
		text-align: center;
		color: var(--color-ink-mute);
		font-size: 0.9rem;
		padding: 2rem 0;
	}
	.list-error {
		text-align: center;
		margin-bottom: 0.8rem;
	}
	.more {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		margin: 0.9rem auto 0;
		padding: 0.7rem 1.4rem;
		background: none;
		border: none;
		color: var(--color-ink-soft);
		font-size: 0.92rem;
		cursor: pointer;
	}
	.chev {
		color: var(--color-ink-mute);
	}
	.entry {
		padding: 1.1rem 1.2rem;
		border: 1px solid var(--color-line);
		border-radius: 10px;
		background: var(--color-paper-dim);
		transform-origin: center top;
	}
	.entry-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		margin-bottom: 0.55rem;
	}
	.entry-name {
		flex: 1;
		min-width: 0;
		font-weight: 700;
		font-size: 0.9rem;
		color: var(--color-ink);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.entry-meta {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		flex-shrink: 0;
	}
	.entry-date {
		font-size: 0.78rem;
		color: var(--color-ink-mute);
		white-space: nowrap;
	}
	.del {
		font-size: 1.2rem;
		line-height: 1;
		color: var(--color-ink-mute);
		background: none;
		border: none;
		cursor: pointer;
	}
	.entry-msg {
		font-size: 0.9rem;
		color: var(--color-ink-soft);
		line-height: 1.7;
		white-space: pre-line;
		word-break: break-word;
	}
	.delete-modal {
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
		font-size: 0.9rem;
		color: var(--color-ink-soft);
	}
	.delete-actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.6rem;
		margin-top: 0.4rem;
	}
	.ghost,
	.danger {
		padding: 0.8rem;
		border-radius: 8px;
		font-size: 0.9rem;
		cursor: pointer;
		border: 1px solid var(--color-line);
	}
	.ghost {
		background: var(--color-paper);
		color: var(--color-ink-soft);
	}
	.danger {
		background: var(--color-point);
		color: #fff;
		border-color: var(--color-point);
	}
</style>
