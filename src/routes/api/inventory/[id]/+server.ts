import { json, error } from '@sveltejs/kit';
import { api } from '$lib/server/api';
import type { RequestHandler } from '@sveltejs/kit';

export const PUT: RequestHandler = async ({ params, request, locals }) => {
	// Ensure user is authenticated
	if (!locals.session) {
		error(401, 'Unauthorized');
	}

	const id = parseInt(params.id);
	if (isNaN(id)) {
		error(400, 'Invalid ID');
	}

	const { quantity } = await request.json();
	
	if (typeof quantity !== 'number') {
		error(400, 'quantity must be a number');
	}

	const result = await api.updateInventory(id, quantity);
	
	if (!result.success) {
		error(500, result.error || 'Failed to update inventory');
	}
	
	return json(result.data);
};
