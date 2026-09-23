<script lang="ts">
	import { content } from '$lib/config/content';
	import { reveal } from '$lib/actions/reveal';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import { fade } from 'svelte/transition';
	import { untrack } from 'svelte';

	const g = content.gallery;

	let visibleCount = $state(g.initialCount);
	const shown = $derived(g.images.slice(0, visibleCount));
	const hasMore = $derived(visibleCount < g.images.length);

	let lightboxIndex = $state<number | null>(null);
	let viewIndex = $state(0);
	let trackEl = $state<HTMLDivElement | null>(null);
	let trackReady = $state(false);
	let fullReady = $state<Record<string, boolean>>({});

	function loadMore() {
		visibleCount = Math.min(visibleCount + g.loadMoreCount, g.images.length);
	}

	function scrollTarget(track: HTMLElement, slide: HTMLElement) {
		return Math.max(0, slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2);
	}
	function placeOpen(node: HTMLElement) {
		const index = lightboxIndex ?? 0;
		const slide = node.querySelectorAll<HTMLElement>('.lb-slide')[index];
		if (slide && slide.offsetWidth > 0) {
			node.scrollTo({ left: scrollTarget(node, slide), behavior: 'instant' });
		}
		trackReady = true;
		return {
			destroy() {
				trackReady = false;
			}
		};
	}
	function scrollToIndex(index: number, behavior: ScrollBehavior = 'smooth') {
		const track = trackEl;
		const slide = track?.querySelectorAll<HTMLElement>('.lb-slide')[index];
		if (!track || !slide) return;
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		track.scrollTo({
			left: scrollTarget(track, slide),
			behavior: reduced ? 'instant' : behavior
		});
	}
	function windowIndices(index: number) {
		const start = Math.max(0, index - 2);
		const end = Math.min(g.images.length - 1, index + 2);
		const indices: number[] = [];
		for (let i = start; i <= end; i++) indices.push(i);
		return indices;
	}
	const decoding = new Map<string, Promise<void>>();
	function decodeFull(src: string) {
		if (fullReady[src]) return Promise.resolve();
		const pending = decoding.get(src);
		if (pending) return pending;
		const task = new Promise<void>((resolve) => {
			const img = new Image();
			let settled = false;
			const finish = () => {
				if (settled) return;
				settled = true;
				fullReady[src] = true;
				decoding.delete(src);
				resolve();
			};
			const fail = () => {
				if (settled) return;
				settled = true;
				decoding.delete(src);
				resolve();
			};
			img.onload = () => {
				if (typeof img.decode === 'function') void img.decode().then(finish, finish);
				else finish();
			};
			img.onerror = fail;
			img.src = src;
			if (img.complete) {
				if (img.naturalWidth > 0) img.onload(new Event('load'));
				else fail();
			}
		});
		decoding.set(src, task);
		return task;
	}
	const PREFETCH_LIMIT = 3;
	let prefetchGen = 0;
	function prefetchFrom(index: number) {
		const gen = ++prefetchGen;
		const priority = new Set(windowIndices(index));
		const run = async () => {
			await Promise.all([...priority].map((i) => decodeFull(g.images[i].full)));
			if (gen !== prefetchGen || lightboxIndex === null) return;
			const rest = g.images
				.map((_, i) => i)
				.filter((i) => !priority.has(i))
				.sort((a, b) => Math.abs(a - index) - Math.abs(b - index));
			let cursor = 0;
			const worker = async () => {
				while (cursor < rest.length) {
					if (gen !== prefetchGen || lightboxIndex === null) return;
					const i = rest[cursor++];
					await decodeFull(g.images[i].full);
				}
			};
			const workers = Math.min(PREFETCH_LIMIT, rest.length);
			await Promise.all(Array.from({ length: workers }, () => worker()));
		};
		return run();
	}
	function wantsFull(index: number) {
		return Math.abs(index - viewIndex) <= 2;
	}
	const windowReady = $derived.by(() => {
		if (lightboxIndex === null) return false;
		return windowIndices(lightboxIndex).every((index) => fullReady[g.images[index].full]);
	});
	function syncIndexFromScroll() {
		const track = trackEl;
		if (!track || !trackReady) return;
		const center = track.scrollLeft + track.clientWidth / 2;
		const slides = track.querySelectorAll<HTMLElement>('.lb-slide');
		let best = 0;
		let bestDist = Infinity;
		for (let i = 0; i < slides.length; i++) {
			const slide = slides[i];
			const mid = slide.offsetLeft + slide.offsetWidth / 2;
			const dist = Math.abs(mid - center);
			if (dist < bestDist) {
				bestDist = dist;
				best = i;
			}
		}
		viewIndex = best;
	}
	function openAt(i: number) {
		viewIndex = i;
		lightboxIndex = i;
	}
	function close() {
		prefetchGen += 1;
		lightboxIndex = null;
	}
	function goTo(index: number) {
		const next = Math.max(0, Math.min(g.images.length - 1, index));
		if (!windowReady || lightboxIndex === null || next === viewIndex) return;
		scrollToIndex(next);
	}
	function goPrev() {
		void goTo(viewIndex - 1);
	}
	function goNext() {
		void goTo(viewIndex + 1);
	}
	function onKey(e: KeyboardEvent) {
		if (lightboxIndex === null) return;
		if (e.key === 'Escape') close();
		if (!windowReady) return;
		if (e.key === 'ArrowLeft') goPrev();
		if (e.key === 'ArrowRight') goNext();
	}

	function imageAlt(i: number, item: (typeof g.images)[number]) {
		return item.alt ?? `웨딩 사진 ${i + 1}`;
	}

	function watchFull(node: HTMLImageElement, src: string) {
		const show = () => {
			if (!fullReady[src]) fullReady[src] = true;
		};
		if (node.complete && node.naturalWidth > 0) show();
		node.addEventListener('load', show);
		return {
			destroy() {
				node.removeEventListener('load', show);
			}
		};
	}

	$effect(() => {
		if (lightboxIndex !== null) {
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = '';
			};
		}
	});

	$effect(() => {
		if (lightboxIndex === null) return;
		const index = viewIndex;
		untrack(() => {
			void prefetchFrom(index);
		});
	});

</script>

<svelte:window onkeydown={onKey} />

<section class="gallery" use:reveal>
	<SectionHeading label={g.label} title={g.title} />

	<div class="grid">
		{#each shown as item, i (i)}
			<button class="thumb" onclick={() => openAt(i)} aria-label="사진 {i + 1} 크게 보기">
				<picture>
					{#if item.thumbWebp}
						<source srcset={item.thumbWebp} type="image/webp" />
					{/if}
					<img src={item.thumb} alt={imageAlt(i, item)} loading="lazy" decoding="async" />
				</picture>
			</button>
		{/each}
	</div>

	{#if hasMore}
		<button class="more" onclick={loadMore}>
			<span>더보기</span>
			<svg class="chev" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
				<path
					d="M6 9l6 6 6-6"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
	{/if}
</section>

{#if lightboxIndex !== null}
	<div class="lightbox" transition:fade={{ duration: 180 }}>
		<div class="lb-overlay" aria-hidden="true"></div>
		{#if windowReady}
			<div
				class="lb-track"
				class:ready={trackReady}
				bind:this={trackEl}
				use:placeOpen
				onscroll={syncIndexFromScroll}
				role="list"
				aria-label="웨딩 갤러리"
			>
				{#each g.images as item, i (item.full)}
					<div class="lb-slide" class:active={i === viewIndex} role="listitem">
						<img
							class="lb-img lb-placeholder"
							class:lb-hidden={fullReady[item.full]}
							src={item.thumb}
							alt=""
							aria-hidden="true"
							draggable="false"
						/>
						{#if wantsFull(i)}
							<img
								use:watchFull={item.full}
								class="lb-img lb-full"
								class:lb-visible={fullReady[item.full]}
								src={item.full}
								alt={imageAlt(i, item)}
								draggable="false"
							/>
						{/if}
					</div>
				{/each}
			</div>
			<button class="lb-nav prev" aria-label="이전" onclick={goPrev} disabled={viewIndex === 0}>‹</button>
			<button
				class="lb-nav next"
				aria-label="다음"
				onclick={goNext}
				disabled={viewIndex === g.images.length - 1}>›</button
			>
		{:else}
			<div class="lb-dots" role="status" aria-label="사진을 불러오는 중">
				<span></span>
				<span></span>
				<span></span>
			</div>
		{/if}
		<button class="lb-close" aria-label="닫기" onclick={close}>×</button>
		<span class="lb-count">{viewIndex + 1} / {g.images.length}</span>
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
	.thumb picture,
	.thumb img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		transition: transform 0.4s ease;
	}
	.thumb:active img {
		transform: scale(1.05);
	}
	.more {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
		width: fit-content;
		margin: 1.8rem auto 0;
		padding: 0.7rem 1.4rem;
		background: none;
		border: none;
		color: var(--color-ink-soft);
		font-size: 0.92rem;
		line-height: 1;
		cursor: pointer;
	}
	.chev {
		display: block;
		flex-shrink: 0;
		color: var(--color-ink-mute);
	}

	.lightbox {
		position: fixed;
		inset: 0;
		z-index: 90;
		container-type: size;
	}
	.lb-overlay {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.9);
	}
	.lb-dots {
		position: absolute;
		inset: 0;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.55rem;
	}
	.lb-dots span {
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 999px;
		background: var(--color-paper);
		animation: lb-dot 0.9s ease-in-out infinite;
	}
	.lb-dots span:nth-child(2) {
		animation-delay: 0.15s;
	}
	.lb-dots span:nth-child(3) {
		animation-delay: 0.3s;
	}
	@keyframes lb-dot {
		0%,
		80%,
		100% {
			transform: translateY(0);
		}
		40% {
			transform: translateY(0.45rem);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.lb-dots span {
			animation: none;
		}
	}
	.lb-track {
		position: absolute;
		inset: 0;
		z-index: 1;
		display: flex;
		align-items: center;
		width: 100%;
		height: 100%;
		overflow-x: auto;
		overflow-y: hidden;
		scroll-snap-type: x mandatory;
		scroll-behavior: auto;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		touch-action: pan-x;
		--slide-gap: 0.8rem;
		gap: var(--slide-gap);
		--slide-w: min(calc(var(--slide-h) * 2 / 3), calc(100cqi - 5.5rem));
		--slide-h: min(78cqb, calc(100cqb - 7rem));
		--clip-side: max(0px, calc((100cqi - (var(--slide-w) * 3 + var(--slide-gap) * 2)) / 2));
		clip-path: inset(0 var(--clip-side) 0 var(--clip-side));
		padding-inline: calc((100cqi - var(--slide-w)) / 2);
		scroll-padding-inline: calc((100cqi - var(--slide-w)) / 2);
	}
	.lb-track:not(.ready) {
		visibility: hidden;
	}
	.lb-track::-webkit-scrollbar {
		display: none;
	}
	.lb-slide {
		position: relative;
		flex: 0 0 auto;
		width: var(--slide-w);
		height: var(--slide-h);
		overflow: hidden;
		border-radius: 4px;
		scroll-snap-align: center;
		scroll-snap-stop: always;
		transform: scale(0.92);
		opacity: 0.55;
		transition:
			transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
			opacity 0.35s ease;
	}
	.lb-slide.active {
		transform: scale(1);
		opacity: 1;
		z-index: 1;
	}
	.lb-img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-position: center;
		user-select: none;
		-webkit-user-select: none;
		-webkit-user-drag: none;
		pointer-events: none;
	}
	.lb-placeholder {
		z-index: 0;
		object-fit: cover;
		filter: blur(2px);
		opacity: 0.85;
		transition: opacity 0.2s ease;
	}
	.lb-placeholder.lb-hidden {
		opacity: 0;
	}
	.lb-full {
		z-index: 1;
		object-fit: contain;
		opacity: 0;
		transition: opacity 0.25s ease;
	}
	.lb-full.lb-visible {
		opacity: 1;
	}
	.lb-nav {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		padding: 0;
		font-size: 2rem;
		line-height: 1;
		color: #fff;
		background: rgba(255, 255, 255, 0.12);
		border: none;
		border-radius: 999px;
		cursor: pointer;
	}
	.lb-nav:disabled {
		opacity: 0.28;
		cursor: default;
	}
	.lb-nav.prev {
		left: 0.6rem;
		padding-bottom: 1px;
	}
	.lb-nav.next {
		right: 0.6rem;
		padding-bottom: 1px;
	}
	.lb-close {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		padding: 0;
		font-size: 2rem;
		line-height: 1;
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

	@media (max-width: 820px) {
		.lb-track {
			--slide-gap: 0.55rem;
			--slide-h: calc(100cqb - 4.5rem);
		}
	}
</style>
