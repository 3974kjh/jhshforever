<script lang="ts">
	import { content } from '$lib/config/content';
	import { reveal } from '$lib/actions/reveal';
	import { slide } from 'svelte/transition';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';

	const a = content.account;
	let openIndex = $state<number | null>(null);
	let copied = $state<string | null>(null);

	function toggle(i: number) {
		openIndex = openIndex === i ? null : i;
	}

	async function copy(value: string) {
		try {
			await navigator.clipboard.writeText(value);
			copied = value;
			setTimeout(() => (copied = null), 1500);
		} catch {
			copied = null;
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
					<div class="group-body" transition:slide={{ duration: 250 }}>
						{#each group.accounts as acc, j (j)}
							<div class="acc">
								<div class="acc-info">
									{#if acc.role}<p class="role">{acc.role}</p>{/if}
									<p class="bank">{acc.bank} {acc.number}</p>
									<p class="holder">예금주 {acc.holder}</p>
								</div>
								<button class="copy" onclick={() => copy(acc.number)}>
									{copied === acc.number ? '복사됨' : '복사'}
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
		padding: 0.5rem 0.9rem;
		font-size: 0.8rem;
		border: 1px solid var(--color-line);
		border-radius: 6px;
		background: var(--color-paper);
		color: var(--color-accent);
		cursor: pointer;
	}
</style>
