import type { LayoutServerLoad } from './$types';
import { requireAuth } from '$lib/server/auth-helper';

// Every page in the (app) group requires a signed-in team member.
// (hooks.server.ts also guards routes; this is a second line of defence.)
export const load: LayoutServerLoad = async (event) => {
	await requireAuth(event);
	return {};
};
