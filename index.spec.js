const fetch = require('node-fetch');
const sharp = require('sharp');
const minimist = require('minimist');

jest.mock('node-fetch');
jest.mock('sharp');
jest.mock('minimist');

describe('main', () => {
	it('should log a base64 encoded image', async () => {
		const url = 'https://example.com/image.jpg';
		const arrayBuffer = new ArrayBuffer(8);
		const buffer = Buffer.from(arrayBuffer);
		const data = Buffer.from('data');
		const toBufferResult = { data };
		const expectedOutput = `data:image/webp;base64,${data.toString(
			'base64'
		)}`;

		minimist.mockReturnValueOnce({ _: [url] });
		fetch.mockResolvedValueOnce({ arrayBuffer });
		sharp.mockReturnValueOnce({
			resize: jest.fn().mockReturnThis(),
			toFormat: jest.fn().mockReturnThis(),
			modulate: jest.fn().mockReturnThis(),
			blur: jest.fn().mockReturnThis(),
			toBuffer: jest.fn().mockResolvedValueOnce(toBufferResult),
		});

		await main();

		expect(fetch).toHaveBeenCalledWith(url);
		expect(sharp).toHaveBeenCalledWith(buffer);
		expect(sharp().resize).toHaveBeenCalledWith(64, 30);
		expect(sharp().toFormat).toHaveBeenCalledWith('webp');
		expect(sharp().modulate).toHaveBeenCalledWith({
			saturation: 1.2,
			brightness: 1,
		});
		expect(sharp().blur).toHaveBeenCalledWith(10);
		expect(sharp().toBuffer).toHaveBeenCalledWith({
			resolveWithObject: true,
		});
		expect(console.log).toHaveBeenCalledWith(expectedOutput);
	});

	it('should log an error message if no arguments are passed', async () => {
		minimist.mockReturnValueOnce(null);

		await main();

		expect(console.error).toHaveBeenCalledWith('No arguments passed');
		expect(process.exit).toHaveBeenCalledWith(1);
	});

	it('should log an error message if no URL is passed', async () => {
		minimist.mockReturnValueOnce({ _: [] });

		await main();

		expect(console.error).toHaveBeenCalledWith('No URL passed');
		expect(process.exit).toHaveBeenCalledWith(1);
	});
});
