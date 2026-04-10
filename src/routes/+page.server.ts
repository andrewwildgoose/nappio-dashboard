import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { requireAuth, handleServerSignIn, handleServerSignOut } from '$lib/server/auth-helper';

export const load: PageServerLoad = async (event) => {
    await requireAuth(event);
    return {};
};

// Define actions for the page
export const actions = {
    auth: async (event) => {
        const data = await event.request.formData();
        const type = data.get('type') as 'signin' | 'signup' | 'signout';

        console.log('[Server] Processing auth action:', { type });

        try {
            switch (type) {
                case 'signout': {
                    return await handleServerSignOut(event);
                }

                case 'signin': {
                    const email = data.get('email')?.toString();
                    const password = data.get('password')?.toString();
                    if (!email || !password) {
                        return fail(400, { error: 'Missing email or password' });
                    }
                    return await handleServerSignIn(event, email, password);
                }
                default:
                    return fail(400, { error: 'Invalid action type' });
            }
        } catch (error) {
            if (error instanceof redirect) throw error;
            console.error('Auth error:', error);
            return fail(500, { error: 'An unexpected error occurred' });
        }
    }
};