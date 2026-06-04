import sharp from 'sharp';
import { mkdir, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const photosDir = join(root, 'static/photos');
const outDir = join(photosDir, 'optimized');

const DISPLAY_MAX = 1920;
const HISTORY_MAX = 960;
const JPEG_QUALITY = 82;

const IMAGE_PATTERN = /\.(jpe?g|png|webp)$/i;

function outputName(filename) {
	const stem = filename.replace(/\.[^.]+$/i, '');
	return `${stem}.jpeg`;
}

function maxDimension(filename) {
	return /^history-/i.test(filename) ? HISTORY_MAX : DISPLAY_MAX;
}

async function ensureOutDir() {
	await mkdir(outDir, { recursive: true });
}

async function listSources() {
	const entries = await readdir(photosDir, { withFileTypes: true });
	return entries
		.filter((e) => e.isFile() && IMAGE_PATTERN.test(e.name))
		.map((e) => e.name)
		.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

async function generateFromSource(filename) {
	const input = join(photosDir, filename);
	const output = join(outDir, outputName(filename));
	const max = maxDimension(filename);

	await sharp(input)
		.rotate()
		.resize(max, max, { fit: 'inside', withoutEnlargement: true })
		.jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
		.toFile(output);

	const { width, height } = await sharp(output).metadata();
	console.log(`${filename} → optimized/${outputName(filename)} (${width}×${height})`);
}

async function main() {
	await ensureOutDir();
	const sources = await listSources();
	if (sources.length === 0) {
		console.error(
			'No source images found in static/photos/ (expected .jpg/.jpeg/.png/.webp at top level).'
		);
		process.exit(1);
	}
	console.log(`Optimizing ${sources.length} photo(s)...`);
	for (const file of sources) {
		await generateFromSource(file);
	}
	console.log('Done.');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
