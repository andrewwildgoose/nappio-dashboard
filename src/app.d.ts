// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import { type Session, type User } from '@supabase/supabase-js';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: import('$lib/supabase').Database;
			getSession(): Promise<Session | null>;
		}
		interface PageData {
			session: Session | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
