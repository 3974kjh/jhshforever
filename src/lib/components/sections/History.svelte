<script lang="ts">
	import { content } from '$lib/config/content';
	import { reveal } from '$lib/actions/reveal';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';

	const h = content.history;
</script>

<section class="history">
	<div use:reveal>
		<SectionHeading label={h.label} title={h.title} />
		<p class="period">{h.periodText}</p>
	</div>

	<div class="timeline">
		<span class="line" aria-hidden="true"></span>
		{#each h.items as item, i (i)}
			<article class="item" use:reveal>
				<div class="year-row">
					<span class="dot" aria-hidden="true"></span>
					<h3 class="year">{item.year}</h3>
					{#if item.date}<span class="date">{item.date}</span>{/if}
				</div>
				<div class="body">
					{#if item.image}
						<div class="thumb">
							<img src={item.image} alt={item.title} loading="lazy" />
						</div>
					{/if}
					<h4 class="title">{item.title}</h4>
					<p class="text">{item.description}</p>
				</div>
			</article>
		{/each}
	</div>
</section>

<style>
	.history {
		padding: 4rem 1.6rem 3.5rem;
	}
	.period {
		text-align: center;
		color: var(--color-ink-mute);
		font-family: var(--font-display);
		letter-spacing: 0.14em;
		font-size: 0.9rem;
		margin-top: -1rem;
		margin-bottom: 2.5rem;
	}
	.timeline {
		position: relative;
		padding-left: 1.5rem;
	}
	.line {
		position: absolute;
		left: 4px;
		top: 8px;
		bottom: 8px;
		width: 1px;
		background: var(--color-line);
	}
	.item {
		position: relative;
		padding-bottom: 2.6rem;
	}
	.year-row {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		margin-bottom: 1rem;
	}
	.dot {
		position: absolute;
		left: -1.5rem;
		top: 0.55rem;
		width: 9px;
		height: 9px;
		border-radius: 999px;
		background: var(--color-accent);
	}
	.year {
		font-family: var(--font-display);
		font-size: 1.7rem;
		font-weight: 600;
		color: var(--color-ink);
	}
	.date {
		font-size: 0.78rem;
		color: var(--color-ink-mute);
		letter-spacing: 0.05em;
	}
	.thumb {
		border-radius: 4px;
		overflow: hidden;
		margin-bottom: 0.9rem;
		aspect-ratio: 4 / 3;
		background: var(--color-paper-dim);
	}
	.thumb img {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
		object-position: center;
	}
	.title {
		font-family: var(--font-serif);
		font-weight: 700;
		font-size: 1.05rem;
		color: var(--color-ink);
		margin-bottom: 0.55rem;
	}
	.text {
		white-space: pre-line;
		color: var(--color-ink-soft);
		font-size: 0.9rem;
		line-height: 1.85;
	}
</style>
