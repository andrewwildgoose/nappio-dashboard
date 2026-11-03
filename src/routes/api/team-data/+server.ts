import { json, error } from '@sveltejs/kit';
import { api } from '$lib/server/api';
import type { RequestHandler } from '@sveltejs/kit';
import type { TeamDataItem } from '$lib/types/api';

export const GET: RequestHandler = async ({ locals }) => {
	// Ensure user is authenticated
	if (!locals.session) {
		error(401, 'Unauthorized');
	}

	const result = await api.getTeamData();
	
	if (!result.success) {
		error(500, result.error || 'Failed to fetch team data');
	}
	
	return json(result.data);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	// Ensure user is authenticated
	if (!locals.session) {
		error(401, 'Unauthorized');
	}

	const data: Omit<TeamDataItem, 'id' | 'created_at' | 'updated_at'> = await request.json();
	
	// Validate required fields
	if (!data.title || !data.description) {
		error(400, 'title and description are required');
	}

	const result = await api.createTeamData(data);
	
	if (!result.success) {
		error(500, result.error || 'Failed to create team data');
	}
	
	return json(result.data, { status: 201 });
};
