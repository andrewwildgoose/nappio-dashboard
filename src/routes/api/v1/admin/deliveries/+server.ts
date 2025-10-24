import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Delivery } from '$lib/types';

// Mock delivery data for demonstration
const mockDeliveries: Delivery[] = [
	{
		id: '1',
		customer: {
			name: 'John Smith',
			email: 'john.smith@example.com',
			phone: '+44 7700 900123'
		},
		address: {
			line1: '123 High Street',
			line2: 'Flat 4B',
			city: 'London',
			postcode: 'SW1A 1AA'
		},
		items: [
			{ name: 'Organic Milk', quantity: 2 },
			{ name: 'Sourdough Bread', quantity: 1 },
			{ name: 'Free-Range Eggs', quantity: 1 }
		]
	},
	{
		id: '2',
		customer: {
			name: 'Emma Johnson',
			email: 'emma.j@example.com',
			phone: '+44 7700 900456'
		},
		address: {
			line1: '45 Oak Avenue',
			city: 'Manchester',
			postcode: 'M1 2AB'
		},
		items: [
			{ name: 'Fresh Vegetables Box', quantity: 1 },
			{ name: 'Artisan Cheese Selection', quantity: 1 },
			{ name: 'Local Honey', quantity: 2 },
			{ name: 'Wholegrain Pasta', quantity: 3 }
		]
	},
	{
		id: '3',
		customer: {
			name: 'Michael Brown',
			email: 'michael.brown@example.com',
			phone: '+44 7700 900789'
		},
		address: {
			line1: '78 Park Lane',
			line2: 'Suite 12',
			city: 'Birmingham',
			postcode: 'B1 3CD'
		},
		items: [
			{ name: 'Coffee Beans', quantity: 2 },
			{ name: 'Almond Milk', quantity: 1 }
		]
	},
	{
		id: '4',
		customer: {
			name: 'Sarah Williams',
			email: 'sarah.williams@example.com',
			phone: '+44 7700 900321'
		},
		address: {
			line1: '22 Church Road',
			city: 'Bristol',
			postcode: 'BS1 4EF'
		},
		items: [
			{ name: 'Fruit Box - Seasonal', quantity: 1 },
			{ name: 'Greek Yogurt', quantity: 3 },
			{ name: 'Granola Mix', quantity: 1 },
			{ name: 'Orange Juice', quantity: 2 }
		]
	},
	{
		id: '5',
		customer: {
			name: 'David Taylor',
			email: 'david.t@example.com',
			phone: '+44 7700 900654'
		},
		address: {
			line1: '156 Victoria Street',
			line2: 'Apartment 7',
			city: 'Edinburgh',
			postcode: 'EH1 5GH'
		},
		items: [
			{ name: 'Sourdough Starter Kit', quantity: 1 },
			{ name: 'Organic Flour', quantity: 2 },
			{ name: 'Sea Salt', quantity: 1 }
		]
	},
	{
		id: '6',
		customer: {
			name: 'Lisa Anderson',
			email: 'lisa.anderson@example.com',
			phone: '+44 7700 900987'
		},
		address: {
			line1: '89 Riverside Walk',
			city: 'Leeds',
			postcode: 'LS1 6IJ'
		},
		items: [
			{ name: 'Vegan Meal Box', quantity: 1 },
			{ name: 'Coconut Milk', quantity: 2 },
			{ name: 'Chickpeas', quantity: 3 },
			{ name: 'Tahini', quantity: 1 },
			{ name: 'Fresh Herbs Bundle', quantity: 1 }
		]
	}
];

export const GET: RequestHandler = async () => {
	// Simulate a slight delay to show loading state
	await new Promise((resolve) => setTimeout(resolve, 300));

	return json(mockDeliveries);
};
