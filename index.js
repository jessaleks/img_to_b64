import minimist from 'minimist';
import sharp from 'sharp';

async function main() {
	const args = minimist(process.argv.slice(2));
	if (!args) {
		console.error('No arguments passed');
		process.exit(1);
	}
	const url = args._[0];

	if (!url) {
		console.error('No URL passed');
		process.exit(1);
	}
	const image = await fetch(url)
		.then((res) => res.arrayBuffer())
		.then((buf) => Buffer.from(buf));

	const placeholder = await sharp(image)
		.resize(64, 30)
		.toFormat('webp')
		.modulate({ saturation: 1.2, brightness: 1 })
		.blur(10)
		.toBuffer({ resolveWithObject: true });

	console.log(
		`data:image/${
			placeholder.info.format
		};base64,${placeholder.data.toString('base64')}`
	);
}

main();
