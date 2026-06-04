export {};

interface KakaoShareContent {
	title: string;
	description: string;
	imageUrl: string;
	link: { mobileWebUrl: string; webUrl: string };
}

interface KakaoSdk {
	isInitialized(): boolean;
	init(key: string): void;
	Share: {
		sendDefault(settings: { objectType: 'feed'; content: KakaoShareContent }): void;
	};
}

declare global {
	interface Window {
		Kakao?: KakaoSdk;
	}
}
