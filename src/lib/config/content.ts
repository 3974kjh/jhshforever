import type { GalleryImage, InvitationContent } from './types';

function galleryImage(id: number): GalleryImage {
	const n = String(id);
	return {
		thumb: `/gallery/thumbs/${n}.jpeg`,
		thumbWebp: `/gallery/thumbs/${n}.webp`,
		full: `/gallery/full/${n}.jpeg`
	};
}

const GALLERY_IDS = [
	1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21
] as const;

// ⬇️ 청첩장에 표시되는 모든 텍스트/이미지/연락처를 이 파일에서 관리합니다.
//    (인터뷰 / 히스토리 문구는 예시이므로 자유롭게 수정하세요.)

export const content: InvitationContent = {
	main: {
		groom: { ko: '김준형', en: 'Junhyung' },
		bride: { ko: '박소현', en: 'Sohyun' },
		dateText: '2027. 02. 28',
		subText: 'SUN 12:20 PM',
		image: '/photos/optimized/hero.jpeg',
		hallHighlight: '웨스턴베니비스 신도림 · 그레이스홀',
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
				question: 'Q1. 신랑 & 신부를 소개해 주세요',
				answers: [
					{
						speaker: '신랑 김준형',
						tag: 'INTP',
						text: '차분하고 듬직하며 생각이 깊습니다. 사람과 삶을 깊이 바라볼 줄 아는 사람입니다. 그리고 나만의 개그맨이라 함께 있으면 너무 즐겁습니다.'
					},
					{
						speaker: '신부 박소현',
						tag: 'ISFJ',
						text: '배려심 많고 무엇이든 똑부러지게 잘하는 야무진 성격을 가지고 있습니다. 밝은 에너지가 넘쳐 주변 사람들의 기분을 좋게 만들어주는 인간비타민 같은 존재입니다.'
					}
				]
			},
			{
				question: 'Q2. 두 분은 어떻게 만나게 되었나요?',
				answers: [
					{
						speaker: '함께',
						text: '지인의 소개로 처음 만나 서로의 생애 첫 소개팅을 통해 특별한 인연이 되었습니다. 처음 만난 날, 낮부터 밤까지 이야기를 나누며 즐거운 데이트를 이어나갔습니다.'
					}
				]
			},
			{
				question: 'Q3. 서로의 어떤 점이 좋았나요?',
				answers: [
					{
						speaker: '신랑 김준형',
						text: '어떤 어려움도 함께 이겨낼 수 있다는 든든한 믿음이 느껴졌습니다. 가치관이 잘 맞고 함께 있는 것만으로도 늘 웃음이 끊이지 않는 것은 물론 모든 모습이 사랑스럽고 귀여워 보였습니다.'
					},
					{
						speaker: '신부 박소현',
						text: '발랄하고 사랑스러운 매력으로 언제나 주변을 환하게 만드는 사람입니다. 무엇이든 적극적으로 일하는 책임감, 다툼이 생겨도 먼저 손을 내미는 넓은 마음과 서로 닮은 가치관까지 큰 매력으로 다가왔습니다.'
					}
				]
			},
			{
				question: 'Q4. 앞으로 어떤 부부가 되고 싶나요?',
				answers: [
					{
						speaker: '함께',
						text: '서로를 믿고 의지하며 어떤 풍파가 찾아와도 함께 이겨내는 부부가 되고 싶습니다.\n비 온 뒤에는 더 단단한 땅과 맑은 아침이 찾아오듯, 언제나 긍정적인 마음으로 살아가려고 합니다.\n할머니, 할아버지가 되는 날까지도 서로를 당연하게 여기지 않고 이해와 감사, 존중을 잊지 않는 부부가 되고 싶습니다.'
					}
				]
			}
		]
	},

	history: {
		label: 'OUR STORY',
		title: '만남에서 사랑으로',
		periodText: '2022.01.26 ~ 2027.02.28',
		stripHint: '밀어 넘겨보세요',
		items: [
			{
				year: '2022',
				date: '2022.01.26',
				title: '우리가 처음 만난 날',
				description: '서로에게 처음이었던 소개팅을 통해\n하루 온종일 이야기를 나누기 시작했습니다.',
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
				image: '/photos/optimized/history-2027.jpeg'
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
		hallRoom: '그레이스홀',
		hallDetail: '신도림테크노마트 7층',
		roadAddress: '서울 구로구 새말로 97 신도림테크노마트 7층',
		jibunAddress: '서울 구로구 구로동 3-25 신도림테크노마트 7층',
		zipcode: '08288',
		parking: '신도림 테크노마트 지하주차장 이용 (주차 3시간 무료)',
		weddingTime: '오후 12시 20분',
		tel: '02-000-0000',
		lat: 37.506821,
		lng: 126.890361,
		subwayLines: [
			{ number: 1, color: '#0F218B' },
			{ number: 2, color: '#008837' }
		],
		subwayDetail:
			'신도림역 2, 3번 출구 도보 1분\n(신도림 테크노마트 판매동 지하 1층과 직접 연결)',
		busGroups: [
			{ label: '지선버스', numbers: '5619, 6411, 6511, 6512' },
			{ label: '간선·직행·일반버스', numbers: '160, 600, 662, 10' }
		]
	},

	guestbook: {
		label: 'GUESTBOOK',
		title: '방명록',
		description: '축하의 마음을 남겨주세요.',
		initialCount: 5,
		loadMoreCount: 5
	},

	account: {
		label: 'ACCOUNT',
		title: '마음 전하실 곳',
		description: '참석이 어려우신 분들을 위해\n계좌번호를 안내드립니다.',
		groups: [
			{
				label: '신랑측',
				accounts: [
					{ role: '신랑 김준형', bank: '국민은행', number: '366902-04-078893', holder: '김준형' },
					{
						role: '아버지 김강구',
						bank: 'IM뱅크(대구)',
						number: '023-07-020990-3',
						holder: '김강구'
					},
					{ role: '어머니 신종희', bank: '국민은행', number: '599-21-0375-327', holder: '신종희' }
				]
			},
			{
				label: '신부측',
				accounts: [
					{ role: '신부 박소현', bank: '우리은행', number: '1002-352-642976', holder: '박소현' },
					{
						role: '아버지 박성규',
						bank: '농협은행',
						number: '352-1037-3936-33',
						holder: '박성규'
					},
					{ role: '어머니 조후임', bank: '농협은행', number: '351-0788-5264-33', holder: '조후임' }
				]
			}
		]
	},

	share: {
		title: '준형 ♥ 소현 결혼합니다',
		description: '2027.02.28(일) 12:20PM · 웨스턴베니비스 신도림 그레이스홀',
		image: '/photos/optimized/hero.jpeg'
	},

	bgm: {
		enabled: true,
		src: '/audio/bgm.mp3',
		autoplay: true
	}
};
