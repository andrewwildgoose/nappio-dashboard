import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import type { Session } from '@supabase/supabase-js';

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

export async function handleServerSignOut(event: RequestEvent) {
    // Supabase SSR handles cookies automatically
    const { error } = await event.locals.supabase.auth.signOut();
    if (error) {
        console.error('[handleServerSignOut] Error signing out:', error);
    }
    // Clear the session from locals
    event.locals.session = null;
    event.locals.user = null;
    return { success: true };
}

export async function handleServerSignIn(event: RequestEvent, email: string, password: string) {
    console.log('[handleServerSignIn] Attempting sign in for email:', email);
    if (!email || !password) {
        console.warn('[handleServerSignIn] Missing email or password');
        return fail(400, { error: 'Missing email or password' });
    }

    // First authenticate with Supabase
    const { data: authData, error: authError } = await event.locals.supabase.auth.signInWithPassword({
        email,
        password
    });
    console.log('[handleServerSignIn] Auth response:', { authData, authError });

    if (authError) {
        console.error('[handleServerSignIn] Auth error:', authError.message);
        return fail(400, { error: authError.message });
    }

    // Check if user exists in team_users table
    const { data: teamUser, error: teamError } = await event.locals.supabase
        .from('team_users')
        .select('user_id, role')
        .eq('user_id', authData.user.id)
        .single();
    console.log('[handleServerSignIn] teamUser response:', { teamUser, teamError });

    if (teamError || !teamUser) {
        // User not found in team_users table, deny access
        console.warn('[handleServerSignIn] User not found in team_users or error:', teamError);
        await event.locals.supabase.auth.signOut();
        return fail(403, { error: 'Access denied. You are not authorized to use this dashboard.' });
    }

    console.log('[handleServerSignIn] Successfully authenticated user:', authData.user.id);

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

// Validate user is in team_users table
export async function validateTeamUser(event: RequestEvent, userId: string): Promise<boolean> {
    const { data: teamUser, error } = await event.locals.supabase
        .from('team_users')
        .select('user_id, role')
        .eq('user_id', userId)
        .single();
    
    if (error || !teamUser) {
        console.warn('[validateTeamUser] User not found in team_users:', userId, error);
        return false;
    }
    
    console.log('[validateTeamUser] User validated:', userId);
    return true;
}