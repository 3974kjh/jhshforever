import type { GalleryImage, InvitationContent } from './types';

function galleryImage(id: number): GalleryImage {
	const n = String(id);
	return {
		thumb: `/gallery/thumbs/${n}.jpeg`,
		thumbWebp: `/gallery/thumbs/${n}.webp`,
		full: `/gallery/full/${n}.jpeg`
	};
}

const GALLERY_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const;

// ⬇️ 청첩장에 표시되는 모든 텍스트/이미지/연락처를 이 파일에서 관리합니다.
//    (인터뷰 / 히스토리 문구는 예시이므로 자유롭게 수정하세요.)

export const content: InvitationContent = {
	main: {
		groom: { ko: '김준형', en: 'Junhyung' },
		bride: { ko: '박소현', en: 'Soohyun' },
		dateText: '2027. 02. 28',
		subText: 'SUN 12:20 PM',
		image: '/photos/optimized/hero.jpeg',
		badge: 'Forever'
	},

	invitation: {
		label: 'INVITATION',
		title: '소중한 분들을 초대합니다',
		messageLines: [
			'하늘 아래 내가 받은 가장 큰 선물은 오늘입니다.',
			'오늘 받은 선물 가운데서도',
			'가장 아름다운 선물은 당신입니다.',
			'',
			'저희 두 사람의 앞날을 가까이서 지켜봐주시면',
			'더없는 기쁨으로 간직하겠습니다.'
		],
		attribution: '나태주, 「선물」 中',
		groomSide: {
			father: '김강구',
			mother: '신종희',
			relation: '장남',
			name: '김준형'
		},
		brideSide: {
			father: '박성규',
			mother: '조후임',
			relation: '장녀',
			name: '박소현'
		},
		contactPhone: '010-0000-0000',
		image: '/photos/optimized/invitation.jpeg'
	},

	interview: {
		label: 'INTERVIEW',
		title: '우리 두 사람의 이야기',
		description: '결혼을 앞두고 저희 두 사람의\n인터뷰를 준비했습니다.',
		buttonText: '신랑 & 신부의 인터뷰 읽어보기',
		items: [
			{
				question: 'Q1. 신랑 신부를 소개해주세요',
				answers: [
					{
						speaker: '신랑 김준형',
						tag: 'ISTJ',
						text: '계획은 철저, 감정 표현은 서툴지만 진심은 깊은 사람입니다. 작은 약속도 잊지 않고 챙기고, 묵묵히 행동으로 보여주는 스타일이에요.'
					},
					{
						speaker: '신부 박소현',
						tag: 'ENFP',
						text: '하루에도 열두 번 웃고 우는 감성 엔진입니다. 유머와 에너지로 분위기를 밝게 만들고, 낭만과 현실을 넘나드는 사람이에요.'
					}
				]
			},
			{
				question: 'Q2. 두 분은 어떻게 만나게 되었나요?',
				answers: [
					{
						speaker: '함께',
						text: '서로의 이름도 몰랐던 어느 날, 지인의 모임에서 마주 앉게 됐어요. 말수가 적은 준형과 수다쟁이 소현의 대화가 이상하게 편했고, 자연스럽게 연락이 이어졌습니다.'
					}
				]
			},
			{
				question: 'Q3. 서로의 어떤 점이 좋았나요?',
				answers: [
					{
						speaker: '신랑 김준형',
						text: '함께 있으면 마음이 편안해지고, 늘 웃게 만들어 주는 사람이라 좋았어요.'
					},
					{
						speaker: '신부 박소현',
						text: '진중하게 제 이야기를 끝까지 들어주고, 한 번 한 약속은 꼭 지키는 모습이 믿음직했어요.'
					}
				]
			},
			{
				question: 'Q4. 앞으로 어떤 부부가 되고 싶나요?',
				answers: [
					{
						speaker: '함께',
						text: '서로 다른 속도와 방식을 인정하며, 작은 일에도 고마워하는 부부가 되고 싶어요. 오래도록 친구처럼 지내겠습니다.'
					}
				]
			}
		]
	},

	history: {
		label: 'OUR STORY',
		title: '만남에서 사랑으로',
		periodText: '2022.01.26 ~ 2027.02.28',
		items: [
			{
				year: '2022',
				date: '2022.01.26',
				title: '우리가 처음 만난 날',
				description: '지인의 모임에서 우연히 마주 앉아\n이야기를 나누기 시작했습니다.',
				image: '/photos/optimized/history-2022.jpeg'
			},
			{
				year: '2023',
				title: '특별하지 않아도',
				description:
					'특별한 변화 없이도\n서로의 하루에 자연스럽게 스며들었고,\n관계는 이어졌습니다.',
				image: '/photos/optimized/history-2023.jpeg'
			},
			{
				year: '2024',
				title: '편안한 거리감',
				description:
					'자주 보지 않아도\n함께하는 시간은 늘 편안했고,\n그 감정이 점점 익숙해졌습니다.',
				image: '/photos/optimized/history-2024.jpeg'
			},
			{
				year: '2025',
				title: '서로를 이해하는 시간',
				description:
					'다른 속도와 방식 속에서도\n서로를 이해하는 과정이\n관계를 더 단단하게 만들었습니다.',
				image: '/photos/optimized/history-2025.jpeg'
			},
			{
				year: '2026',
				title: '평생을 약속하며',
				description: '오랜 시간 함께한 마음을 모아\n서로에게 평생을 약속했습니다.',
				image: '/photos/optimized/history-2026.jpeg'
			},
			{
				year: '2027',
				date: '2027.02.28',
				title: '하나가 되는 날',
				description: '이제 부부로서\n새로운 이야기를 시작합니다.',
				image: ''
			}
		]
	},

	calendar: {
		label: 'CALENDAR',
		title: '',
		dateISO: '2027-02-28T12:20:00+09:00',
		dateText: '2027. 02. 28',
		subText: '일요일 낮 12시 20분',
		dDayText: '준형, 소현의 결혼식이 {days}일 남았습니다.'
	},

	gallery: {
		label: 'GALLERY',
		title: '웨딩 갤러리',
		images: GALLERY_IDS.map(galleryImage),
		initialCount: 9,
		loadMoreCount: 6
	},

	location: {
		label: 'LOCATION',
		title: '오시는 길',
		hallName: '웨스턴베니비스 신도림',
		hallDetail: '신도림테크노마트 7층',
		roadAddress: '서울 구로구 새말로 97 신도림테크노마트 7층',
		jibunAddress: '서울 구로구 구로동 3-25 신도림테크노마트 7층',
		zipcode: '08288',
		parking: '신도림 테크노마트 지하주차장 이용 (주차 3시간 무료)',
		weddingTime: '오후 12시 20분',
		tel: '02-000-0000',
		lat: 37.508725,
		lng: 126.891306,
		subway:
			'1, 2호선 신도림역 2, 3번 출구 도보 1분\n(신도림 테크노마트 판매동 지하 1층과 직접 연결)',
		busGroups: [
			{ label: '지선버스', numbers: '5619, 6411, 6511, 6512' },
			{ label: '간선·직행·일반버스', numbers: '160, 600, 662, 10' }
		]
	},

	guestbook: {
		label: 'GUESTBOOK',
		title: '방명록',
		description: '축하의 마음을 남겨주세요.'
	},

	account: {
		label: 'ACCOUNT',
		title: '마음 전하실 곳',
		description: '참석이 어려우신 분들을 위해\n계좌번호를 안내드립니다.',
		groups: [
			{
				label: '신랑측',
				accounts: [
					{ role: '신랑 김준형', bank: '국민은행', number: '000-0000-0000-000', holder: '김준형' },
					{
						role: '아버지 김강구',
						bank: '국민은행',
						number: '000-0000-0000-000',
						holder: '김강구'
					},
					{ role: '어머니 신종희', bank: '국민은행', number: '000-0000-0000-000', holder: '신종희' }
				]
			},
			{
				label: '신부측',
				accounts: [
					{ role: '신부 박소현', bank: '신한은행', number: '000-000000-00-000', holder: '박소현' },
					{
						role: '아버지 박성규',
						bank: '신한은행',
						number: '000-000000-00-000',
						holder: '박성규'
					},
					{ role: '어머니 조후임', bank: '신한은행', number: '000-000000-00-000', holder: '조후임' }
				]
			}
		]
	},

	share: {
		title: '준형 ♥ 소현 결혼합니다',
		description: '2027. 02. 28 (일) 오후 12시 20분 · 웨스턴베니비스 신도림',
		image: '/photos/optimized/hero.jpeg'
	},

	bgm: {
		enabled: true,
		src: '/audio/bgm.mp3',
		autoplay: true
	}
};
