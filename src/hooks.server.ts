import { createServerClient } from '@supabase/ssr'
import { type Handle, redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

const supabase: Handle = async ({ event, resolve }) => {
    /**
     * Creates a Supabase client specific to this server request.
     *
     * The Supabase client gets the Auth token from the request cookies.
     * Uses custom cookie name prefix 'nappio-dashboard' to avoid conflicts
     * with other apps using the same Supabase instance.
     */
    event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        cookies: {
        getAll: () => event.cookies.getAll(),
        /**
         * SvelteKit's cookies API requires `path` to be explicitly set in
         * the cookie options. Setting `path` to `/` replicates previous/
         * standard behavior.
         */
        setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) => {
            event.cookies.set(name, value, { ...options, path: '/' })
            })
        },
        },
        cookieOptions: {
            name: 'nappio-dashboard-auth',
            // Other security options
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
        }
    })

    /**
     * Unlike `supabase.auth.getSession()`, which returns the session _without_
     * validating the JWT, this function also calls `getUser()` to validate the
     * JWT before returning the session.
     */
    event.locals.safeGetSession = async () => {
        const {
        data: { session },
        } = await event.locals.supabase.auth.getSession()
        if (!session) {
        return { session: null, user: null }
        }

        const {
        data: { user },
        error,
        } = await event.locals.supabase.auth.getUser()
        if (error) {
        // JWT validation has failed
        return { session: null, user: null }
        }

        return { session, user }
    }

    return resolve(event, {
        filterSerializedResponseHeaders(name) {
        /**
         * Supabase libraries use the `content-range` and `x-supabase-api-version`
         * headers, so we need to tell SvelteKit to pass it through.
         */
        return name === 'content-range' || name === 'x-supabase-api-version'
        },
    })
    }

const authGuard: Handle = async ({ event, resolve }) => {
    const { session, user } = await event.locals.safeGetSession()
    event.locals.session = session
    event.locals.user = user

    // Allow signout action to proceed without auth checks
    const isSignoutAction = event.url.pathname === '/auth' && event.request.method === 'POST';
    
    if (!isSignoutAction) {
        // If there's a session, validate the user is in team_users table
        if (session && user) {
            const { data: teamUser, error } = await event.locals.supabase
                .from('team_users')
                .select('user_id, role')
                .eq('user_id', user.id)
                .single();
            
            if (error || !teamUser) {
                // User is authenticated but not in team_users - sign them out and redirect
                console.warn('[authGuard] User not in team_users, signing out:', user.id);
                await event.locals.supabase.auth.signOut();
                event.locals.session = null;
                event.locals.user = null;
                
                if (event.url.pathname !== '/auth') {
                    redirect(303, '/auth');
                }
            }
        }

        // Redirect to auth if not authenticated and trying to access protected routes
        if (!event.locals.session && event.url.pathname !== '/auth' && !event.url.pathname.startsWith('/auth')) {
            if (event.url.pathname.startsWith('/api/')) {
                return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            redirect(303, '/auth')
        }

        // Redirect to home if authenticated and trying to access auth page (but not signout action)
        if (event.locals.session && event.url.pathname === '/auth' && event.request.method === 'GET') {
            redirect(303, '/')
        }
    }

    return resolve(event)
}

export const handle: Handle = sequence(supabase, authGuard)