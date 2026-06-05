<script lang="ts">
	import { content } from '$lib/config/content';
	import { reveal } from '$lib/actions/reveal';
	import { slide } from 'svelte/transition';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';

	const a = content.account;
	let openIndex = $state<number | null>(null);
	let copiedKey = $state<string | null>(null);

	function toggle(i: number) {
		openIndex = openIndex === i ? null : i;
	}

	const SCROLL_EXTRA_PX = 80;

	function scrollExpandedIntoView(node: HTMLElement) {
		const group = node.closest('.group');
		if (!group) return;
		const top =
			window.scrollY + group.getBoundingClientRect().bottom - window.innerHeight + SCROLL_EXTRA_PX;
		window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
	}

	async function copy(buttonKey: string, accountNumber: string) {
		try {
			await navigator.clipboard.writeText(accountNumber);
			copiedKey = buttonKey;
			setTimeout(() => (copiedKey = null), 900);
		} catch {
			copiedKey = null;
		}
	}
</script>

<section class="account" use:reveal>
	<SectionHeading label={a.label} title={a.title} />
	{#if a.description}
		<p class="desc">{a.description}</p>
	{/if}

	<div class="groups">
		{#each a.groups as group, i (i)}
			<div class="group">
				<button class="group-head" onclick={() => toggle(i)} aria-expanded={openIndex === i}>
					<span>{group.label}</span>
					<span class="chevron" class:open={openIndex === i}>⌄</span>
				</button>
				{#if openIndex === i}
					<div
						class="group-body"
						transition:slide={{ duration: 250 }}
						onintroend={(e) => scrollExpandedIntoView(e.currentTarget)}
					>
						{#each group.accounts as acc, j (j)}
							{@const key = `${i}-${j}`}
							<div class="acc">
								<div class="acc-info">
									{#if acc.role}<p class="role">{acc.role}</p>{/if}
									<p class="bank">{acc.bank} {acc.number}</p>
									<p class="holder">예금주 {acc.holder}</p>
								</div>
								<button
									class="copy"
									onclick={() => copy(key, acc.number)}
									aria-label={copiedKey === key ? '계좌번호 복사 완료' : '계좌번호 복사'}
								>
									<span class="copy-inner">
										<span
											class="copy-layer default"
											class:inactive={copiedKey === key}
											aria-hidden={copiedKey === key}
										>
											<svg
												class="copy-icon"
												viewBox="0 0 24 24"
												width="16"
												height="16"
												aria-hidden="true"
											>
												<path
													d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H10V7h9v14z"
													fill="currentColor"
												/>
											</svg>
											<span>복사</span>
										</span>
										<span
											class="copy-layer done"
											class:active={copiedKey === key}
											aria-hidden={copiedKey !== key}
										>
											<svg
												class="copy-icon"
												viewBox="0 0 24 24"
												width="16"
												height="16"
												aria-hidden="true"
											>
												<path
													d="M9.2 16.6 4.9 12.3l1.4-1.4 2.9 2.9 8.5-8.5 1.4 1.4z"
													fill="currentColor"
												/>
											</svg>
										</span>
									</span>
								</button>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</section>

<style>
	.account {
		padding: 3.5rem 1.6rem 4rem;
		background: var(--color-paper-dim);
	}
	.desc {
		white-space: pre-line;
		text-align: center;
		color: var(--color-ink-soft);
		font-size: 0.92rem;
		line-height: 1.85;
		margin-bottom: 2rem;
	}
	.groups {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}
	.group {
		border: 1px solid var(--color-line);
		border-radius: 10px;
		overflow: hidden;
		background: var(--color-paper);
	}
	.group-head {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.1rem 1.3rem;
		background: none;
		border: none;
		cursor: pointer;
		font-size: 0.98rem;
		font-weight: 500;
		color: var(--color-ink);
		font-family: var(--font-serif);
	}
	.chevron {
		transition: transform 0.25s ease;
		color: var(--color-ink-mute);
	}
	.chevron.open {
		transform: rotate(180deg);
	}
	.group-body {
		border-top: 1px solid var(--color-line);
	}
	.acc {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1.3rem;
	}
	.acc + .acc {
		border-top: 1px solid var(--color-line);
	}
	.acc-info .role {
		font-size: 0.8rem;
		color: var(--color-ink-mute);
		margin-bottom: 0.3rem;
	}
	.acc-info .bank {
		font-size: 0.92rem;
		color: var(--color-ink);
	}
	.acc-info .holder {
		font-size: 0.8rem;
		color: var(--color-ink-soft);
		margin-top: 0.25rem;
	}
	.copy {
		flex-shrink: 0;
		width: 4.25rem;
		height: 34px;
		padding: 0;
		font-size: 0.8rem;
		border: 1px solid var(--color-line);
		border-radius: 6px;
		background: var(--color-paper);
		color: var(--color-accent);
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
	.copy-inner {
		display: grid;
		place-items: center;
		width: 100%;
	}
	.copy-layer {
		grid-area: 1 / 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.34rem;
	}
	.copy-layer.default {
		transition: opacity 0.2s ease;
	}
	.copy-layer.default.inactive {
		opacity: 0;
	}
	.copy-layer.done {
		opacity: 0;
	}
	.copy-layer.done.active {
		animation: copyFeedback 0.9s ease forwards;
	}
	.copy-icon {
		flex-shrink: 0;
	}
	@keyframes copyFeedback {
		0% {
			opacity: 0;
		}
		18% {
			opacity: 1;
		}
		82% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.copy-layer.default {
			transition: none;
		}
		.copy-layer.done.active {
			animation: none;
			opacity: 1;
		}
	}
</style>
