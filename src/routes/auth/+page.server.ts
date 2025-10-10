import type { Actions, PageServerLoad } from './$types';
import { handleServerSignIn, handleServerSignOut, requireUnauth } from '$lib/server/auth-helper';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
    await requireUnauth(event);
    return {};
};

export const actions: Actions = {
    signin: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('email') as string;
        const password = data.get('password') as string;

        const result = await handleServerSignIn({ email, password, cookies });
        
        if (result && 'success' in result && result.success) {
            throw redirect(303, '/');
        }
        
        return result;
    },
    
    signout: async ({ cookies }) => {
        await handleServerSignOut(cookies);
        throw redirect(303, '/auth');
    }
};