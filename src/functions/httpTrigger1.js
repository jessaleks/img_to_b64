const { app } = require('@azure/functions');
const sharp = require('sharp');

app.http('httpTrigger1', {
	methods: ['GET'],
	authLevel: 'anonymous',
	handler: async (request, context) => {
		const url = request.query.get('url');

		if (!url) {
			return {
				status: 400,
				body: 'No URL passed',
			};
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

		return {
			headers: {
				'Content-Type': placeholder.info.format,
			},
			body: placeholder.data.toString('base64'),
			isRaw: true,
		};
	},
});
