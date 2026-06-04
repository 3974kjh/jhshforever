<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	let {
		open = $bindable(false),
		title = '',
		children
	}: { open?: boolean; title?: string; children?: Snippet } = $props();

	function close() {
		open = false;
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}

	$effect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = '';
			};
		}
	});
</script>

<svelte:window onkeydown={onKey} />

{#if open}
	<div class="modal-root" role="presentation">
		<button
			class="modal-overlay"
			aria-label="닫기"
			transition:fade={{ duration: 200 }}
			onclick={close}
		></button>

		<div
			class="modal-panel"
			role="dialog"
			aria-modal="true"
			aria-label={title}
			transition:fly={{ y: 400, duration: 320 }}
		>
			<header class="modal-header">
				<h3>{title}</h3>
				<button class="modal-close" aria-label="닫기" onclick={close}>×</button>
			</header>
			<div class="modal-body">
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-root {
		position: fixed;
		inset: 0;
		z-index: 80;
		display: flex;
		justify-content: center;
		align-items: flex-end;
	}
	.modal-overlay {
		position: absolute;
		inset: 0;
		background: rgba(20, 18, 16, 0.55);
		border: none;
		cursor: pointer;
	}
	.modal-panel {
		position: relative;
		width: 100%;
		max-width: 460px;
		max-height: 88vh;
		display: flex;
		flex-direction: column;
		background: var(--color-paper);
		border-radius: 20px 20px 0 0;
	}
	.modal-header {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.25rem 1rem;
		border-bottom: 1px solid var(--color-line);
	}
	.modal-header h3 {
		font-family: var(--font-serif);
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--color-ink);
	}
	.modal-close {
		position: absolute;
		right: 0.9rem;
		top: 50%;
		transform: translateY(-50%);
		font-size: 1.6rem;
		line-height: 1;
		color: var(--color-ink-soft);
		background: none;
		border: none;
		cursor: pointer;
	}
	.modal-body {
		overflow-y: auto;
		padding: 1.5rem 1.4rem 2.5rem;
		-webkit-overflow-scrolling: touch;
	}
</style>
