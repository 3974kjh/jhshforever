<script lang="ts">
	import { content } from '$lib/config/content';
	import { reveal } from '$lib/actions/reveal';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';

	const iv = content.interview;
	let open = $state(false);
</script>

<section class="interview" use:reveal>
	<SectionHeading label={iv.label} title={iv.title} />
	<p class="desc">{iv.description}</p>
	<button class="open-btn" onclick={() => (open = true)}>
		<svg
			viewBox="0 0 24 24"
			width="15"
			height="15"
			fill="none"
			stroke="currentColor"
			stroke-width="1.6"
			aria-hidden="true"
		>
			<rect x="3" y="5" width="18" height="14" rx="2" />
			<path d="m3 7 9 6 9-6" />
		</svg>
		{iv.buttonText}
	</button>
</section>

<Modal bind:open title={iv.title}>
	<div class="qa-list">
		{#each iv.items as qa, i (i)}
			<div class="qa">
				<h4 class="question">{qa.question}</h4>
				{#each qa.answers as a, j (j)}
					<div class="answer">
						<p class="speaker">
							{a.speaker}{#if a.tag}<span class="tag">({a.tag})</span>{/if}
						</p>
						<p class="text">{a.text}</p>
					</div>
				{/each}
			</div>
		{/each}
	</div>
</Modal>

<style>
	.interview {
		padding: 3.5rem 1.6rem;
		text-align: center;
		background: var(--color-paper-dim);
	}
	.desc {
		white-space: pre-line;
		color: var(--color-ink-soft);
		font-size: 0.95rem;
		line-height: 1.9;
		margin-bottom: 1.8rem;
	}
	.open-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.85rem 1.4rem;
		border: 1px solid var(--color-line);
		border-radius: 8px;
		background: var(--color-paper);
		color: var(--color-accent);
		font-size: 0.9rem;
		cursor: pointer;
	}
	.qa-list {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	.question {
		font-family: var(--font-serif);
		font-weight: 700;
		font-size: 1rem;
		color: var(--color-ink);
		margin-bottom: 1rem;
	}
	.answer + .answer {
		margin-top: 1rem;
	}
	.speaker {
		font-weight: 700;
		font-size: 0.9rem;
		color: var(--color-accent);
		margin-bottom: 0.35rem;
	}
	.tag {
		font-weight: 400;
		color: var(--color-ink-mute);
		margin-left: 0.3rem;
		font-size: 0.82rem;
	}
	.text {
		color: var(--color-ink-soft);
		font-size: 0.92rem;
		line-height: 1.85;
	}
</style>
