import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

export type Database = {
	public: {
		Tables: {
			team_data: {
				Row: {
					id: number;
					created_at: string;
					title: string;
					description: string;
					status: string;
					assigned_to: string;
					updated_at: string;
				};
				Insert: {
					id?: number;
					created_at?: string;
					title: string;
					description: string;
					status?: string;
					assigned_to: string;
					updated_at?: string;
				};
				Update: {
					id?: number;
					created_at?: string;
					title?: string;
					description?: string;
					status?: string;
					assigned_to?: string;
					updated_at?: string;
				};
			};
		};
	};
};
