// Client side supabase client and cookie storage

import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabase = createBrowserClient(
    PUBLIC_SUPABASE_URL, 
    PUBLIC_SUPABASE_ANON_KEY,
    {
        cookieOptions: {
            name: 'nappio-dashboard-auth',
            sameSite: 'lax',
            secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
        }
    }
);

// Team users table type for validation
export type TeamUser = {
	user_id: string;
	email: string;
	role: string;
	created_at: string;
};