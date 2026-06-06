import sharp from 'sharp';
import { mkdir, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const galleryDir = join(root, 'static/gallery');
const thumbsDir = join(galleryDir, 'thumbs');
const fullDir = join(galleryDir, 'full');

const THUMB_SIZE = 480;
const FULL_MAX = 1920;
const THUMB_JPEG_QUALITY = 75;
const THUMB_WEBP_QUALITY = 75;
const FULL_QUALITY = 82;

const SOURCE_PATTERN = /^\d+\.jpe?g$/i;

async function ensureDirs() {
	await mkdir(thumbsDir, { recursive: true });
	await mkdir(fullDir, { recursive: true });
}

async function listSources() {
	const topLevel = await readdir(galleryDir, { withFileTypes: true });
	const fromRoot = topLevel
		.filter((e) => e.isFile() && SOURCE_PATTERN.test(e.name))
		.map((e) => ({ name: e.name, dir: galleryDir }));

	if (fromRoot.length > 0) {
		return fromRoot.sort((a, b) => parseInt(a.name, 10) - parseInt(b.name, 10));
	}

	const fromFull = await readdir(fullDir, { withFileTypes: true });
	return fromFull
		.filter((e) => e.isFile() && SOURCE_PATTERN.test(e.name))
		.map((e) => ({ name: e.name, dir: fullDir }))
		.sort((a, b) => parseInt(a.name, 10) - parseInt(b.name, 10));
}

async function generateFromSource(source) {
	const input = join(source.dir, source.name);
	const base = source.name.replace(/\.jpe?g$/i, '');
	const thumbJpeg = join(thumbsDir, `${base}.jpeg`);
	const thumbWebp = join(thumbsDir, `${base}.webp`);
	const fullJpeg = join(fullDir, `${base}.jpeg`);
	const fromFull = source.dir === fullDir;

	const rotated = () => sharp(input).rotate();

	await rotated()
		.resize(THUMB_SIZE, THUMB_SIZE, { fit: 'cover', position: 'centre' })
		.jpeg({ quality: THUMB_JPEG_QUALITY, mozjpeg: true })
		.toFile(thumbJpeg);

	await rotated()
		.resize(THUMB_SIZE, THUMB_SIZE, { fit: 'cover', position: 'centre' })
		.webp({ quality: THUMB_WEBP_QUALITY })
		.toFile(thumbWebp);

	if (!fromFull) {
		await rotated()
			.resize(FULL_MAX, FULL_MAX, { fit: 'inside', withoutEnlargement: true })
			.jpeg({ quality: FULL_QUALITY, mozjpeg: true })
			.toFile(fullJpeg);
	}

	const [thumbStat, fullStat] = await Promise.all([
		sharp(thumbJpeg).metadata(),
		sharp(fullJpeg).metadata()
	]);

	console.log(
		`${source.name} → thumb ${thumbStat.width}×${thumbStat.height}, full ${fullStat.width}×${fullStat.height}`
	);
}

async function main() {
	await ensureDirs();
	const sources = await listSources();
	if (sources.length === 0) {
		console.error(
			'No source images found in static/gallery/ or static/gallery/full/ (expected N.jpeg).'
		);
		process.exit(1);
	}
	console.log(`Generating gallery assets for ${sources.length} image(s)...`);
	for (const file of sources) {
		await generateFromSource(file);
	}
	console.log('Done.');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
