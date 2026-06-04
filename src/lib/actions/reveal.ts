import type { Action } from 'svelte/action';

// 스크롤 시 요소가 뷰포트에 들어오면 .in-view 를 부여해 등장 애니메이션을 트리거합니다.
export const reveal: Action<HTMLElement, { once?: boolean } | undefined> = (node, params) => {
	const once = params?.once ?? true;
	node.classList.add('reveal');

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.classList.add('in-view');
					if (once) observer.unobserve(node);
				} else if (!once) {
					node.classList.remove('in-view');
				}
			}
		},
		{ threshold: 0.12 }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
};
