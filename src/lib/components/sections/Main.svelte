<script lang="ts">
	import { content } from '$lib/config/content';

	let { onShare }: { onShare?: () => void } = $props();
	const m = content.main;
</script>

<section class="hero" style="background-image: url('{m.image}')">
	<div class="scrim"></div>

	<button class="share-btn" aria-label="공유하기" onclick={() => onShare?.()}>
		<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
			<circle cx="5" cy="12" r="2" />
			<circle cx="12" cy="12" r="2" />
			<circle cx="19" cy="12" r="2" />
		</svg>
	</button>

	<div class="hero-content">
		{#if m.badge}
			<span class="badge">{m.badge}</span>
		{/if}
		<div class="names">
			<span class="bar"></span>
			<h1>{m.groom.en} <span class="amp">·</span> {m.bride.en}</h1>
			<span class="bar"></span>
		</div>
		<p class="date">{m.dateText} · {m.subText}</p>
	</div>
</section>

<style>
	.hero {
		position: relative;
		height: 100svh;
		min-height: 560px;
		background-size: cover;
		background-position: center;
		display: flex;
		align-items: flex-end;
		justify-content: center;
	}
	.scrim {
		position: absolute;
		inset: 0;
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 40%, rgba(0, 0, 0, 0.45) 100%);
	}
	.share-btn {
		position: absolute;
		top: 1.1rem;
		right: 1.1rem;
		z-index: 2;
		width: 38px;
		height: 38px;
		display: grid;
		place-items: center;
		border-radius: 999px;
		background: rgba(0, 0, 0, 0.35);
		color: #fff;
		border: none;
		backdrop-filter: blur(4px);
		cursor: pointer;
	}
	.hero-content {
		position: relative;
		z-index: 1;
		text-align: center;
		color: #fff;
		padding-bottom: 3.2rem;
	}
	.badge {
		--badge-bg: rgba(46, 42, 39, 0.78);
		display: inline-block;
		font-family: var(--font-sans);
		font-size: 0.72rem;
		font-weight: 500;
		padding: 0.3rem 0.78rem;
		border-radius: 20px;
		background: var(--badge-bg);
		border: none;
		box-shadow: none;
		filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.18));
		margin-bottom: 1.05rem;
		letter-spacing: 0.06em;
		position: relative;
	}
	.badge::before {
		content: '';
		position: absolute;
		inset: 1px 6px auto;
		height: 42%;
		border-radius: 10px;
		pointer-events: none;
	}
	.badge::after {
		content: '';
		position: absolute;
		left: 50%;
		top: calc(100% - 0.5px);
		transform: translateX(-50%);
		width: 10px;
		height: 6px;
		background: var(--badge-bg);
		clip-path: polygon(50% 100%, 0 0, 100% 0);
	}
	.names {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.9rem;
	}
	.names h1 {
		font-family: var(--font-display);
		font-size: 1.9rem;
		font-weight: 500;
		letter-spacing: 0.06em;
	}
	.amp {
		color: var(--color-accent-soft);
		padding: 0 0.15rem;
	}
	.bar {
		width: 2px;
		height: 26px;
		background: var(--color-accent-soft);
	}
	.date {
		margin-top: 1rem;
		font-family: var(--font-display);
		font-size: 0.92rem;
		letter-spacing: 0.18em;
		opacity: 0.92;
	}
</style>
