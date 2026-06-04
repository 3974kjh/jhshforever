<script lang="ts">
	import { content } from '$lib/config/content';
	import { env } from '$env/dynamic/public';
	import { fade, fly } from 'svelte/transition';

	let { open = $bindable(false) }: { open?: boolean } = $props();

	const share = content.share;
	const kakaoKey = env.PUBLIC_KAKAO_JS_KEY;

	let copied = $state(false);

	function close() {
		open = false;
		copied = false;
	}

	function pageUrl() {
		return typeof window !== 'undefined' ? window.location.href : '';
	}
	function imageUrl() {
		return typeof window !== 'undefined' ? window.location.origin + share.image : share.image;
	}

	function loadKakao(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (window.Kakao) return resolve();
			const s = document.createElement('script');
			s.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
			s.onload = () => resolve();
			s.onerror = () => reject(new Error('kakao sdk error'));
			document.head.appendChild(s);
		});
	}

	async function shareKakao() {
		if (!kakaoKey) return;
		try {
			await loadKakao();
			const Kakao = window.Kakao;
			if (!Kakao) return;
			if (!Kakao.isInitialized()) Kakao.init(kakaoKey);
			Kakao.Share.sendDefault({
				objectType: 'feed',
				content: {
					title: share.title,
					description: share.description,
					imageUrl: imageUrl(),
					link: { mobileWebUrl: pageUrl(), webUrl: pageUrl() }
				}
			});
		} catch {
			// noop
		}
	}

	async function copyLink() {
		try {
			await navigator.clipboard.writeText(pageUrl());
			copied = true;
			setTimeout(() => (copied = false), 1500);
		} catch {
			copied = false;
		}
	}
</script>

{#if open}
	<div class="root" role="presentation">
		<button class="overlay" aria-label="닫기" transition:fade={{ duration: 180 }} onclick={close}
		></button>
		<div
			class="sheet"
			role="dialog"
			aria-modal="true"
			aria-label="공유하기"
			transition:fly={{ y: 300, duration: 280 }}
		>
			<h3>청첩장 공유하기</h3>
			<div class="options">
				{#if kakaoKey}
					<button class="opt" onclick={shareKakao}>
						<span class="ic kakao">●</span>
						카카오톡
					</button>
				{/if}
				<button class="opt" onclick={copyLink}>
					<span class="ic link">🔗</span>
					{copied ? '복사됨' : '링크 복사'}
				</button>
			</div>
			<button class="cancel" onclick={close}>닫기</button>
		</div>
	</div>
{/if}

<style>
	.root {
		position: fixed;
		inset: 0;
		z-index: 85;
		display: flex;
		justify-content: center;
		align-items: flex-end;
	}
	.overlay {
		position: absolute;
		inset: 0;
		background: rgba(20, 18, 16, 0.5);
		border: none;
		cursor: pointer;
	}
	.sheet {
		position: relative;
		width: 100%;
		max-width: 460px;
		background: var(--color-paper);
		border-radius: 18px 18px 0 0;
		padding: 1.6rem 1.4rem 2rem;
		text-align: center;
	}
	.sheet h3 {
		font-family: var(--font-serif);
		font-weight: 700;
		font-size: 1rem;
		margin-bottom: 1.4rem;
	}
	.options {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 1.4rem;
	}
	.opt {
		flex: 1;
		max-width: 140px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem 0.5rem;
		border: 1px solid var(--color-line);
		border-radius: 12px;
		background: #fff;
		font-size: 0.85rem;
		color: var(--color-ink);
		cursor: pointer;
	}
	.ic {
		font-size: 1.3rem;
		width: 40px;
		height: 40px;
		display: grid;
		place-items: center;
		border-radius: 999px;
	}
	.ic.kakao {
		background: #fee500;
		color: #3c1e1e;
	}
	.ic.link {
		background: var(--color-paper-dim);
	}
	.cancel {
		width: 100%;
		padding: 0.85rem;
		border: none;
		border-radius: 8px;
		background: var(--color-paper-dim);
		color: var(--color-ink-soft);
		font-size: 0.9rem;
		cursor: pointer;
	}
</style>
