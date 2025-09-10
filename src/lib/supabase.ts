import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

export type Database = {
	public: {
		Tables: {
			user_subscriptions: {
				Row: {
					id: string;
					user_id: string;
					status: 'pending' | 'setup_paid' | 'meeting_scheduled' | 'checkout_sent' | 'active' | 'canceled';
					subscribed_at: string;
					cancelled_at: string | null;
					last_payment_date: string | null;
					next_payment_date: string | null;
					stripe_subscription_id: string | null;
					customer_id: string | null;
					address_id: string | null;
					baby_dob: string | null;
					baby_weight_at_start: number | null;
				};
				Insert: {
					id?: string;
					user_id: string;
					status?: 'pending' | 'setup_paid' | 'meeting_scheduled' | 'checkout_sent' | 'active' | 'canceled';
					subscribed_at?: string;
					cancelled_at?: string | null;
					last_payment_date?: string | null;
					next_payment_date?: string | null;
					stripe_subscription_id?: string | null;
					customer_id?: string | null;
					address_id?: string | null;
					baby_dob?: string | null;
					baby_weight_at_start?: number | null;
				};
				Update: {
					id?: string;
					user_id?: string;
					status?: 'pending' | 'setup_paid' | 'meeting_scheduled' | 'checkout_sent' | 'active' | 'canceled';
					subscribed_at?: string;
					cancelled_at?: string | null;
					last_payment_date?: string | null;
					next_payment_date?: string | null;
					stripe_subscription_id?: string | null;
					customer_id?: string | null;
					address_id?: string | null;
					baby_dob?: string | null;
					baby_weight_at_start?: number | null;
				};
			};
			subscription_progress: {
				Row: {
					id: string;
					subscription_id: string;
					last_updated: string;
					status: 'pending' | 'setup_paid' | 'meeting_scheduled' | 'checkout_sent' | 'active' | 'canceled';
					meeting_date: string | null;
				};
				Insert: {
					id?: string;
					subscription_id: string;
					last_updated?: string;
					status?: 'pending' | 'setup_paid' | 'meeting_scheduled' | 'checkout_sent' | 'active' | 'canceled';
					meeting_date?: string | null;
				};
				Update: {
					id?: string;
					subscription_id?: string;
					last_updated?: string;
					status?: 'pending' | 'setup_paid' | 'meeting_scheduled' | 'checkout_sent' | 'active' | 'canceled';
					meeting_date?: string | null;
				};
			};
		};
	};
};
