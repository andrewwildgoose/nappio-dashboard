import { json, error } from '@sveltejs/kit';
import { api } from '$lib/server/api';
import type { RequestHandler } from '@sveltejs/kit';
import type { SubscriptionProgressUpdate } from '$lib/types/api';

export const POST: RequestHandler = async ({ request, locals }) => {
	// Ensure user is authenticated
	if (!locals.session) {
		error(401, 'Unauthorized');
	}

	const data: SubscriptionProgressUpdate = await request.json();
	
	// Validate required fields
	if (!data.subscription_id) {
		error(400, 'subscription_id is required');
	}

	const result = await api.updateSubscriptionProgress(data);
	
	if (!result.success) {
		error(500, result.error || 'Failed to update subscription');
	}
	
	return json({ success: true });
};
