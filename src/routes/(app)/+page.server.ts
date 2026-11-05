import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { defaultRoute } from '$lib/config/navigation';

export const load: PageServerLoad = async () => {
	redirect(307, defaultRoute);
};
