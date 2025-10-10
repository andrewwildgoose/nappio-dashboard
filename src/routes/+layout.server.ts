import type { LayoutServerLoad } from './$types';
import { getSessionFromCookies } from '$lib/server/auth-helper';

export const load: LayoutServerLoad = async ({ cookies }) => {
    const session = await getSessionFromCookies(cookies);
    
    return {
        session
    };
};