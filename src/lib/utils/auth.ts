import { goto, invalidate } from '$app/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Professional signout utility that can be used anywhere in the application
 * Handles both client and server-side cleanup
 */
export async function signOut(supabase: SupabaseClient) {
    try {
        // Sign out on the client
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            console.error('[signOut] Error during signout:', error);
            throw error;
        }
        
        // Invalidate the auth session to refresh all data
        await invalidate('supabase:auth');
        
        // Navigate to auth page
        await goto('/auth', { replaceState: true });
        
        return { success: true };
    } catch (error) {
        console.error('[signOut] Failed to sign out:', error);
        return { success: false, error };
    }
}
