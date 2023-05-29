const fetch = (/** @type {any[]} */ ...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args));
const sharp = require('sharp');

module.exports = async function (context, req) {
	const url = req.query.url;

	if (!url) {
		context.res = {
			status: 400,
			body: 'No URL passed',
		};
		return;
	}

	const image = await fetch(url)
		.then((res) => res.arrayBuffer())
		.then((buf) => Buffer.from(buf));

	const placeholder = await sharp(image)
		.resize(80, 48)
		.toFormat('webp')
		.modulate({ saturation: 1.2, brightness: 1 })
		.blur(8)
		.toBuffer({ resolveWithObject: true });

	context.res = {
		headers: {
			'Content-Type': placeholder.info.format,
		},
		body: placeholder.data.toString('base64'),
		isRaw: true,
	};
};

// const minimist = require('minimist');
// const sharp = require('sharp');

// async function main() {
// 	const args = minimist(process.argv.slice(2));
// 	if (!args) {
// 		console.error('No arguments passed');
// 		process.exit(1);
// 	}
// 	const url = args._[0];

// 	if (!url) {
// 		console.error('No URL passed');
// 		process.exit(1);
// 	}
// 	const image = await fetch(url)
// 		.then((res) => res.arrayBuffer())
// 		.then((buf) => Buffer.from(buf));

// 	const placeholder = await sharp(image)
// 		.resize(80, 48)
// 		.toFormat('webp')
// 		.modulate({ saturation: 1.2, brightness: 1 })
// 		.blur(10)
// 		.toBuffer({ resolveWithObject: true });

// 	console.log(
// 		`data:image/${
// 			placeholder.info.format
// 		};base64,${placeholder.data.toString('base64')}`
// 	);
// }

// main();
