// Types for API responses
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

// Base API class for FastAPI integration
class NappioApi {
	private baseUrl: string;

	constructor() {
		// Use environment variable or fallback to localhost
		this.baseUrl = import.meta.env.VITE_FASTAPI_BASE_URL || 'http://localhost:8000';
	}

	private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
		try {
			const url = `${this.baseUrl}${endpoint}`;
			const response = await fetch(url, {
				headers: {
					'Content-Type': 'application/json',
					...options.headers
				},
				...options
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			return { success: true, data };
		} catch (error) {
			console.error('API request failed:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	// Team data operations
	async getTeamData(): Promise<ApiResponse<TeamDataItem[]>> {
		return this.request<TeamDataItem[]>('/api/team-data');
	}

	async createTeamData(
		data: Omit<TeamDataItem, 'id' | 'created_at' | 'updated_at'>
	): Promise<ApiResponse<TeamDataItem>> {
		return this.request<TeamDataItem>('/api/team-data', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	async updateTeamData(
		id: number,
		data: Partial<Omit<TeamDataItem, 'id' | 'created_at'>>
	): Promise<ApiResponse<TeamDataItem>> {
		return this.request<TeamDataItem>(`/api/team-data/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data)
		});
	}

	async deleteTeamData(id: number): Promise<ApiResponse<void>> {
		return this.request<void>(`/api/team-data/${id}`, {
			method: 'DELETE'
		});
	}

	// Subscription management operations
	async getSubscriptions(): Promise<ApiResponse<SubscriptionData[]>> {
		return this.request<SubscriptionData[]>('/api/v1/admin/subscription-progress');
	}

	async updateSubscriptionProgress(
		data: SubscriptionProgressUpdate
	): Promise<ApiResponse<void>> {
		return this.request<void>('/api/v1/admin/subscription-progress-update', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	// Inventory operations
	async getInventory(): Promise<ApiResponse<any[]>> {
		return this.request<any[]>('/api/inventory');
	}

	async updateInventory(itemId: number, quantity: number): Promise<ApiResponse<any>> {
		return this.request<any>(`/api/inventory/${itemId}`, {
			method: 'PUT',
			body: JSON.stringify({ quantity })
		});
	}
}

// Export singleton instance
export const api = new NappioApi();

// Mock data for development/demo purposes
export const mockTeamData: TeamDataItem[] = [
	{
		id: 1,
		title: 'Customer Subscription Management',
		description: 'Review and process new customer subscriptions for weekly nappy service',
		status: 'Active',
		assigned_to: 'Sarah Johnson',
		created_at: '2024-01-15T10:00:00Z',
		updated_at: '2024-01-15T10:00:00Z'
	},
	{
		id: 2,
		title: 'Inventory Restocking',
		description: 'Order new baby wash supplies and eco-friendly detergents',
		status: 'Pending',
		assigned_to: 'Mike Chen',
		created_at: '2024-01-14T15:30:00Z',
		updated_at: '2024-01-14T15:30:00Z'
	},
	{
		id: 3,
		title: 'Delivery Route Optimization',
		description: 'Update delivery routes for north side customers to improve efficiency',
		status: 'In Progress',
		assigned_to: 'Emma Rodriguez',
		created_at: '2024-01-13T09:15:00Z',
		updated_at: '2024-01-15T14:20:00Z'
	},
	{
		id: 4,
		title: 'Quality Control Check',
		description: 'Monthly quality inspection of returned nappies and washing process',
		status: 'Completed',
		assigned_to: 'David Kim',
		created_at: '2024-01-12T11:45:00Z',
		updated_at: '2024-01-14T16:30:00Z'
	}
];

// Mock subscription data for development
export const mockSubscriptionData: SubscriptionData[] = [
	{
		subscription_id: 'sub-001',
		user_id: 'user-001',
		customer_name: 'Sarah Johnson',
		customer_email: 'sarah.johnson@email.com',
		subscription_status: 'active',
		progress_status: 'active',
		meeting_date: '2024-02-15T14:00:00Z',
		subscribed_at: '2024-01-10T10:00:00Z',
		cancelled_at: null,
		last_payment_date: '2024-01-10T10:00:00Z',
		next_payment_date: '2024-02-10T10:00:00Z',
		baby_dob: '2023-12-15T00:00:00Z',
		baby_weight_at_start: 3.2,
		last_updated: '2024-01-15T10:00:00Z'
	},
	{
		subscription_id: 'sub-002',
		user_id: 'user-002',
		customer_name: 'Mike Chen',
		customer_email: 'mike.chen@email.com',
		subscription_status: 'meeting_scheduled',
		progress_status: 'meeting_scheduled',
		meeting_date: '2024-01-25T11:30:00Z',
		subscribed_at: '2024-01-12T15:30:00Z',
		cancelled_at: null,
		last_payment_date: null,
		next_payment_date: null,
		baby_dob: '2024-01-01T00:00:00Z',
		baby_weight_at_start: 3.5,
		last_updated: '2024-01-14T15:30:00Z'
	},
	{
		subscription_id: 'sub-003',
		user_id: 'user-003',
		customer_name: 'Emma Rodriguez',
		customer_email: 'emma.rodriguez@email.com',
		subscription_status: 'setup_paid',
		progress_status: 'setup_paid',
		meeting_date: null,
		subscribed_at: '2024-01-14T09:15:00Z',
		cancelled_at: null,
		last_payment_date: '2024-01-14T09:15:00Z',
		next_payment_date: null,
		baby_dob: '2024-01-08T00:00:00Z',
		baby_weight_at_start: 2.9,
		last_updated: '2024-01-15T14:20:00Z'
	},
	{
		subscription_id: 'sub-004',
		user_id: 'user-004',
		customer_name: 'David Kim',
		customer_email: 'david.kim@email.com',
		subscription_status: 'pending',
		progress_status: 'pending',
		meeting_date: null,
		subscribed_at: '2024-01-16T11:45:00Z',
		cancelled_at: null,
		last_payment_date: null,
		next_payment_date: null,
		baby_dob: '2024-01-10T00:00:00Z',
		baby_weight_at_start: 3.1,
		last_updated: '2024-01-16T11:45:00Z'
	},
	{
		subscription_id: 'sub-005',
		user_id: 'user-005',
		customer_name: 'Lisa Wang',
		customer_email: 'lisa.wang@email.com',
		subscription_status: 'canceled',
		progress_status: 'canceled',
		meeting_date: '2024-01-20T10:00:00Z',
		subscribed_at: '2024-01-05T08:00:00Z',
		cancelled_at: '2024-01-18T16:30:00Z',
		last_payment_date: '2024-01-05T08:00:00Z',
		next_payment_date: null,
		baby_dob: '2023-12-20T00:00:00Z',
		baby_weight_at_start: 3.0,
		last_updated: '2024-01-18T16:30:00Z'
	}
];

// Mock API functions for development
export const mockApi = {
	async getTeamData(): Promise<ApiResponse<TeamDataItem[]>> {
		await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
		return { success: true, data: [...mockTeamData] };
	},

	async createTeamData(
		data: Omit<TeamDataItem, 'id' | 'created_at' | 'updated_at'>
	): Promise<ApiResponse<TeamDataItem>> {
		await new Promise((resolve) => setTimeout(resolve, 800));
		const newItem: TeamDataItem = {
			...data,
			id: Date.now(),
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		};
		mockTeamData.push(newItem);
		return { success: true, data: newItem };
	},

	async updateTeamData(
		id: number,
		data: Partial<Omit<TeamDataItem, 'id' | 'created_at'>>
	): Promise<ApiResponse<TeamDataItem>> {
		await new Promise((resolve) => setTimeout(resolve, 600));
		const index = mockTeamData.findIndex((item) => item.id === id);
		if (index === -1) {
			return { success: false, error: 'Item not found' };
		}

		mockTeamData[index] = {
			...mockTeamData[index],
			...data,
			updated_at: new Date().toISOString()
		};

		return { success: true, data: mockTeamData[index] };
	},

	async deleteTeamData(id: number): Promise<ApiResponse<void>> {
		await new Promise((resolve) => setTimeout(resolve, 400));
		const index = mockTeamData.findIndex((item) => item.id === id);
		if (index === -1) {
			return { success: false, error: 'Item not found' };
		}

		mockTeamData.splice(index, 1);
		return { success: true };
	},

	// Subscription API methods
	async getSubscriptions(): Promise<ApiResponse<SubscriptionData[]>> {
		await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
		return { success: true, data: [...mockSubscriptionData] };
	},

	async updateSubscriptionProgress(
		update: SubscriptionProgressUpdate
	): Promise<ApiResponse<void>> {
		await new Promise((resolve) => setTimeout(resolve, 800));
		
		const index = mockSubscriptionData.findIndex(
			(sub) => sub.subscription_id === update.subscription_id
		);
		
		if (index === -1) {
			return { success: false, error: 'Subscription not found' };
		}

		// Update the subscription data
		if (update.status !== undefined) {
			mockSubscriptionData[index].progress_status = update.status;
			// Also update subscription status if they should be in sync
			mockSubscriptionData[index].subscription_status = update.status;
		}
		
		if (update.meeting_date !== undefined) {
			mockSubscriptionData[index].meeting_date = update.meeting_date;
		}
		
		mockSubscriptionData[index].last_updated = new Date().toISOString();

		return { success: true };
	}
};
