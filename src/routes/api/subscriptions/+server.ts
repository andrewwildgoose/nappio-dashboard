import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { serverApi } from '$lib/server/fastapi';

export const GET: RequestHandler = async () => {
	const result = await serverApi.getSubscriptions();
	return json(result);
};
