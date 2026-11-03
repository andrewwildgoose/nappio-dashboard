import { json, error } from '@sveltejs/kit';
import { api } from '$lib/server/api';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	// Ensure user is authenticated
	if (!locals.session) {
		error(401, 'Unauthorized');
	}

	const result = await api.getSubscriptions();
	
	if (!result.success) {
		error(500, result.error || 'Failed to fetch subscriptions');
	}
	
	return json(result.data);
};
