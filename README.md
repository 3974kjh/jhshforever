# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
pnpm dlx sv@0.15.3 create --template minimal --types ts --add prettier eslint tailwindcss="plugins:typography" --install pnpm ./
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Gallery images

원본 사진은 `static/gallery/1.jpeg` … 형식으로 두고, 그리드·라이트박스용 파일은 생성 스크립트로 만듭니다.

```sh
pnpm gallery:assets
```

- `static/gallery/thumbs/` — 그리드 썸네일 (JPEG + WebP)
- `static/gallery/full/` — 라이트박스용 (긴 변 1920px)

원본을 추가·교체한 뒤 위 명령을 다시 실행하세요.

## Section photos (hero, invitation, history)

원본은 `static/photos/` 최상위에 두고, 청첩장·OG용 압축 JPEG는 생성 스크립트로 만듭니다.

```sh
pnpm photos:assets
```

- `static/photos/optimized/` — mozjpeg 품질 82, 긴 변 리사이즈 (히어로·초대장 1920px, 히스토리 960px)
- 원본 파일명은 `.jpg` / `.jpeg` / `.png` / `.webp` 모두 지원합니다. 출력은 항상 `.jpeg`입니다.

원본을 추가·교체한 뒤 위 명령을 다시 실행하고, `src/lib/config/content.ts`의 경로가 `/photos/optimized/…`를 가리키는지 확인하세요.

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
