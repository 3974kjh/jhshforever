<script lang="ts">
	import { content } from '$lib/config/content';
	import { reveal } from '$lib/actions/reveal';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import NaverMap from '$lib/components/NaverMap.svelte';

	const l = content.location;
	let copied = $state(false);

	const name = encodeURIComponent(l.hallName);
	const navLinks = [
		{ key: 'naver', label: '네이버지도', href: `https://map.naver.com/p/search/${name}` },
		{
			key: 'tmap',
			label: '티맵',
			href: `tmap://route?goalname=${name}&goalx=${l.lng}&goaly=${l.lat}`
		},
		{
			key: 'kakao',
			label: '카카오맵',
			href: `https://map.kakao.com/link/to/${name},${l.lat},${l.lng}`
		}
	];

	async function copyAddress() {
		try {
			await navigator.clipboard.writeText(l.roadAddress);
			copied = true;
			setTimeout(() => (copied = false), 1500);
		} catch {
			copied = false;
		}
	}
</script>

<section class="location" use:reveal>
	<SectionHeading label={l.label} title={l.title} />

	<div class="hall">
		<h3>{l.hallName}</h3>
		{#if l.hallDetail}<p class="detail">{l.hallDetail}</p>{/if}
		<p class="time">예식 {l.weddingTime}</p>
		{#if l.tel}<p class="tel">Tel. {l.tel}</p>{/if}
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
		<button class="copy-addr" onclick={copyAddress}>
			{copied ? '주소가 복사되었습니다' : '주소 복사하기'}
		</button>
	</div>

	<div class="nav">
		<p class="nav-title">내비게이션</p>
		<div class="nav-btns">
			{#each navLinks as link (link.key)}
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
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
			<p class="pre">{l.subway}</p>
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
		font-family: var(--font-serif);
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-ink);
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
	.hall .tel {
		margin-top: 0.3rem;
		color: var(--color-ink-mute);
		font-size: 0.85rem;
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
	.bus-label {
		color: var(--color-accent);
		font-weight: 500;
	}
</style>
