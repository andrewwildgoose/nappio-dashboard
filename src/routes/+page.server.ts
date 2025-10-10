import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/auth-helper';

export const load: PageServerLoad = async (event) => {
    await requireAuth(event);
    return {};
};