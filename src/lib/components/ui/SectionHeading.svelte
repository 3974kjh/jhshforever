<script lang="ts">
	let { label = '', title = '' }: { label?: string; title?: string } = $props();
</script>

<div class="heading">
	{#if label}<p class="label">{label}</p>{/if}
	{#if title}<h2 class="title">{title}</h2>{/if}
</div>

<style>
	.heading {
		text-align: center;
		margin-bottom: 2rem;
	}
	.label {
		font-family: var(--font-display);
		letter-spacing: 0.32em;
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--color-accent-soft);
		text-transform: uppercase;
		margin-bottom: 0.7rem;
	}
	.title {
		font-family: var(--font-serif);
		font-size: 1.4rem;
		font-weight: 700;
		color: var(--color-accent);
		letter-spacing: 0.02em;
	}
</style>
