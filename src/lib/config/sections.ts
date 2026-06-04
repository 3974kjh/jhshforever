// 섹션 순서/노출 관리
//
// - 순서를 바꾸려면 sectionLayout 배열의 순서만 변경하세요.
// - 특정 섹션을 숨기려면 visible 을 false 로 바꾸세요.
// 코드(컴포넌트) 수정 없이 이 파일만으로 구성/순서를 제어할 수 있습니다.

export enum SectionType {
	Main = 'main',
	Invitation = 'invitation',
	Interview = 'interview',
	History = 'history',
	Calendar = 'calendar',
	Gallery = 'gallery',
	Location = 'location',
	Guestbook = 'guestbook',
	Account = 'account'
}

export interface SectionConfig {
	type: SectionType;
	visible: boolean;
}

export const sectionLayout: SectionConfig[] = [
	{ type: SectionType.Main, visible: true },
	{ type: SectionType.Invitation, visible: true },
	{ type: SectionType.Interview, visible: true },
	{ type: SectionType.History, visible: true },
	{ type: SectionType.Calendar, visible: true },
	{ type: SectionType.Gallery, visible: true },
	{ type: SectionType.Location, visible: true },
	{ type: SectionType.Guestbook, visible: true },
	{ type: SectionType.Account, visible: true }
];

/** 렌더링 대상(노출된) 섹션 목록 */
export const visibleSections = sectionLayout.filter((s) => s.visible);
