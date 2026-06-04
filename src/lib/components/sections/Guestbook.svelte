<script lang="ts">
	import { onMount } from 'svelte';
	import { content } from '$lib/config/content';
	import { reveal } from '$lib/actions/reveal';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import type { GuestbookEntry } from '$lib/types/guestbook';

	const gb = content.guestbook;

	let entries = $state<GuestbookEntry[]>([]);
	let loading = $state(true);
	let submitting = $state(false);
	let formError = $state('');

	let name = $state('');
	let password = $state('');
	let message = $state('');

	let deleteTarget = $state<GuestbookEntry | null>(null);
	let deletePassword = $state('');
	let deleteError = $state('');

	function formatDate(iso: string) {
		const d = new Date(iso);
		return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
	}

	async function load() {
		loading = true;
		try {
			const res = await fetch('/api/guestbook');
			const data = await res.json();
			entries = data.entries ?? [];
		} catch {
			entries = [];
		} finally {
			loading = false;
		}
	}

	onMount(load);

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		formError = '';
		if (!name.trim() || !message.trim() || password.length < 4) {
			formError = '이름, 내용, 비밀번호(4자 이상)를 모두 입력해주세요.';
			return;
		}
		submitting = true;
		try {
			const res = await fetch('/api/guestbook', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ name, message, password })
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				formError = err.message ?? '등록에 실패했습니다.';
				return;
			}
			const data = await res.json();
			entries = [data.entry, ...entries];
			name = '';
			password = '';
			message = '';
		} catch {
			formError = '등록 중 오류가 발생했습니다.';
		} finally {
			submitting = false;
		}
	}

	function askDelete(entry: GuestbookEntry) {
		deleteTarget = entry;
		deletePassword = '';
		deleteError = '';
	}

	async function confirmDelete() {
		if (!deleteTarget) return;
		deleteError = '';
		try {
			const res = await fetch(`/api/guestbook/${deleteTarget.id}`, {
				method: 'DELETE',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ password: deletePassword })
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				deleteError = err.message ?? '삭제에 실패했습니다.';
				return;
			}
			entries = entries.filter((x) => x.id !== deleteTarget?.id);
			deleteTarget = null;
		} catch {
			deleteError = '삭제 중 오류가 발생했습니다.';
		}
	}
</script>

<section class="guestbook" use:reveal>
	<SectionHeading label={gb.label} title={gb.title} />
	{#if gb.description}<p class="desc">{gb.description}</p>{/if}

	<form class="form" onsubmit={submit}>
		<div class="row">
			<input class="input" type="text" placeholder="이름" bind:value={name} maxlength="20" />
			<input
				class="input"
				type="password"
				placeholder="비밀번호"
				bind:value={password}
				maxlength="20"
			/>
		</div>
		<textarea
			class="input area"
			placeholder="축하 메시지를 남겨주세요."
			bind:value={message}
			maxlength="500"
			rows="3"
		></textarea>
		{#if formError}<p class="error">{formError}</p>{/if}
		<button class="submit" type="submit" disabled={submitting}>
			{submitting ? '등록 중...' : '방명록 남기기'}
		</button>
	</form>

	<div class="list">
		{#if loading}
			<p class="empty">불러오는 중...</p>
		{:else if entries.length === 0}
			<p class="empty">첫 번째 축하 메시지를 남겨주세요.</p>
		{:else}
			{#each entries as entry (entry.id)}
				<article class="entry">
					<div class="entry-head">
						<span class="entry-name">{entry.name}</span>
						<span class="entry-date">{formatDate(entry.created_at)}</span>
						<button class="del" aria-label="삭제" onclick={() => askDelete(entry)}>×</button>
					</div>
					<p class="entry-msg">{entry.message}</p>
				</article>
			{/each}
		{/if}
	</div>
</section>

<Modal open={deleteTarget !== null} title="방명록 삭제">
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
			<button class="ghost" onclick={() => (deleteTarget = null)}>취소</button>
			<button class="danger" onclick={confirmDelete}>삭제</button>
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
	.entry {
		padding: 1.1rem 1.2rem;
		border: 1px solid var(--color-line);
		border-radius: 10px;
		background: var(--color-paper-dim);
	}
	.entry-head {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: 0.55rem;
	}
	.entry-name {
		font-weight: 700;
		font-size: 0.9rem;
		color: var(--color-ink);
	}
	.entry-date {
		font-size: 0.78rem;
		color: var(--color-ink-mute);
	}
	.del {
		margin-left: auto;
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
