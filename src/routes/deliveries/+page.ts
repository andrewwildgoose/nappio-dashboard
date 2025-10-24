import type { PageLoad } from './$types';
import type { Delivery } from '$lib/types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/v1/admin/deliveries');
		
		if (!response.ok) {
			throw new Error(`Failed to fetch deliveries: ${response.statusText}`);
		}
		
		const deliveries: Delivery[] = await response.json();
		
		return {
			deliveries
		};
	} catch (error) {
		console.error('Error loading deliveries:', error);
		return {
			deliveries: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
};
