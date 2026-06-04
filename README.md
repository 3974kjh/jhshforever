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

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
