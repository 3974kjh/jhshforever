<script lang="ts">
	import { env } from '$env/dynamic/public';

	let {
		lat,
		lng,
		label = '',
		zoom = 16
	}: { lat: number; lng: number; label?: string; zoom?: number } = $props();

	const clientId = env.PUBLIC_NAVER_MAP_CLIENT_ID;
	let mapEl = $state<HTMLDivElement | null>(null);
	let failed = $state(false);

	function loadSdk(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (window.naver?.maps) return resolve();
			const existing = document.getElementById('naver-maps-sdk');
			if (existing) {
				existing.addEventListener('load', () => resolve());
				existing.addEventListener('error', () => reject(new Error('sdk error')));
				return;
			}
			const s = document.createElement('script');
			s.id = 'naver-maps-sdk';
			s.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
			s.async = true;
			s.onload = () => resolve();
			s.onerror = () => reject(new Error('sdk error'));
			document.head.appendChild(s);
		});
	}

	$effect(() => {
		if (!clientId || !mapEl) return;
		const el = mapEl;
		let cancelled = false;
		loadSdk()
			.then(() => {
				if (cancelled || !window.naver) return;
				const naver = window.naver;
				const pos = new naver.maps.LatLng(lat, lng);
				const map = new naver.maps.Map(el, { center: pos, zoom });
				new naver.maps.Marker({ position: pos, map, title: label });
			})
			.catch(() => {
				failed = true;
			});
		return () => {
			cancelled = true;
		};
	});
</script>

{#if clientId && !failed}
	<div class="map" bind:this={mapEl}></div>
{:else}
	<div class="map fallback">
		<p>지도를 표시할 수 없습니다.</p>
		<a
			href="https://map.naver.com/p/search/{encodeURIComponent(label)}"
			target="_blank"
			rel="noopener noreferrer">네이버지도에서 보기</a
		>
	</div>
{/if}

<style>
	.map {
		width: 100%;
		height: 240px;
		border-radius: 4px;
		overflow: hidden;
		background: var(--color-paper-dim);
	}
	.fallback {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.6rem;
		color: var(--color-ink-soft);
		font-size: 0.9rem;
	}
	.fallback a {
		color: var(--color-accent);
		text-decoration: underline;
	}
</style>
