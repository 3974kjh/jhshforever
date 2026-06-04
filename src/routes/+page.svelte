<script lang="ts">
	import type { Component } from 'svelte';
	import { page } from '$app/state';

	import { content } from '$lib/config/content';
	import { SectionType, visibleSections } from '$lib/config/sections';

	import Main from '$lib/components/sections/Main.svelte';
	import Invitation from '$lib/components/sections/Invitation.svelte';
	import Interview from '$lib/components/sections/Interview.svelte';
	import History from '$lib/components/sections/History.svelte';
	import Calendar from '$lib/components/sections/Calendar.svelte';
	import Gallery from '$lib/components/sections/Gallery.svelte';
	import Location from '$lib/components/sections/Location.svelte';
	import Guestbook from '$lib/components/sections/Guestbook.svelte';
	import Account from '$lib/components/sections/Account.svelte';

	import BgmToggle from '$lib/components/ui/BgmToggle.svelte';
	import ShareSheet from '$lib/components/ui/ShareSheet.svelte';

	// Main 은 onShare 콜백이 필요하므로 별도 처리합니다.
	const sectionComponents: Partial<Record<SectionType, Component>> = {
		[SectionType.Invitation]: Invitation,
		[SectionType.Interview]: Interview,
		[SectionType.History]: History,
		[SectionType.Calendar]: Calendar,
		[SectionType.Gallery]: Gallery,
		[SectionType.Location]: Location,
		[SectionType.Guestbook]: Guestbook,
		[SectionType.Account]: Account
	};

	let shareOpen = $state(false);

	const share = content.share;
	const ogImage = $derived(page.url ? `${page.url.origin}${share.image}` : share.image);
	const pageUrl = $derived(page.url?.href ?? '');
</script>

<svelte:head>
	<title>{share.title}</title>
	<meta name="description" content={share.description} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={share.title} />
	<meta property="og:description" content={share.description} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:url" content={pageUrl} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={share.title} />
	<meta name="twitter:description" content={share.description} />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>

<main class="invitation-shell">
	{#each visibleSections as section (section.type)}
		{#if section.type === SectionType.Main}
			<Main onShare={() => (shareOpen = true)} />
		{:else}
			{@const Section = sectionComponents[section.type]}
			{#if Section}
				<Section />
			{/if}
		{/if}
	{/each}

	<footer class="footer">
		<p class="names">{content.main.groom.en} &amp; {content.main.bride.en}</p>
		<p class="date">{content.main.dateText}</p>
	</footer>
</main>

<BgmToggle />
<ShareSheet bind:open={shareOpen} />

<style>
	.footer {
		text-align: center;
		padding: 3rem 1.6rem 4rem;
		background: var(--color-paper-dim);
		border-top: 1px solid var(--color-line);
	}
	.footer .names {
		font-family: var(--font-display);
		font-size: 1.3rem;
		letter-spacing: 0.1em;
		color: var(--color-ink);
	}
	.footer .date {
		margin-top: 0.5rem;
		font-family: var(--font-display);
		letter-spacing: 0.16em;
		font-size: 0.85rem;
		color: var(--color-ink-mute);
	}
</style>
