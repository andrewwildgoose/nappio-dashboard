import { json, error } from '@sveltejs/kit';
import { api } from '$lib/server/api';
import type { RequestHandler } from '@sveltejs/kit';
import type { TeamDataItem } from '$lib/types/api';

export const PUT: RequestHandler = async ({ params, request, locals }) => {
	// Ensure user is authenticated
	if (!locals.session) {
		error(401, 'Unauthorized');
	}

	const id = parseInt(params.id);
	if (isNaN(id)) {
		error(400, 'Invalid ID');
	}

	const data: Partial<Omit<TeamDataItem, 'id' | 'created_at'>> = await request.json();
	
	const result = await api.updateTeamData(id, data);
	
	if (!result.success) {
		error(500, result.error || 'Failed to update team data');
	}
	
	return json(result.data);
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	// Ensure user is authenticated
	if (!locals.session) {
		error(401, 'Unauthorized');
	}

	const id = parseInt(params.id);
	if (isNaN(id)) {
		error(400, 'Invalid ID');
	}

	const result = await api.deleteTeamData(id);
	
	if (!result.success) {
		error(500, result.error || 'Failed to delete team data');
	}
	
	return json({ success: true });
};
