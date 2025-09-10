import { fail, redirect } from '@sveltejs/kit';
import type { Cookies, RequestEvent } from '@sveltejs/kit';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../supabase';

export async function requireAuth(event: RequestEvent): Promise<Session> {
    const session = event.locals.session;
    if (!session) {
        throw redirect(303, '/auth');
    }
    return session;
}

export async function requireUnauth(event: RequestEvent): Promise<void> {
    if (event.locals.session) {
        throw redirect(303, '/');
    }
}

export async function handleServerSignOut(cookies: Cookies) {
    // Clear server-side session
    await supabase.auth.signOut();
    
    // Clear auth cookies
    cookies.delete('sb-access-token', { path: '/' });
    cookies.delete('sb-refresh-token', { path: '/' });

    return { success: true };
}

export async function handleServerSignIn({ email, password, cookies }: { 
    email: string; 
    password: string; 
    cookies: Cookies;
}) {
    if (!email || !password) {
        return fail(400, { error: 'Missing email or password' });
    }

    // First authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (authError) {
        return fail(400, { error: authError.message });
    }

    // Check if user exists in team_users table
    const { data: teamUser, error: teamError } = await supabase
        .from('team_users')
        .select('user_id, email, role')
        .eq('user_id', authData.user.id)
        .single();

    if (teamError || !teamUser) {
        // User not found in team_users table, deny access
        await supabase.auth.signOut();
        return fail(403, { error: 'Access denied. You are not authorized to use this dashboard.' });
    }

    // Set auth cookies
    const { access_token, refresh_token } = authData.session;
    cookies.set('sb-access-token', access_token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
    });

    cookies.set('sb-refresh-token', refresh_token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
    });

    return {
        success: true,
        message: 'Successfully signed in',
        user: {
            id: authData.user.id,
            email: authData.user.email,
            role: teamUser.role
        }
    };
}

export async function getSessionFromCookies(cookies: Cookies): Promise<Session | null> {
    const accessToken = cookies.get('sb-access-token');
    const refreshToken = cookies.get('sb-refresh-token');

    if (!accessToken || !refreshToken) {
        return null;
    }

    try {
        const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
        });

        if (error || !data.session) {
            return null;
        }

        return data.session;
    } catch {
        return null;
    }
}