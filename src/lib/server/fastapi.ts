import { FASTAPI_BASE_URL } from '$env/static/private';
import type { ApiResponse, SubscriptionData, SubscriptionProgressUpdate, TeamDataItem } from '$lib/api';

class ServerNappioApi {
	private baseUrl: string;

	constructor() {
		this.baseUrl = FASTAPI_BASE_URL || 'http://localhost:8000';
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

export const serverApi = new ServerNappioApi();
