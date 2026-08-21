<script lang="ts">
	import { content } from '$lib/config/content';
	import { reveal } from '$lib/actions/reveal';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import HistoryBook from './HistoryBook.svelte';

	const h = content.history;
	let sectionEl = $state<HTMLElement | null>(null);
</script>

<section class="history" bind:this={sectionEl} use:reveal>
	<div class="heading-block">
		<SectionHeading label={h.label} title={h.title} />
		<p class="period">{h.periodText}</p>
	</div>

	<div class="strip-wrap">
		<HistoryBook items={h.items} stripHint={h.stripHint} observeRoot={sectionEl} />
	</div>
</section>

<style>
	.history {
		padding: 3.5rem 0 4.2rem;
		overflow-x: clip;
	}

	.heading-block {
		margin-bottom: 0.5rem;
		padding-inline: 0.8rem;
	}

	.period {
		text-align: center;
		color: var(--color-ink-mute);
		font-family: var(--font-display);
		letter-spacing: 0.14em;
		font-size: 0.9rem;
		margin-top: -1rem;
		margin-bottom: 1.2rem;
	}

	.strip-wrap {
		position: relative;
		width: 100%;
		max-width: 40rem;
		margin: 0 auto;
	}
</style>
