<script lang="ts">
	import { content } from '$lib/config/content';
	import { reveal } from '$lib/actions/reveal';

	const c = content.calendar;
	const target = new Date(c.dateISO);
	const year = target.getFullYear();
	const month = target.getMonth();
	const targetDay = target.getDate();

	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

	const cells: (number | null)[] = (() => {
		const firstWeekday = new Date(year, month, 1).getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		const out: (number | null)[] = [];
		for (let i = 0; i < firstWeekday; i++) out.push(null);
		for (let d = 1; d <= daysInMonth; d++) out.push(d);
		while (out.length % 7 !== 0) out.push(null);
		return out;
	})();

	let now = $state(Date.now());
	$effect(() => {
		const id = setInterval(() => (now = Date.now()), 1000);
		return () => clearInterval(id);
	});

	const diff = $derived(Math.max(0, target.getTime() - now));
	const days = $derived(Math.floor(diff / 86_400_000));
	const hours = $derived(Math.floor(diff / 3_600_000) % 24);
	const minutes = $derived(Math.floor(diff / 60_000) % 60);
	const seconds = $derived(Math.floor(diff / 1000) % 60);
	const daysLeftText = $derived(Math.ceil(diff / 86_400_000));
	const ddayParts = c.dDayText.split('{days}');

	const pad = (n: number) => String(n).padStart(2, '0');
</script>

<section class="calendar" use:reveal>
	<div class="head">
		<p class="date">{c.dateText}</p>
		<p class="sub">{c.subText}</p>
	</div>

	<div class="weekdays grid">
		{#each weekdays as w, i (i)}
			<span class="cell wd" class:sun={i === 0} class:sat={i === 6}>{w}</span>
		{/each}
	</div>

	<div class="days grid">
		{#each cells as day, i (i)}
			{#if day === null}
				<span class="cell empty"></span>
			{:else}
				<span
					class="cell day"
					class:sun={i % 7 === 0}
					class:sat={i % 7 === 6}
					class:target={day === targetDay}
				>
					{day}
				</span>
			{/if}
		{/each}
	</div>

	<div class="countdown">
		{#each [{ l: 'DAYS', v: days }, { l: 'HOUR', v: hours }, { l: 'MIN', v: minutes }, { l: 'SEC', v: seconds }] as item, i (i)}
			{#if i > 0}<span class="colon">:</span>{/if}
			<div class="unit">
				<span class="label">{item.l}</span>
				<span class="value">{pad(item.v)}</span>
			</div>
		{/each}
	</div>

	<p class="dday">
		{ddayParts[0]}<b>{daysLeftText}</b>{ddayParts[1] ?? ''}
	</p>
</section>

<style>
	.calendar {
		padding: 3.5rem 1.6rem 4rem;
		text-align: center;
	}
	.head .date {
		font-family: var(--font-display);
		font-size: 1.7rem;
		letter-spacing: 0.1em;
		color: var(--color-ink);
	}
	.head .sub {
		margin-top: 0.5rem;
		color: var(--color-ink-soft);
		font-size: 0.92rem;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.2rem 0;
	}
	.weekdays {
		margin-top: 2.2rem;
		padding-bottom: 0.8rem;
		border-bottom: 1px solid var(--color-line);
	}
	.days {
		margin-top: 1rem;
	}
	.cell {
		aspect-ratio: 1 / 1;
		display: grid;
		place-items: center;
		font-size: 0.9rem;
		color: var(--color-ink);
	}
	.wd {
		font-size: 0.82rem;
		color: var(--color-ink-soft);
		aspect-ratio: auto;
	}
	.sun,
	.sat {
		color: var(--color-point);
	}
	.target {
		position: relative;
		color: #fff;
		font-weight: 700;
	}
	.target::before {
		content: '';
		position: absolute;
		width: 34px;
		height: 34px;
		border-radius: 999px;
		background: var(--color-accent);
		z-index: -1;
	}
	.countdown {
		margin-top: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.7rem;
	}
	.unit {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		min-width: 40px;
	}
	.unit .label {
		font-family: var(--font-display);
		font-size: 0.7rem;
		letter-spacing: 0.12em;
		color: var(--color-ink-mute);
	}
	.unit .value {
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--color-ink);
	}
	.colon {
		color: var(--color-ink-mute);
		font-size: 1.1rem;
		transform: translateY(6px);
	}
	.dday {
		margin-top: 1.8rem;
		color: var(--color-ink-soft);
		font-size: 0.92rem;
	}
	.dday :global(b) {
		color: var(--color-accent);
		font-weight: 700;
	}
</style>
