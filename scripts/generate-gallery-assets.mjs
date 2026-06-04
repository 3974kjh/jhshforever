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
	const entries = await readdir(galleryDir, { withFileTypes: true });
	return entries
		.filter((e) => e.isFile() && SOURCE_PATTERN.test(e.name))
		.map((e) => e.name)
		.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
}

async function generateFromSource(filename) {
	const input = join(galleryDir, filename);
	const base = filename.replace(/\.jpe?g$/i, '');
	const thumbJpeg = join(thumbsDir, `${base}.jpeg`);
	const thumbWebp = join(thumbsDir, `${base}.webp`);
	const fullJpeg = join(fullDir, `${base}.jpeg`);

	const rotated = () => sharp(input).rotate();

	await rotated()
		.resize(THUMB_SIZE, THUMB_SIZE, { fit: 'cover', position: 'centre' })
		.jpeg({ quality: THUMB_JPEG_QUALITY, mozjpeg: true })
		.toFile(thumbJpeg);

	await rotated()
		.resize(THUMB_SIZE, THUMB_SIZE, { fit: 'cover', position: 'centre' })
		.webp({ quality: THUMB_WEBP_QUALITY })
		.toFile(thumbWebp);

	await rotated()
		.resize(FULL_MAX, FULL_MAX, { fit: 'inside', withoutEnlargement: true })
		.jpeg({ quality: FULL_QUALITY, mozjpeg: true })
		.toFile(fullJpeg);

	const [thumbStat, fullStat] = await Promise.all([
		sharp(thumbJpeg).metadata(),
		sharp(fullJpeg).metadata()
	]);

	console.log(
		`${filename} → thumb ${thumbStat.width}×${thumbStat.height}, full ${fullStat.width}×${fullStat.height}`
	);
}

async function main() {
	await ensureDirs();
	const sources = await listSources();
	if (sources.length === 0) {
		console.error('No source images found in static/gallery/ (expected N.jpeg at top level).');
		process.exit(1);
	}
	console.log(`Generating thumbs + full for ${sources.length} image(s)...`);
	for (const file of sources) {
		await generateFromSource(file);
	}
	console.log('Done.');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
