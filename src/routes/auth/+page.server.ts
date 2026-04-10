import type { Actions, PageServerLoad } from './$types';
import { handleServerSignIn, handleServerSignOut, requireUnauth } from '$lib/server/auth-helper';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
    await requireUnauth(event);
    return {};
};

export const actions: Actions = {
    signin: async (event) => {
        const data = await event.request.formData();
        const email = data.get('email') as string;
        const password = data.get('password') as string;

        const result = await handleServerSignIn(event, email, password);
        
        if (result && 'success' in result && result.success) {
            throw redirect(303, '/');
        }
        
        return result;
    },
    
    signout: async (event) => {
        await handleServerSignOut(event);
        // After signing out, redirect to auth page
        throw redirect(303, '/auth');
    }
};