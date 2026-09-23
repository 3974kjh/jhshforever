<script lang="ts">
	import { onMount } from 'svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	onMount(() => {
		const opts: AddEventListenerOptions = { capture: true, passive: false };
		const blockPinch = (e: WheelEvent) => {
			if (e.ctrlKey) e.preventDefault();
		};
		const blockGesture = (e: Event) => {
			e.preventDefault();
		};
		const blockDblClick = (e: Event) => {
			e.preventDefault();
		};

		document.addEventListener('wheel', blockPinch, opts);
		document.addEventListener('gesturestart', blockGesture, opts);
		document.addEventListener('gesturechange', blockGesture, opts);
		document.addEventListener('dblclick', blockDblClick, true);

		return () => {
			document.removeEventListener('wheel', blockPinch, opts);
			document.removeEventListener('gesturestart', blockGesture, opts);
			document.removeEventListener('gesturechange', blockGesture, opts);
			document.removeEventListener('dblclick', blockDblClick, true);
		};
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
