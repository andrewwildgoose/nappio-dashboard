// Type definitions for the Nappio dashboard

export interface DeliveryItem {
	name: string;
	quantity: number;
}

export interface DeliveryAddress {
	line1: string;
	line2?: string;
	city: string;
	postcode: string;
}

export interface DeliveryCustomer {
	name: string;
	email: string;
	phone: string;
}

export interface Delivery {
	id: string;
	customer: DeliveryCustomer;
	address: DeliveryAddress;
	items: DeliveryItem[];
}
