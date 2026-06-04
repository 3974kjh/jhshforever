<script lang="ts">
	import { content } from '$lib/config/content';
	import { reveal } from '$lib/actions/reveal';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';

	const inv = content.invitation;
</script>

<section class="invitation" use:reveal>
	<SectionHeading label={inv.label} title={inv.title} />

	<div class="message">
		{#each inv.messageLines as line, i (i)}
			{#if line === ''}
				<span class="gap"></span>
			{:else}
				<p>{line}</p>
			{/if}
		{/each}
		{#if inv.attribution}
			<p class="attribution">{inv.attribution}</p>
		{/if}
	</div>

	{#if inv.image}
		<div class="photo">
			<img src={inv.image} alt="신랑신부" loading="lazy" />
		</div>
	{/if}

	<div class="family">
		<p>
			<span class="parents">{inv.groomSide.father} · {inv.groomSide.mother}</span>
			의 {inv.groomSide.relation}
			<span class="child">{inv.groomSide.name}</span>
		</p>
		<p>
			<span class="parents">{inv.brideSide.father} · {inv.brideSide.mother}</span>
			의 {inv.brideSide.relation}
			<span class="child">{inv.brideSide.name}</span>
		</p>
	</div>

	{#if inv.contactPhone}
		<a class="contact" href="tel:{inv.contactPhone}">
			<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
				<path
					d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.2 2.2z"
				/>
			</svg>
			연락하기
		</a>
	{/if}
</section>

<style>
	.invitation {
		padding: 4rem 1.6rem 3.5rem;
	}
	.message {
		text-align: center;
		color: var(--color-ink-soft);
		font-size: 0.96rem;
		line-height: 2.1;
		letter-spacing: 0.01em;
	}
	.gap {
		display: block;
		height: 1.1rem;
	}
	.attribution {
		margin-top: 1.6rem;
		font-size: 0.82rem;
		color: var(--color-ink-mute);
	}
	.photo {
		margin: 2.4rem 0;
		border-radius: 4px;
		overflow: hidden;
	}
	.photo img {
		width: 100%;
		display: block;
	}
	.family {
		text-align: center;
		color: var(--color-ink);
		font-size: 0.98rem;
		line-height: 2.4;
	}
	.family .parents {
		color: var(--color-ink-soft);
	}
	.family .child {
		font-weight: 700;
		font-family: var(--font-serif);
	}
	.contact {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		margin: 2rem auto 0;
		max-width: 260px;
		padding: 0.9rem;
		border: 1px solid var(--color-line);
		border-radius: 8px;
		color: var(--color-accent);
		font-size: 0.92rem;
		background: #fff;
	}
</style>
