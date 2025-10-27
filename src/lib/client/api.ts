import type { TeamDataItem, SubscriptionData, SubscriptionProgressUpdate } from '$lib/types/api';

// Client-side API that calls your SvelteKit API routes (not FastAPI directly)
class ClientApi {
	private async fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
		const response = await fetch(url, {
			headers: {
				'Content-Type': 'application/json',
				...options?.headers
			},
			...options
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(errorText || `Request failed: ${response.status}`);
		}

		return response.json();
	}

	// Team Data Operations
	async getTeamData(): Promise<TeamDataItem[]> {
		return this.fetchJson<TeamDataItem[]>('/api/team-data');
	}

	async createTeamData(data: Omit<TeamDataItem, 'id' | 'created_at' | 'updated_at'>): Promise<TeamDataItem> {
		return this.fetchJson<TeamDataItem>('/api/team-data', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	async updateTeamData(id: number, data: Partial<Omit<TeamDataItem, 'id' | 'created_at'>>): Promise<TeamDataItem> {
		return this.fetchJson<TeamDataItem>(`/api/team-data/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data)
		});
	}

	async deleteTeamData(id: number): Promise<void> {
		await this.fetchJson<{ success: boolean }>(`/api/team-data/${id}`, {
			method: 'DELETE'
		});
	}

	// Subscription Operations
	async getSubscriptions(): Promise<SubscriptionData[]> {
		return this.fetchJson<SubscriptionData[]>('/api/subscriptions');
	}

	async updateSubscriptionProgress(data: SubscriptionProgressUpdate): Promise<void> {
		await this.fetchJson<{ success: boolean }>('/api/subscriptions/progress', {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	// Inventory Operations
	async getInventory(): Promise<any[]> {
		return this.fetchJson<any[]>('/api/inventory');
	}

	async updateInventory(itemId: number, quantity: number): Promise<any> {
		return this.fetchJson<any>(`/api/inventory/${itemId}`, {
			method: 'PUT',
			body: JSON.stringify({ quantity })
		});
	}
}

export const clientApi = new ClientApi();
