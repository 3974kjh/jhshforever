<script lang="ts">
	import { content } from '$lib/config/content';
	import { reveal } from '$lib/actions/reveal';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import NaverMap from '$lib/components/NaverMap.svelte';

	const l = content.location;
	let copied = $state(false);
	const subwayLines = l.subwayLines.map((line) => `${line.number}호선`).join(', ');
	const [subwayLead, ...subwayTail] = l.subwayDetail.split('\n');

	const name = encodeURIComponent(l.hallName);
	const navLinks = [
		{ key: 'naver', label: '네이버지도', href: `https://map.naver.com/p/search/${name}`, newTab: true },
		{ key: 'tmap', label: '티맵', newTab: false },
		{
			key: 'kakao',
			label: '카카오맵',
			href: `https://map.kakao.com/link/to/${name},${l.lat},${l.lng}`,
			newTab: true
		}
	];

	const tmapHrefAndroid = `tmap://route?referrer=com.skt.Tmap&goalname=${name}&goalx=${l.lng}&goaly=${l.lat}`;
	const tmapHrefIos = `tmap://route?rGoName=${name}&rGoX=${l.lng}&rGoY=${l.lat}`;
	const tmapStoreAndroid =
		'https://play.google.com/store/apps/details?id=com.skt.tmap.ku&hl=ko';
	const tmapStoreIos = 'https://apps.apple.com/app/id431589174';

	const TMAP_FALLBACK_MS = 1800;

	function isIOS() {
		return typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
	}

	function isMobile() {
		return (
			typeof navigator !== 'undefined' &&
			(/Android/i.test(navigator.userAgent) || isIOS())
		);
	}

	function buildTmapHref() {
		if (typeof navigator === 'undefined') return tmapHrefAndroid;
		return isIOS() ? tmapHrefIos : tmapHrefAndroid;
	}

	function getTmapStoreUrl() {
		return isIOS() ? tmapStoreIos : tmapStoreAndroid;
	}

	function openTmap(e: MouseEvent) {
		e.preventDefault();

		const storeUrl = getTmapStoreUrl();
		if (!isMobile()) {
			window.open(storeUrl, '_blank', 'noopener,noreferrer');
			return;
		}

		let appOpened = false;
		const markOpened = () => {
			appOpened = true;
		};

		document.addEventListener('visibilitychange', markOpened);
		window.addEventListener('pagehide', markOpened);
		window.addEventListener('blur', markOpened);

		window.location.href = buildTmapHref();

		setTimeout(() => {
			document.removeEventListener('visibilitychange', markOpened);
			window.removeEventListener('pagehide', markOpened);
			window.removeEventListener('blur', markOpened);
			if (!appOpened) {
				window.location.href = storeUrl;
			}
		}, TMAP_FALLBACK_MS);
	}

	async function copyAddress() {
		try {
			await navigator.clipboard.writeText(l.roadAddress);
			copied = true;
			setTimeout(() => (copied = false), 900);
		} catch {
			copied = false;
		}
	}
</script>

<section class="location" use:reveal>
	<SectionHeading label={l.label} title={l.title} />

	<div class="hall">
		<h3>
			{l.hallName}
			{#if l.hallRoom}
				<span class="hall-room">{l.hallRoom}</span>
			{/if}
		</h3>
		{#if l.hallDetail}<p class="detail">{l.hallDetail}</p>{/if}
		<p class="time">예식 {l.weddingTime}</p>
	</div>

	<NaverMap lat={l.lat} lng={l.lng} label={l.hallName} />

	<div class="address">
		<div class="addr-row">
			<span class="tag">도로명</span>
			<p>{l.roadAddress}</p>
		</div>
		<div class="addr-row">
			<span class="tag">지번</span>
			<p>{l.jibunAddress}</p>
		</div>
		<div class="addr-row">
			<span class="tag">우편</span>
			<p>{l.zipcode}</p>
		</div>
		<button
			class="copy-addr"
			onclick={copyAddress}
			aria-label={copied ? '주소 복사 완료' : '주소 복사하기'}
		>
			<span class="copy-inner">
				<span class="copy-layer default" class:inactive={copied} aria-hidden={copied}>
					<svg class="copy-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
						<path
							d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H10V7h9v14z"
							fill="currentColor"
						/>
					</svg>
					<span>주소 복사하기</span>
				</span>
				<span class="copy-layer done" class:active={copied} aria-hidden={!copied}>
					<svg class="copy-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
						<path
							d="M9.2 16.6 4.9 12.3l1.4-1.4 2.9 2.9 8.5-8.5 1.4 1.4z"
							fill="currentColor"
						/>
					</svg>
				</span>
			</span>
		</button>
	</div>

	<div class="nav">
		<p class="nav-title">내비게이션</p>
		<div class="nav-btns">
			{#each navLinks as link (link.key)}
				{#if link.key === 'tmap'}
					<a href={buildTmapHref()} onclick={openTmap}>{link.label}</a>
				{:else}
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
					<a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
				{/if}
			{/each}
		</div>
	</div>

	<div class="transit">
		<div class="t-block">
			<h4>주차</h4>
			<p>{l.parking}</p>
		</div>
		<div class="t-block">
			<h4>지하철</h4>
			<p class="subway-lead">
				<span class="line-badges" role="img" aria-label={subwayLines}>
					{#each l.subwayLines as line (line.number)}
						<svg
							class="line-badge"
							viewBox="0 0 20 20"
							width="17"
							height="17"
							aria-hidden="true"
						>
							<circle cx="10" cy="10" r="10" fill={line.color} />
							<text
								x="10"
								y="10"
								text-anchor="middle"
								dominant-baseline="central"
								fill="#fff"
								font-size="11"
								font-weight="700"
								font-family="'Noto Sans KR', sans-serif"
							>
								{line.number}
							</text>
						</svg>
					{/each}
				</span>
				{subwayLead}
			</p>
			{#each subwayTail as line, i (i)}
				<p class="subway-tail pre">{line}</p>
			{/each}
		</div>
		<div class="t-block">
			<h4>버스</h4>
			{#each l.busGroups as bus, i (i)}
				<p><span class="bus-label">{bus.label}</span> {bus.numbers}</p>
			{/each}
		</div>
	</div>
</section>

<style>
	.location {
		padding: 3.5rem 1.6rem 4rem;
	}
	.hall {
		text-align: center;
		margin-bottom: 1.8rem;
	}
	.hall h3 {
		display: inline-flex;
		align-items: baseline;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.35rem;
		font-family: var(--font-serif);
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-ink);
	}
	.hall-room {
		position: relative;
		top: -0.2rem;
		flex-shrink: 0;
		padding: 0.05rem 0.45rem;
		border: 1px solid var(--color-line);
		border-radius: 999px;
		font-size: 0.72rem;
		font-family: var(--font-sans);
		font-weight: 500;
		line-height: 1.4;
		color: var(--color-ink-soft);
		background: var(--color-paper-dim);
	}
	.hall .detail {
		margin-top: 0.4rem;
		color: var(--color-ink-soft);
		font-size: 0.9rem;
	}
	.hall .time {
		margin-top: 0.7rem;
		color: var(--color-accent);
		font-size: 0.92rem;
	}
	.address {
		margin-top: 1.4rem;
	}
	.addr-row {
		display: flex;
		gap: 0.7rem;
		padding: 0.5rem 0;
		font-size: 0.88rem;
		color: var(--color-ink-soft);
		border-bottom: 1px solid var(--color-line);
	}
	.tag {
		flex-shrink: 0;
		width: 42px;
		color: var(--color-ink-mute);
	}
	.copy-addr {
		width: 100%;
		margin-top: 1rem;
		padding: 0.85rem;
		border: 1px solid var(--color-line);
		border-radius: 8px;
		background: #fff;
		color: var(--color-accent);
		font-size: 0.9rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 44px;
	}
	.copy-inner {
		display: grid;
		place-items: center;
		min-width: 7.5rem;
	}
	.copy-layer {
		grid-area: 1 / 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.38rem;
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
	.nav {
		margin-top: 2.2rem;
	}
	.nav-title {
		font-weight: 700;
		font-size: 0.95rem;
		color: var(--color-ink);
		margin-bottom: 0.9rem;
	}
	.nav-btns {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
	}
	.nav-btns a {
		text-align: center;
		padding: 0.8rem 0;
		border: 1px solid var(--color-line);
		border-radius: 8px;
		background: var(--color-paper);
		color: var(--color-ink);
		font-size: 0.85rem;
	}
	.transit {
		margin-top: 2.2rem;
		display: flex;
		flex-direction: column;
		gap: 1.6rem;
	}
	.t-block h4 {
		font-weight: 700;
		font-size: 0.92rem;
		color: var(--color-ink);
		margin-bottom: 0.5rem;
	}
	.t-block p {
		font-size: 0.88rem;
		color: var(--color-ink-soft);
		line-height: 1.7;
	}
	.t-block .pre {
		white-space: pre-line;
	}
	.subway-lead {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		font-size: 0.88rem;
		color: var(--color-ink-soft);
		line-height: 1.7;
	}
	.line-badges {
		display: inline-flex;
		align-items: center;
		gap: 0.32rem;
		flex-shrink: 0;
	}
	.line-badge {
		flex-shrink: 0;
		display: block;
	}
	.subway-tail {
		margin-top: 0.35rem;
		font-size: 0.88rem;
		color: var(--color-ink-soft);
		line-height: 1.7;
	}
	.bus-label {
		color: var(--color-accent);
		font-weight: 500;
	}
</style>
