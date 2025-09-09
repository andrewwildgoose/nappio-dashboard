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
		this.baseUrl = 'http://localhost:8000';
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

	// Customer data operations (for nappy service)
	async getCustomers(): Promise<ApiResponse<any[]>> {
		return this.request<any[]>('/api/customers');
	}

	async getSubscriptions(): Promise<ApiResponse<any[]>> {
		return this.request<any[]>('/api/subscriptions');
	}

	async getOrders(): Promise<ApiResponse<any[]>> {
		return this.request<any[]>('/api/orders');
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
	}
};
