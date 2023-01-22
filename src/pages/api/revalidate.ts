import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const { url } = req?.query;
		if (!url) throw new Error('Invalid url');

		await res.revalidate(url as string);

		return res
			.status(200)
			.json({ ok: true, message: 'revalidation successful' });
	} catch (e: any) {
		res.status(400).json({ ok: false, message: e.message });
	}
}
