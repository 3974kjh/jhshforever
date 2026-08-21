<script lang="ts">
	import { onMount } from 'svelte';
	import type { HistoryItem } from '$lib/config/types';

	type Props = {
		items: HistoryItem[];
		stripHint: string;
		/** 이 요소가 뷰포트에서 벗어나면 첫 장으로 리셋 */
		observeRoot?: HTMLElement | null;
	};

	let { items, stripHint, observeRoot = null }: Props = $props();

	let trackEl = $state<HTMLElement | null>(null);
	let cardEls: (HTMLElement | null)[] = [];
	let currentIndex = $state(0);
	let hintVisible = $state(true);
	let reducedMotion = $state(false);
	let sectionInView = $state(true);

	const total = $derived(items.length);

	function hasImage(item: HistoryItem) {
		return Boolean(item.image?.trim());
	}

	function captureCard(node: HTMLElement, index: number) {
		cardEls[index] = node;
		return {
			destroy() {
				if (cardEls[index] === node) cardEls[index] = null;
			}
		};
	}

	function scrollToIndex(index: number, behavior: ScrollBehavior = 'smooth') {
		const track = trackEl;
		const card = cardEls[index];
		if (!track || !card) return;

		const target = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;

		track.scrollTo({
			left: Math.max(0, target),
			behavior: reducedMotion ? 'auto' : behavior
		});
	}

	function syncIndexFromScroll() {
		const track = trackEl;
		if (!track || cardEls.length === 0) return;

		const center = track.scrollLeft + track.clientWidth / 2;
		let best = 0;
		let bestDist = Infinity;

		for (let i = 0; i < cardEls.length; i++) {
			const card = cardEls[i];
			if (!card) continue;
			const mid = card.offsetLeft + card.offsetWidth / 2;
			const dist = Math.abs(mid - center);
			if (dist < bestDist) {
				bestDist = dist;
				best = i;
			}
		}

		if (best !== currentIndex) {
			currentIndex = best;
			if (best > 0) hintVisible = false;
		}
	}

	function goPrev() {
		scrollToIndex(Math.max(0, currentIndex - 1));
	}

	function goNext() {
		scrollToIndex(Math.min(total - 1, currentIndex + 1));
	}

	function resetToFirst() {
		scrollToIndex(0, 'auto');
		currentIndex = 0;
		hintVisible = true;
	}

	function onKey(e: KeyboardEvent) {
		if (!sectionInView || !trackEl) return;
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			goPrev();
		}
		if (e.key === 'ArrowRight') {
			e.preventDefault();
			goNext();
		}
	}

	function onScroll() {
		syncIndexFromScroll();
	}

	onMount(() => {
		reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		syncIndexFromScroll();
	});

	$effect(() => {
		const root = observeRoot;
		if (!root || typeof IntersectionObserver === 'undefined') return;

		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					sectionInView = entry.isIntersecting;
					if (!entry.isIntersecting) resetToFirst();
				}
			},
			{ threshold: 0.08 }
		);
		io.observe(root);
		return () => io.disconnect();
	});
</script>

<svelte:window onkeydown={onKey} />

<div class="strip-shell">
	<div
		class="strip-track"
		bind:this={trackEl}
		onscroll={onScroll}
		role="list"
		aria-label="우리 이야기 폴라로이드"
	>
		{#each items as item, i (item.year + item.title)}
			<article
				class="polaroid"
				class:active={i === currentIndex}
				class:no-photo={!hasImage(item)}
				role="listitem"
				aria-current={i === currentIndex ? 'true' : undefined}
				use:captureCard={i}
			>
				<div class="photo">
					{#if hasImage(item)}
						<img
							src={item.image}
							alt={item.title}
							draggable="false"
							loading={i < 2 ? 'eager' : 'lazy'}
							decoding="async"
						/>
					{/if}
				</div>
				<div class="caption">
					<div class="meta-row">
						<span class="year">{item.year}</span>
						{#if item.date}
							<span class="date">{item.date}</span>
						{/if}
					</div>
					<h4 class="story-title">{item.title}</h4>
					<p class="desc">{item.description}</p>
				</div>
			</article>
		{/each}
	</div>

	<div class="meta">
		{#if hintVisible && currentIndex === 0}
			<p class="hint">{stripHint}</p>
		{/if}
		<p class="count" aria-live="polite">
			{currentIndex + 1} / {total}
		</p>
	</div>

	{#if reducedMotion}
		<div class="nav">
			<button type="button" class="nav-btn" onclick={goPrev} aria-label="이전">‹</button>
			<button type="button" class="nav-btn" onclick={goNext} aria-label="다음">›</button>
		</div>
	{/if}
</div>

<style>
	.strip-shell {
		position: relative;
		width: 100%;
	}

	.strip-track {
		display: flex;
		align-items: center;
		gap: 1rem;
		width: 100%;
		overflow-x: auto;
		overflow-y: hidden;
		scroll-snap-type: x mandatory;
		scroll-behavior: smooth;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		padding: 0.75rem 0 1rem;
		scroll-padding-inline: calc(50% - min(42vw, 9.5rem));
		touch-action: pan-x pan-y;
	}

	.strip-track::-webkit-scrollbar {
		display: none;
	}

	.polaroid {
		flex: 0 0 auto;
		width: min(72vw, 17rem);
		scroll-snap-align: center;
		scroll-snap-stop: always;
		background: #fffcf7;
		padding: 0.65rem 0.65rem 0.85rem;
		box-shadow:
			0 1px 0 rgba(255, 255, 255, 0.8) inset,
			0 10px 28px rgba(44, 42, 40, 0.14),
			0 2px 6px rgba(44, 42, 40, 0.08);
		transform: scale(0.9);
		opacity: 0.55;
		transition:
			transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
			opacity 0.35s ease;
		user-select: none;
	}

	.polaroid:first-child {
		margin-inline-start: calc(50% - min(36vw, 8.5rem));
	}

	.polaroid:last-child {
		margin-inline-end: calc(50% - min(36vw, 8.5rem));
	}

	.polaroid.active {
		transform: scale(1);
		opacity: 1;
		z-index: 1;
	}

	.photo {
		aspect-ratio: 1 / 1.05;
		overflow: hidden;
		background:
			radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.45), transparent 55%),
			linear-gradient(165deg, #f3eee6 0%, #e8dfd0 55%, #dccfb8 100%);
	}

	.polaroid:not(.no-photo) .photo {
		background: var(--color-paper-dim);
	}

	.photo img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		-webkit-user-drag: none;
	}

	.caption {
		padding: 0.7rem 0.2rem 0.15rem;
		text-align: left;
	}

	.meta-row {
		display: flex;
		align-items: baseline;
		gap: 0.45rem;
		margin-bottom: 0.28rem;
	}

	.year {
		font-family: var(--font-display);
		font-size: 1.05rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		color: var(--color-ink);
	}

	.date {
		font-size: 0.7rem;
		letter-spacing: 0.04em;
		color: var(--color-ink-mute);
	}

	.story-title {
		font-family: var(--font-serif);
		font-weight: 700;
		font-size: 0.95rem;
		margin: 0 0 0.35rem;
		line-height: 1.35;
		color: var(--color-ink);
	}

	.desc {
		margin: 0;
		white-space: pre-line;
		font-size: 0.78rem;
		line-height: 1.7;
		color: var(--color-ink-soft);
	}

	.meta {
		margin-top: 0.35rem;
		text-align: center;
		min-height: 2.6rem;
	}

	.hint {
		margin: 0 0 0.35rem;
		font-size: 0.82rem;
		color: var(--color-ink-mute);
		letter-spacing: -0.01em;
	}

	.count {
		margin: 0;
		font-family: var(--font-display);
		font-size: 0.9rem;
		letter-spacing: 0.14em;
		color: var(--color-ink-soft);
	}

	.nav {
		display: flex;
		justify-content: center;
		gap: 0.8rem;
		margin-top: 0.6rem;
	}

	.nav-btn {
		width: 2.4rem;
		height: 2.4rem;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		color: var(--color-ink);
		font-size: 1.4rem;
		line-height: 1;
		cursor: pointer;
		border-radius: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		.strip-track {
			scroll-behavior: auto;
		}

		.polaroid {
			transition: none;
		}
	}
</style>
