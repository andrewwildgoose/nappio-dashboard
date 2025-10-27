// Shared types that can be imported by both client and server code

export interface TeamDataItem {
	id: number;
	title: string;
	description: string;
	status: string;
	assigned_to: string;
	created_at: string;
	updated_at: string;
}

export type SubscriptionStatus = 'pending' | 'setup_paid' | 'meeting_scheduled' | 'checkout_sent' | 'active' | 'canceled';

export interface SubscriptionData {
	subscription_id: string;
	user_id: string;
	customer_name: string;
	customer_email: string;
	subscription_status: SubscriptionStatus;
	progress_status: SubscriptionStatus;
	meeting_date: string | null;
	subscribed_at: string;
	cancelled_at: string | null;
	last_payment_date: string | null;
	next_payment_date: string | null;
	baby_dob: string | null;
	baby_weight_at_start: number | null;
	last_updated: string;
}

export interface SubscriptionProgressUpdate {
	subscription_id: string;
	status?: SubscriptionStatus;
	meeting_date?: string | null;
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}
