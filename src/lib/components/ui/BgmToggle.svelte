<script lang="ts">
	import { content } from '$lib/config/content';

	const bgm = content.bgm;
	let audioEl = $state<HTMLAudioElement | null>(null);
	let playing = $state(false);

	async function play() {
		if (!audioEl) return;
		try {
			await audioEl.play();
			playing = true;
		} catch {
			playing = false;
		}
	}

	function toggle() {
		if (!audioEl) return;
		if (playing) {
			audioEl.pause();
			playing = false;
		} else {
			play();
		}
	}

	$effect(() => {
		if (!bgm.enabled || !bgm.autoplay) return;
		// 브라우저 정책상 첫 사용자 상호작용 후에 재생을 시도합니다.
		const start = () => {
			play();
			window.removeEventListener('pointerdown', start);
			window.removeEventListener('touchstart', start);
		};
		window.addEventListener('pointerdown', start, { once: true });
		window.addEventListener('touchstart', start, { once: true });
		return () => {
			window.removeEventListener('pointerdown', start);
			window.removeEventListener('touchstart', start);
		};
	});
</script>

{#if bgm.enabled}
	<audio bind:this={audioEl} src={bgm.src} loop preload="none"></audio>
	<button
		class="bgm"
		class:playing
		onclick={toggle}
		aria-label="배경음악 {playing ? '끄기' : '켜기'}"
	>
		<span class="icon" aria-hidden="true">
			{#if playing}
				<span class="notes-stage">
					<span class="note note-a">♪</span>
					<span class="note note-b">♪</span>
					<span class="note note-c">♪</span>
				</span>
			{:else}
				<span class="note-idle">♪</span>
			{/if}
		</span>
	</button>
{/if}

<style>
	.bgm {
		position: fixed;
		bottom: 1.2rem;
		right: max(1.2rem, calc((100vw - 460px) / 2 + 1.2rem));
		z-index: 60;
		width: 48px;
		height: 48px;
		border-radius: 999px;
		background: rgba(44, 42, 40, 0.55);
		color: #fff;
		border: none;
		display: grid;
		place-items: center;
		cursor: pointer;
		backdrop-filter: blur(4px);
	}
	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
	}
	.note-idle {
		font-size: 1.2rem;
		line-height: 1;
	}
	.notes-stage {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		contain: paint;
		isolation: isolate;
		-webkit-mask-image: linear-gradient(
			90deg,
			transparent 0%,
			#000 22%,
			#000 78%,
			transparent 100%
		);
		mask-image: linear-gradient(90deg, transparent 0%, #000 22%, #000 78%, transparent 100%);
	}
	.note {
		position: absolute;
		left: 50%;
		top: 50%;
		font-size: 1rem;
		line-height: 1;
		opacity: 0;
		visibility: hidden;
		animation: note-sine 2.4s linear infinite;
	}
	.note-a {
		animation-delay: 0s;
	}
	.note-b {
		animation-delay: -0.8s;
	}
	.note-c {
		animation-delay: -1.6s;
	}
	/* 왼쪽 → 오른쪽, 사인 곡선 — 끝에서 멈추지 않고 화면 밖으로 빠져나감 */
	@keyframes note-sine {
		0% {
			transform: translate(-50%, -50%) translate(-14px, 0);
			opacity: 0;
			visibility: hidden;
		}
		6% {
			opacity: 1;
			visibility: visible;
		}
		12.5% {
			transform: translate(-50%, -50%) translate(-9px, -5px);
		}
		25% {
			transform: translate(-50%, -50%) translate(-4px, 0);
		}
		37.5% {
			transform: translate(-50%, -50%) translate(0, 5px);
		}
		50% {
			transform: translate(-50%, -50%) translate(4px, 0);
		}
		62.5% {
			transform: translate(-50%, -50%) translate(9px, -5px);
		}
		72% {
			transform: translate(-50%, -50%) translate(11px, 0);
			opacity: 1;
			visibility: visible;
		}
		80% {
			transform: translate(-50%, -50%) translate(14px, 2px);
			opacity: 0.55;
		}
		86% {
			transform: translate(-50%, -50%) translate(17px, 0);
			opacity: 0;
			visibility: hidden;
		}
		/* 86~100%: 오른쪽 밖에서 대기 — 끝에 고정·페이드로 잔상 방지 */
		86.001%,
		100% {
			transform: translate(-50%, -50%) translate(20px, 0);
			opacity: 0;
			visibility: hidden;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.note {
			animation: none;
			opacity: 1;
			transform: translate(-50%, -50%);
		}
		.note-b,
		.note-c {
			display: none;
		}
	}
</style>
