import { fail, redirect } from '@sveltejs/kit';
import type { Cookies, RequestEvent } from '@sveltejs/kit';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../supabase';

export async function requireAuth(event: RequestEvent): Promise<Session> {
    const session = event.locals.session;
    console.log('[requireAuth] session:', session);
    if (!session) {
        console.warn('[requireAuth] No session found, redirecting to /auth');
        throw redirect(303, '/auth');
    }
    return session;
}

export async function requireUnauth(event: RequestEvent): Promise<void> {
    if (event.locals.session) {
        console.warn('[requireUnauth] Session found, redirecting to /');
        throw redirect(303, '/');
    }
}

export async function handleServerSignOut(cookies: Cookies) {
    // Clear server-side session
    console.log('[handleServerSignOut] Signing out user');
    await supabase.auth.signOut();
    
    // Clear auth cookies
    cookies.delete('sb-access-token', { path: '/' });
    cookies.delete('sb-refresh-token', { path: '/' });
    console.log('[handleServerSignOut] Cleared auth cookies');

    return { success: true };
}

export async function handleServerSignIn({ email, password, cookies }: { 
    email: string; 
    password: string; 
    cookies: Cookies;
}) {
    console.log('[handleServerSignIn] Attempting sign in for email:', email);
    if (!email || !password) {
        console.warn('[handleServerSignIn] Missing email or password');
        return fail(400, { error: 'Missing email or password' });
    }

    // First authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    console.log('[handleServerSignIn] Auth response:', { authData, authError });

    if (authError) {
        console.error('[handleServerSignIn] Auth error:', authError.message);
        return fail(400, { error: authError.message });
    }

    // Check if user exists in team_users table
    const { data: teamUser, error: teamError } = await supabase
        .from('team_users')
        .select('user_id, role')
        .eq('user_id', authData.user.id)
        .single();
    console.log('[handleServerSignIn] teamUser response:', { teamUser, teamError });

    if (teamError || !teamUser) {
        // User not found in team_users table, deny access
        console.warn('[handleServerSignIn] User not found in team_users or error:', teamError);
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
    console.log('[handleServerSignIn] Set auth cookies for user:', authData.user.id);

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
    console.log('[getSessionFromCookies] accessToken:', accessToken, 'refreshToken:', refreshToken);

    if (!accessToken || !refreshToken) {
        console.warn('[getSessionFromCookies] Missing access or refresh token');
        return null;
    }

    try {
        const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
        });
        console.log('[getSessionFromCookies] setSession response:', { data, error });

        if (error || !data.session) {
            console.warn('[getSessionFromCookies] Error or no session:', error);
            return null;
        }

        return data.session;
    } catch (e) {
        console.error('[getSessionFromCookies] Exception:', e);
        return null;
    }
}