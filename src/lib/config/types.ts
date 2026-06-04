// 청첩장 콘텐츠 타입 정의
// 실제 문구/이미지/연락처는 content.ts 에서 관리합니다.

export interface CoupleName {
	/** 한글 이름 (예: 김준형) */
	ko: string;
	/** 영문 이름 (예: Junhyung) */
	en: string;
}

export interface Main {
	groom: CoupleName;
	bride: CoupleName;
	/** 메인에 표시할 날짜 텍스트 (예: 2027. 02. 28) */
	dateText: string;
	/** 메인에 표시할 시간 텍스트 (예: SAT 12:20 PM) */
	subText: string;
	/** 히어로 배경 이미지 경로 */
	image: string;
	/** 메인 상단/하단 작은 라벨 */
	badge?: string;
}

/** 혼주 + 신랑(또는 신부) 정보 */
export interface FamilySide {
	father: string;
	mother: string;
	/** 관계 (장남 / 장녀 등) */
	relation: string;
	/** 본인 이름 */
	name: string;
}

export interface Invitation {
	/** 초대 인사 소제목 (영문 라벨) */
	label: string;
	title: string;
	/** 인사 문구 (줄 단위) */
	messageLines: string[];
	/** 출처 표기 (예: 나태주, 선물 中) */
	attribution?: string;
	groomSide: FamilySide;
	brideSide: FamilySide;
	/** 대표 연락처 (연락하기 버튼) */
	contactPhone?: string;
	/** 초대장 하단 사진 */
	image?: string;
}

export interface InterviewAnswer {
	/** 발화자 (신랑 김준형 등) */
	speaker: string;
	/** MBTI 등 부가 라벨 (선택) */
	tag?: string;
	text: string;
}

export interface InterviewQA {
	question: string;
	answers: InterviewAnswer[];
}

export interface Interview {
	label: string;
	title: string;
	description: string;
	buttonText: string;
	items: InterviewQA[];
}

export interface HistoryItem {
	/** 연도 헤더 (예: 2022) */
	year: string;
	/** 세부 날짜 (선택, 예: 2022.01.26) */
	date?: string;
	title: string;
	description: string;
	image?: string;
}

export interface History {
	label: string;
	title: string;
	/** 전체 기간 표기 (예: 2022.01.26 ~ 2027.02.28) */
	periodText: string;
	items: HistoryItem[];
}

export interface Calendar {
	label: string;
	title: string;
	/** ISO 형식 결혼식 일시 (countdown/달력 계산용) */
	dateISO: string;
	/** 달력 위 표시 문구 (예: 2027. 02. 28) */
	dateText: string;
	/** 부가 문구 (예: 일요일 낮 12시 20분) */
	subText: string;
	/** 카운트다운 하단 문구 ({days} 치환됨) */
	dDayText: string;
}

export interface GalleryImage {
	/** 그리드용 썸네일 (JPEG fallback) */
	thumb: string;
	/** 그리드용 썸네일 (WebP, 지원 브라우저) */
	thumbWebp?: string;
	/** 라이트박스용 표시 해상도 이미지 */
	full: string;
	alt?: string;
}

export interface Gallery {
	label: string;
	title: string;
	images: GalleryImage[];
	/** 처음 보여줄 개수 */
	initialCount: number;
	/** 더보기 클릭 시 추가로 불러올 개수 */
	loadMoreCount: number;
}

export interface BusGroup {
	/** 분류 (지선버스 / 간선버스 등) */
	label: string;
	numbers: string;
}

export interface Location {
	label: string;
	title: string;
	/** 식장 이름 */
	hallName: string;
	/** 층/홀 정보 */
	hallDetail?: string;
	roadAddress: string;
	jibunAddress: string;
	zipcode: string;
	parking: string;
	weddingTime: string;
	tel?: string;
	/** 지도 좌표 */
	lat: number;
	lng: number;
	subway: string;
	busGroups: BusGroup[];
}

export interface Account {
	bank: string;
	number: string;
	holder: string;
	/** 관계 (신랑 / 아버지 / 어머니 등) */
	role?: string;
}

export interface AccountGroup {
	/** 신랑측 / 신부측 */
	label: string;
	accounts: Account[];
}

export interface AccountSection {
	label: string;
	title: string;
	description?: string;
	groups: AccountGroup[];
}

export interface Guestbook {
	label: string;
	title: string;
	description?: string;
}

export interface Share {
	/** 공유 시 제목 */
	title: string;
	/** 공유 시 설명 */
	description: string;
	/** 공유 시 이미지 (절대 경로 권장) */
	image: string;
}

export interface Bgm {
	enabled: boolean;
	src: string;
	/** 첫 진입 시 자동재생 시도 여부 */
	autoplay: boolean;
}

export interface InvitationContent {
	main: Main;
	invitation: Invitation;
	interview: Interview;
	history: History;
	calendar: Calendar;
	gallery: Gallery;
	location: Location;
	guestbook: Guestbook;
	account: AccountSection;
	share: Share;
	bgm: Bgm;
}
