<script lang="ts">
	import { content } from '$lib/config/content';
	import { reveal } from '$lib/actions/reveal';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import { fade } from 'svelte/transition';

	const g = content.gallery;

	let visibleCount = $state(g.initialCount);
	const shown = $derived(g.images.slice(0, visibleCount));
	const hasMore = $derived(visibleCount < g.images.length);

	let lightboxIndex = $state<number | null>(null);

	function loadMore() {
		visibleCount = Math.min(visibleCount + g.loadMoreCount, g.images.length);
	}

	function openAt(i: number) {
		lightboxIndex = i;
	}
	function close() {
		lightboxIndex = null;
	}
	function prev() {
		if (lightboxIndex !== null)
			lightboxIndex = (lightboxIndex - 1 + g.images.length) % g.images.length;
	}
	function next() {
		if (lightboxIndex !== null) lightboxIndex = (lightboxIndex + 1) % g.images.length;
	}
	function onKey(e: KeyboardEvent) {
		if (lightboxIndex === null) return;
		if (e.key === 'Escape') close();
		if (e.key === 'ArrowLeft') prev();
		if (e.key === 'ArrowRight') next();
	}
</script>

<svelte:window onkeydown={onKey} />

<section class="gallery" use:reveal>
	<SectionHeading label={g.label} title={g.title} />

	<div class="grid">
		{#each shown as src, i (src)}
			<button class="thumb" onclick={() => openAt(i)} aria-label="사진 {i + 1} 크게 보기">
				<img {src} alt="웨딩 사진 {i + 1}" loading="lazy" />
			</button>
		{/each}
	</div>

	{#if hasMore}
		<button class="more" onclick={loadMore}>
			더보기 <span class="chev">⌄</span>
		</button>
	{/if}
</section>

{#if lightboxIndex !== null}
	<div class="lightbox" transition:fade={{ duration: 180 }}>
		<button class="lb-overlay" aria-label="닫기" onclick={close}></button>
		<button class="lb-nav prev" aria-label="이전" onclick={prev}>‹</button>
		<img class="lb-img" src={g.images[lightboxIndex]} alt="웨딩 사진 {lightboxIndex + 1}" />
		<button class="lb-nav next" aria-label="다음" onclick={next}>›</button>
		<button class="lb-close" aria-label="닫기" onclick={close}>×</button>
		<span class="lb-count">{lightboxIndex + 1} / {g.images.length}</span>
	</div>
{/if}

<style>
	.gallery {
		padding: 3.5rem 1.6rem 4rem;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.4rem;
	}
	.thumb {
		padding: 0;
		border: none;
		cursor: pointer;
		aspect-ratio: 1 / 1;
		overflow: hidden;
		border-radius: 2px;
		background: var(--color-paper-dim);
	}
	.thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.4s ease;
	}
	.thumb:active img {
		transform: scale(1.05);
	}
	.more {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		margin: 1.8rem auto 0;
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

	.lightbox {
		position: fixed;
		inset: 0;
		z-index: 90;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.lb-overlay {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.9);
		border: none;
		cursor: pointer;
	}
	.lb-img {
		position: relative;
		max-width: 92vw;
		max-height: 82vh;
		object-fit: contain;
		border-radius: 4px;
	}
	.lb-nav {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 1;
		width: 44px;
		height: 44px;
		font-size: 2rem;
		color: #fff;
		background: rgba(255, 255, 255, 0.12);
		border: none;
		border-radius: 999px;
		cursor: pointer;
	}
	.lb-nav.prev {
		left: 0.6rem;
	}
	.lb-nav.next {
		right: 0.6rem;
	}
	.lb-close {
		position: absolute;
		top: 1rem;
		right: 1rem;
		z-index: 1;
		font-size: 2rem;
		color: #fff;
		background: none;
		border: none;
		cursor: pointer;
	}
	.lb-count {
		position: absolute;
		bottom: 1.4rem;
		left: 50%;
		transform: translateX(-50%);
		color: rgba(255, 255, 255, 0.85);
		font-family: var(--font-display);
		letter-spacing: 0.1em;
		font-size: 0.9rem;
	}
</style>
