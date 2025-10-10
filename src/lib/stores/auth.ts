import { writable, type Writable } from 'svelte/store';
import { supabase } from '$lib/supabase';

interface UserData {
    id: string;
    email?: string;
    role?: string;
    email_verified?: boolean;
}

export const user: Writable<UserData | null> = writable(null);

// Initialize auth state
supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
        user.set({
            id: session.user.id,
            email: session.user.email,
            email_verified: session.user.email_confirmed_at ? true : false
        });
        console.log('User data in auth store:', session.user);
    } else {
        user.set(null);
    }
});