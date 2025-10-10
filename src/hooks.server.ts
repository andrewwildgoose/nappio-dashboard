// This file is used to handle server-side logic in a SvelteKit application.
import type { Handle } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';


export const handle: Handle = async ({ event, resolve }) => {
    const accessToken = event.cookies.get('sb-access-token');
    const refreshToken = event.cookies.get('sb-refresh-token');

    if (accessToken) {
        const { data: { session }, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
        });

        if (error) {
            event.cookies.delete('sb-access-token', { path: '/' });
            event.cookies.delete('sb-refresh-token', { path: '/' });
            event.locals.session = null;
            event.locals.user = null;
        } else {
            event.locals.session = session;
            event.locals.user = session?.user || null;
        }
    } else {
        event.locals.session = null;
        event.locals.user = null;
    }

    return await resolve(event);
};