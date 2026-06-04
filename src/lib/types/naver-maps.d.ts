export {};

declare global {
	interface NaverLatLng {
		lat(): number;
		lng(): number;
	}
	interface NaverMapsApi {
		Map: new (el: HTMLElement, opts: Record<string, unknown>) => unknown;
		Marker: new (opts: Record<string, unknown>) => unknown;
		LatLng: new (lat: number, lng: number) => NaverLatLng;
	}
	interface Window {
		naver?: { maps: NaverMapsApi };
	}
}
