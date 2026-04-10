import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { serverApi } from '$lib/server/fastapi';
import type { SubscriptionProgressUpdate } from '$lib/api';

export const POST: RequestHandler = async ({ request }) => {
	const body: SubscriptionProgressUpdate = await request.json();
	const result = await serverApi.updateSubscriptionProgress(body);
	return json(result);
};
